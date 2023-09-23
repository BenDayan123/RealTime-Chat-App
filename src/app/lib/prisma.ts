import { FriendShipStatus } from "@interfaces/user";
import { Prisma, PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
// globalForPrisma.prisma ||
const prismaClient = new PrismaClient({ log: ["warn"] });
export const prisma = prismaClient.$extends({
  query: {
    friendship: {
      async update({ args, query }) {
        const friendship = await query(args);
        const { requestedFromID, requestedToID, status } = friendship;
        console.log("update: ", status);
        if (status !== "ACCEPTED") return friendship;
        await prisma.conversion.create({
          data: {
            members: {
              connect: [{ id: requestedFromID }, { id: requestedToID }],
            },
          },
        });
        return friendship;
      },
    },
  },
  model: {
    user: {
      async getFriends(id: string, status?: FriendShipStatus) {
        const friendships = await prisma.friendship.findMany({
          where: {
            OR: [
              { ...(status === "ACCEPTED" && { requestedFromID: id }) },
              { requestedToID: id },
            ],
            status,
          },
          select: {
            requestedFrom: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
            requestedTo: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        });
        return friendships.map((friendship) =>
          friendship.requestedFrom.id === id
            ? friendship.requestedTo
            : friendship.requestedFrom
        );
      },
    },
    friendship: {
      async findFriendship(myID: string, friendID: string) {
        return await prisma.friendship.findFirst({
          where: {
            OR: [
              {
                requestedToID: myID,
                requestedFromID: friendID,
              },
              {
                requestedToID: friendID,
                requestedFromID: myID,
              },
            ],
          },
        });
      },
    },
  },
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma;

import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient }
// globalForPrisma.prisma || 
export const prisma = new PrismaClient({ log: ["warn"] })
.$extends({
  query:{
    user:{}
  },
  model:{
    user:{
      async getFriends(id: string){
        const user = await prisma.user.findUnique({
          where: { id },
          include:{
            friends: {
              where:{
                status: "PENDING"
              },
              include: {
                friend1: true,
                friend2: true,
              }
            },
            symmetricFriends: {
              where:{
                status: "PENDING"
              },
              include: {
                friend1: true,
                friend2: true,
              }
            },
          }
        });
        if(!user) return [];
        const { friends, symmetricFriends } = user;
        const friendsList:any = [];
        [...friends, ...symmetricFriends].map((friendship) => {
          friendsList.push(friendship.friend1.id === id ? friendship.friend2 : friendship.friend1);
        })
        return friendsList;
      }
    }
  }
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma;
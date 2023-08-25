import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient({ log: ["warn"] })
.$extends({
  query:{
    user:{
      // create({ args, query }){
      //   args.data.password = bcrypt.hashSync(args.data.password, salt)
      //   return query(args);
      // }
    }
  },
  model:{
    user:{
      
      // async addFriendShips(id1:string, id2: string) {
      //   await prisma.user.update({
      //     where: { id: id1 },
      //     data: { friends: { connect: [{ id: id2 }]} },
      //   });
      //   await prisma.user.update({
      //     where: { id: id2 },
      //     data: { friends: {connect: [{ id: id1 }]} },
      //   });
      //   return { user1: id1, user2: id2 };
      // }

    }
  }
});

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma;
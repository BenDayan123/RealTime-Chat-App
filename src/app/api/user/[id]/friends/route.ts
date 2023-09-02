import { NextResponse } from "next/server";
import { prisma } from "@lib/prisma";
import Pusher from "pusher";
import { Events } from "@lib/events";

const { PUSHER_APP_ID, PUSHER_CLIENT_KEY, PUSHER_SECERT, PUSHER_CLUSTER } = process.env;

const pusher = new Pusher({
  appId: PUSHER_APP_ID,
  key: PUSHER_CLIENT_KEY,
  secret: PUSHER_SECERT,
  cluster: PUSHER_CLUSTER,
  useTLS: true
})
interface Params{
  id: string;
}

export async function GET(_: Request, { params }: { params: Params }) {
  const { id } = params;
  const friends = await prisma.user.getFriends(id);
  return NextResponse.json(friends)
}

export async function POST(req: Request, { params }: { params: Params }){
  const { id: myID } = params;
  const { friendEmail } = await req.json()
  const friend = await prisma.user.findUnique({ where: { email: friendEmail }});
  if(friend){
    const isExist = await prisma.friendship.findFirst({
      where:{
        friend1ID: { in: [friend.id, myID] },
        friend2ID: { in: [friend.id, myID] }
      },
    })
    if(isExist)
      return NextResponse.json({ status: 401 });
    const friendship = await prisma.friendship.create({
      data: {
        friend1: { connect: { id: myID } },
        friend2: { connect: { id: friend.id }},
      }
    })
   
    await pusher.sendToUser(friend.id, Events.FRIEND_REQUEST, { id: myID, friendship });
    return NextResponse.json({ status: 201 })
  }
  return NextResponse.json({ status: 401 });
}
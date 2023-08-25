import { prisma } from "@lib/prisma";
import { NextResponse } from "next/server";
import Pusher from "pusher";

const { PUSHER_APP_ID, PUSHER_CLIENT_KEY, PUSHER_SECERT, PUSHER_CLUSTER } = process.env;

const pusher = new Pusher({
  appId: PUSHER_APP_ID,
  key: PUSHER_CLIENT_KEY,
  secret: PUSHER_SECERT,
  cluster: PUSHER_CLUSTER,
  useTLS: true
})

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const message = await prisma.message.findUnique({
    where: { id },
  });
  return NextResponse.json(message);
}

export async function POST(req: Request) {
  const { text, roomID } = await req.json();
  console.log({ text, roomID })
  pusher.trigger(roomID, "new-message", { body: text })
  return NextResponse.json({ success: true });
  // const { key, name } = await req.json();
  // await redisClient.set(key, name);
  // const storedValue = redisClient.get(key);
  // return NextResponse.json(storedValue);
}

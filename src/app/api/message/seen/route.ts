import { Events } from "@lib/events";
import { prisma } from "@lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import Pusher from "pusher";
import url from "url";

const { PUSHER_APP_ID, PUSHER_CLIENT_KEY, PUSHER_SECERT, PUSHER_CLUSTER } =
  process.env;

const pusher = new Pusher({
  appId: PUSHER_APP_ID,
  key: PUSHER_CLIENT_KEY,
  secret: PUSHER_SECERT,
  cluster: PUSHER_CLUSTER,
  useTLS: true,
});

export async function GET(_: Request) {
  await prisma.message.updateMany({
    data: {
      seen: false,
    },
  });
  return NextResponse.json("seen = false");
}

export async function POST(req: NextRequest) {
  const { messages, socket_id, channel_id } = await req.json();
  const query = await prisma.message.updateMany({
    where: { id: { in: messages }, seen: false },
    data: {
      seen: true,
    },
  });
  if (query.count > 0) {
    const res = await pusher.trigger(
      channel_id,
      Events.MESSAGE_SEEN,
      { messages },
      { socket_id }
    );
    return NextResponse.json(res);
  }
  return NextResponse.json("all messages already been seen");
}

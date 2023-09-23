import { Events } from "@lib/events";
import { prisma } from "@lib/prisma";
import { NextResponse } from "next/server";
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

export async function GET(req: Request) {
  const { channel_id } = url.parse(req.url, true).query;

  const message = await prisma.message.findMany({
    where: {
      chatID: channel_id as string,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      from: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
    },
  });
  return NextResponse.json(message);
}

export async function POST(req: Request) {
  const { body, channel_name, sender_id } = await req.json();
  const channel_id = (channel_name as string).split("@").at(-1);
  const message = await prisma.message.create({
    data: {
      body,
      from: { connect: { id: sender_id } },
      chat: { connect: { id: channel_id } },
    },
    include: {
      from: true,
    },
  });
  pusher.trigger(channel_name, Events.NEW_CHANNEL_MESSAGE, message);
  return NextResponse.json({ success: true });
}

// const { key, name } = await req.json();
// await redisClient.set(key, name);
// const storedValue = redisClient.get(key);
// return NextResponse.json(storedValue);

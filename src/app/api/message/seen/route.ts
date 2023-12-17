import { Events } from "@lib/events";
import { prisma } from "@lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import Pusher from "pusher";
import url from "url";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";

const { PUSHER_APP_ID, PUSHER_CLIENT_KEY, PUSHER_SECERT, PUSHER_CLUSTER } =
  process.env;

const pusher = new Pusher({
  appId: PUSHER_APP_ID,
  key: PUSHER_CLIENT_KEY,
  secret: PUSHER_SECERT,
  cluster: PUSHER_CLUSTER,
  useTLS: true,
});

// export async function GET(_: Request) {
//   await prisma.message.updateMany({
//     data: {
//       seen: false,
//     },
//   });
//   return NextResponse.json("seen = false");
// }

interface Params {
  messages: string[];
  socket_id: string;
  channel_id: string;
}

export async function POST(req: NextRequest) {
  const { messages, socket_id, channel_id } = (await req.json()) as Params;
  const session = await getServerSession(authOptions);
  const user = await prisma.user.update({
    where: { id: session?.user.id },
    data: {
      MessageSeen: {
        connect: messages.map((m) => ({ id: m })),
      },
    },
  });
  if (messages.length > 0 && user) {
    const { id, name, image } = user;
    const res = await pusher.trigger(
      channel_id,
      Events.MESSAGE_SEEN,
      { messages, seenBy: { id, name, image } },
      { socket_id },
    );
    return NextResponse.json(res);
  }
  return NextResponse.json("all messages already been seen");
}

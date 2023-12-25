import { IFile, MessageType } from "@interfaces/message";
import { Events } from "@lib/events";
import { prisma } from "@lib/prisma";
import { ExtractChannelID, groupBy } from "@lib/utils";
import { NextRequest, NextResponse } from "next/server";
import url from "url";
import { pusher } from "@lib/socket";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../pages/api/auth/[...nextauth]";

const MESSAGES_CHUNK = 10;

export async function GET(req: Request) {
  const { channel_id, cursor } = url.parse(req.url, true).query;
  const query = await prisma.message.findMany({
    where: {
      chatID: channel_id as string,
    },
    orderBy: {
      createdAt: "desc",
    },
    ...(cursor && {
      skip: +cursor * MESSAGES_CHUNK,
      take: MESSAGES_CHUNK,
    }),
    include: {
      from: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      reactions: {
        select: {
          emoji: true,
          user: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      },
      seen: {
        select: {
          id: true,
          image: true,
          name: true,
        },
      },
      replay: {
        select: {
          id: true,
          files: true,
          body: true,
          from: {
            select: {
              name: true,
            },
          },
        },
      },
      files: true,
      voice: true,
    },
  });
  const messages = query
    .map((message) => {
      const { reactions, ...rest } = message;
      return {
        ...rest,
        reactions: groupBy(
          reactions,
          (reaction) => reaction.emoji,
          (value) => value.user,
        ),
      };
    })
    .reverse();
  return NextResponse.json(messages);
}

type IForm = {
  files: IFile[];
  body: string;
  channel_name: string;
  sender_id: string;
  type?: MessageType;
  replay?: string;
};

function getMessageType(data: IForm): MessageType {
  const { files } = data;
  return files.length > 0 ? "MEDIA" : "TEXT";
}

export async function POST(req: NextRequest) {
  const data = (await req.json()) as IForm;
  const { body, channel_name, sender_id, files, type, replay } = data;
  const channel_id = ExtractChannelID(channel_name);
  const message = await prisma.message.create({
    data: {
      body,
      from: { connect: { id: sender_id } },
      type: type ?? getMessageType(data),
      files: {
        createMany: {
          data: files.map(({ url, size, uploadedAt }) => ({
            url,
            size,
            uploadedAt,
          })),
        },
      },
      ...(replay && { replay: { connect: { id: replay } } }),
      chat: { connect: { id: channel_id } },
    },
    include: {
      seen: true,
      replay: {
        select: {
          id: true,
          files: true,
          body: true,
          from: {
            select: {
              name: true,
            },
          },
        },
      },
      from: {
        select: {
          id: true,
          email: true,
          name: true,
          image: true,
        },
      },
      files: true,
      voice: true,
    },
  });
  pusher.trigger(channel_name, Events.NEW_CHANNEL_MESSAGE, message);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { messages, channel_id } = await req.json();
  const session = await getServerSession(authOptions);

  if (!channel_id)
    return NextResponse.json("'channel_id' was not provided", { status: 400 });

  await prisma.message.deleteMany({
    where: {
      fromID: session?.user.id,
      id: { in: messages as string[] },
    },
  });
  pusher.trigger(
    `presence-room@${channel_id}`,
    Events.MESSAGES_DELETED,
    messages,
  );
  return NextResponse.json(messages);
}

// const { key, name } = await req.json();
// await redisClient.set(key, name);
// const storedValue = redisClient.get(key);
// return NextResponse.json(storedValue);

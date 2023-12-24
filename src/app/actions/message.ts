"use server";

import { Events } from "@lib/events";
import { prisma } from "@lib/prisma";
import { ExtractChannelID } from "@lib/utils";
import { pusher } from "@lib/socket";
import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

interface Params {
  voice: {
    url: string;
    size: number;
    uploadedAt: Date;
  };
  channel_name: string;
  sender_id: string;
}

export const UploadVoiceMessage = async ({
  voice,
  channel_name,
  sender_id,
}: Params) => {
  const channel_id = ExtractChannelID(channel_name);
  const message = await prisma.message.create({
    data: {
      type: "AUDIO",
      from: { connect: { id: sender_id } },
      voice: { create: voice },
      chat: { connect: { id: channel_id } },
    },
    include: {
      from: true,
      files: true,
      replay: true,
      voice: true,
    },
  });
  await pusher.trigger(channel_name, Events.NEW_CHANNEL_MESSAGE, message);
};

export async function AddReaction(messageID: string, emoji: string) {
  const session = await getServerSession(authOptions);
  const userID = session?.user.id;
  const reaction = await prisma.reaction.findFirst({
    where: {
      messageId: messageID,
      emoji,
      user: { id: userID },
    },
    select: {
      message: {
        select: {
          chatID: true,
        },
      },
    },
  });
  if (reaction) {
    RemoveReaction(reaction.message.chatID, messageID, emoji);
    return;
  }

  const message = await prisma.message.update({
    where: {
      id: messageID,
      chat: {
        OR: [
          { members: { some: { id: userID } } },
          { admins: { some: { id: userID } } },
        ],
      },
    },
    data: {
      reactions: {
        create: {
          emoji,
          user: { connect: { id: userID } },
        },
      },
    },
  });
  if (message) {
    await pusher.trigger(
      `presence-room@${message.chatID}`,
      Events.REACTION_ADDED,
      { messageID, emoji, user: session?.user },
    );
  }
}

export async function RemoveReaction(
  chatID: string,
  messageID: string,
  emoji: string,
) {
  const session = await getServerSession(authOptions);
  await prisma.reaction.deleteMany({
    where: {
      messageId: messageID,
      emoji,
    },
  });
  await pusher.trigger(`presence-room@${chatID}`, Events.REACTION_REMOVED, {
    emoji,
    messageID,
    userID: session?.user.id,
  });
}

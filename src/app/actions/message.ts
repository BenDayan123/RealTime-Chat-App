"use server";

import { Events } from "@lib/events";
import { prisma } from "@lib/prisma";
import { ExtractChannelID } from "@lib/utils";
import { pusher } from "@lib/socket";

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
      voice: true,
    },
  });
  pusher.trigger(channel_name, Events.NEW_CHANNEL_MESSAGE, message);
};

import Pusher from "pusher";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@lib/prisma";
import { ExtractChannelID } from "@lib/utils";

const { PUSHER_APP_ID, PUSHER_CLIENT_KEY, PUSHER_SECERT, PUSHER_CLUSTER } =
  process.env;

const pusher = new Pusher({
  appId: PUSHER_APP_ID,
  key: PUSHER_CLIENT_KEY,
  secret: PUSHER_SECERT,
  cluster: PUSHER_CLUSTER,
  useTLS: false,
});

export default async function ChannelAuthPusherHandler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { socket_id, channel_name, ...user } = req.body;
  const { id } = user;
  const channel_id = ExtractChannelID(channel_name);
  const conversion = await prisma.conversion.findUnique({
    where: {
      id: channel_id,
      OR: [{ members: { some: { id } } }, { admins: { some: { id } } }],
    },
  });
  if (!conversion) return res.json(null);

  const presenceData = {
    user_info: user,
    user_id: id,
  };
  const authResponse = pusher.authorizeChannel(
    socket_id,
    channel_name,
    presenceData,
  );
  return res.json(authResponse);
}

export const config = {
  api: {
    bodyParser: true,
  },
};

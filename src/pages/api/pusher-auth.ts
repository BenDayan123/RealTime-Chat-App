import Pusher from 'pusher'
import { nanoid } from 'nanoid'
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@lib/prisma';

const { PUSHER_APP_ID, PUSHER_CLIENT_KEY, PUSHER_SECERT, PUSHER_CLUSTER } = process.env;

const pusher = new Pusher({
  appId: PUSHER_APP_ID,
  key: PUSHER_CLIENT_KEY,
  secret: PUSHER_SECERT,
  cluster: PUSHER_CLUSTER,
  useTLS: true
})

export default async function PusherHandler(req: NextApiRequest, res: NextApiResponse) {
    const { socket_id, channel_name, ...user } = req.body;
    const { id } = user;
    const friends = await prisma.user.findMany({
        where: { NOT: { id: id ?? "" }},
        select: {
          id: true,
        }
      });

    const presenceData = {
        watchlist: friends.map((friend) => friend.id ),
        user_info: { ...user },
        ...(channel_name) && { user_id : id },
        ...(!channel_name) && { id },
    };
    const authResponse = channel_name ? 
        pusher.authorizeChannel(socket_id, channel_name, presenceData) 
        : pusher.authenticateUser(socket_id, presenceData)
    return res.json(authResponse)
}

export const config = {
    api: {
        bodyParser: true,
    },
};
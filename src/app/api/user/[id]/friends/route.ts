import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@lib/prisma";
import Pusher from "pusher";
import { Events } from "@lib/events";
import { FriendShipStatus } from "@interfaces/user";
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
interface Params {
  id: string;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const { id } = params;
  const { status } = url.parse(req.url, true).query;
  const friends = (await prisma.user.getFriends(
    id,
    (status as FriendShipStatus) || undefined
  )) as any;
  return NextResponse.json(friends);
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { id: myID } = params;
  const { friendEmail } = await req.json();
  const [me, friend] = await Promise.all([
    prisma.user.findUnique({ where: { id: myID } }),
    prisma.user.findUnique({ where: { email: friendEmail } }),
  ]);
  if (!friend)
    return NextResponse.json(
      { message: "User does not exist" },
      { status: 401 }
    );
  const friendship = await prisma.friendship.findFriendship(myID, friend.id);

  if (Boolean(friendship)) {
    if (friendship?.status === "PENDING")
      return NextResponse.json(
        { message: "The Friend Request Already Been Sent!" },
        { status: 409 }
      );
    return NextResponse.json(
      { message: "The user Already Your Friend" },
      { status: 409 }
    );
  }

  const newFriendship = await prisma.friendship.create({
    data: {
      requestedFrom: { connect: { id: myID } },
      requestedTo: { connect: { id: friend.id } },
    },
  });

  await pusher.sendToUser(friend.id, Events.FRIEND_REQUEST, {
    user: me,
    newFriendship,
  });
  return NextResponse.json(
    { message: "Friend Request Sent!" },
    { status: 201 }
  );
}

type query = {
  status: FriendShipStatus;
  friend: string;
};

export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const { id } = params;
  const { status, friend } = url.parse(req.url, true).query as query;
  if (status !== "ACCEPTED" && status !== "PENDING") {
    return NextResponse.json(
      `status's value can only be 'ACCEPTED' or 'PENDING'`,
      { status: 400 }
    );
  }
  try {
    const friendship = await prisma.friendship.update({
      where: {
        id: {
          requestedFromID: friend,
          requestedToID: id,
        },
      },
      data: { status },
      include: {
        requestedFrom: true,
        requestedTo: true,
      },
    });

    const { name, image } = friendship.requestedTo;
    await pusher.sendToUser(friend, Events.FRIEND_STATUS_CHANGED, {
      message: `The Friend request has been ${status} from ${name}`,
      image,
    });
    return NextResponse.json(friendship);
  } catch {
    return NextResponse.json("Friendship cannot be found", { status: 404 });
  }
}

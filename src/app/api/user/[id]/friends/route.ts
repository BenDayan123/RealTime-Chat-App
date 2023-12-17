import { NextRequest, NextResponse } from "next/server";
import { prisma, exclude } from "@lib/prisma";
import { pusher } from "@lib/socket";
import { Events } from "@lib/events";
import { FriendShipStatus } from "@interfaces/user";
import url from "url";

interface Params {
  id: string;
}

export async function GET(req: NextRequest, { params }: { params: Params }) {
  const { id } = params;
  const { status } = url.parse(req.url, true).query;
  const friends = (await prisma.user.getFriends(
    id,
    (status as FriendShipStatus) || "PENDING",
  )) as any;
  return NextResponse.json(friends);
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { id: myID } = params;
  const { friendEmail } = await req.json();
  const [me, friend] = await Promise.all([
    prisma.user.findUnique({
      where: { id: myID },
      select: { id: true, image: true, name: true, email: true },
    }),
    prisma.user.findUnique({
      where: { email: friendEmail },
      select: { id: true, image: true, name: true, email: true },
    }),
  ]);
  if (!friend)
    return NextResponse.json(
      { message: "User does not exist" },
      { status: 401 },
    );
  if (myID === friend.id) {
    return NextResponse.json(
      { message: "You cant send friend request to yourself" },
      { status: 401 },
    );
  }
  const friendship = await prisma.friendship.findFriendship(myID, friend.id);

  if (Boolean(friendship)) {
    if (friendship?.status === "PENDING")
      return NextResponse.json(
        { message: "The Friend Request Already Been Sent!" },
        { status: 409 },
      );
    return NextResponse.json(
      { message: "The user Already Your Friend" },
      { status: 409 },
    );
  }

  const newFriendship = await prisma.friendship.create({
    data: {
      requestedFrom: { connect: { id: myID } },
      requestedTo: { connect: { id: friend.id } },
    },
  });

  await pusher.sendToUser(friend.id, Events.NEW_FRIEND_REQUEST, {
    user: {
      ...me,
      type: "ingoing",
    },
  });
  await pusher.sendToUser(myID, Events.NEW_FRIEND_REQUEST, {
    user: {
      ...friend,
      type: "outgoing",
    },
  });
  return NextResponse.json(
    { message: "Friend Request Sent!" },
    { status: 201 },
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
      { status: 400 },
    );
  }
  try {
    const data = await prisma.friendship.update({
      where: {
        id: {
          requestedFromID: friend,
          requestedToID: id,
        },
      },
      data: { status },
      include: {
        requestedFrom: {
          select: {
            id: true,
            image: true,
            name: true,
          },
        },
        requestedTo: {
          select: {
            id: true,
            image: true,
            name: true,
          },
        },
      },
    });
    const friendship = exclude(data, ["requestedFromID", "requestedToID"]);

    await pusher.sendToUser(friend, Events.FRIEND_STATUS_CHANGED, {
      status,
      friendship,
    });
    return NextResponse.json(friendship);
  } catch (e) {
    return NextResponse.json("Friendship cannot be found", { status: 404 });
  }
}

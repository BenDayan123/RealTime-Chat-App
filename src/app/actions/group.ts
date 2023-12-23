"use server";

import { Events } from "@lib/events";
import { prisma } from "@lib/prisma";
import { pusher } from "@lib/socket";
import { getServerSession } from "next-auth";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

export async function leaveGroup(chatID: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return;
  const { id: userID } = session.user;
  const group = await prisma.conversion.findUnique({
    where: { id: chatID, admins: { some: { id: userID } } },
    select: { admins: true, members: true },
  });
  const isAdmin = !!group,
    first = group?.members.at(0);
  if (isAdmin) {
    await prisma.conversion.update({
      where: { id: chatID },
      data: {
        admins: {
          disconnect: { id: userID },
          ...(group.admins.length === 1 && {
            connect: {
              id: first?.id,
            },
          }),
        },
        ...(group.admins.length === 1 && {
          members: {
            disconnect: {
              id: first?.id,
            },
          },
        }),
      },
    });
  } else {
    await prisma.conversion.update({
      where: { id: chatID },
      data: {
        members: {
          disconnect: { id: userID },
        },
      },
    });
  }
  await pusher.trigger(`presence-room@${chatID}`, Events.MEMBER_LEAVED, {
    newAdmin: first && group?.admins.length === 1 && first,
    member: session.user,
    wasAdmin: isAdmin,
  });
}

export async function addParticipants(chatID: string, participants: string[]) {
  const session = await getServerSession(authOptions);
  const query = participants.map((participant) => ({ id: participant }));
  await prisma.conversion.update({
    where: { id: chatID, admins: { some: { id: session?.user.id } } },
    data: { members: { connect: query } },
  });
  const users = await prisma.user.findMany({
    where: { id: { in: participants } },
    select: {
      id: true,
      image: true,
      name: true,
      email: true,
    },
  });
  await pusher.trigger(`presence-room@${chatID}`, Events.MEMBER_ADDED, users);
}

export async function removeParticipants(
  chatID: string,
  participants: string[],
) {
  const session = await getServerSession(authOptions);
  const query = participants.map((participant) => ({ id: participant }));
  const data = await prisma.conversion.update({
    where: { id: chatID, admins: { some: { id: session?.user.id } } },
    data: {
      members: {
        disconnect: query,
      },
      admins: {
        disconnect: query,
      },
    },
  });
  if (data) {
    await pusher.trigger(
      `presence-room@${chatID}`,
      Events.MEMBERS_REMOVED,
      participants,
    );
  }
}

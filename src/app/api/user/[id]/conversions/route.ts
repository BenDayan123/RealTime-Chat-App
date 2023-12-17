import { Form } from "@components/sidebar/CreateGroupForm";
import { Events } from "@lib/events";
import { prisma } from "@lib/prisma";
import { pusher } from "@lib/socket";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  id: string;
}

function ConversionSorting(a?: any, b?: any) {
  if (!b.messages.length) return 1;
  if (!a.messages.length) return -1;
  const { createdAt: ACreatedAt } = a.messages[0];
  const { createdAt: BCreatedAt } = b.messages[0];

  if (ACreatedAt > BCreatedAt) return -1;
  else if (ACreatedAt < BCreatedAt) return 1;
  return 0;
}

export async function GET(_: NextRequest, { params }: { params: Params }) {
  const { id } = params;
  const conversions = await prisma.conversion.findMany({
    where: {
      OR: [{ members: { some: { id } } }, { admins: { some: { id } } }],
    },
    select: {
      id: true,
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          createdAt: true,
        },
        take: 1,
      },
    },
  });
  return NextResponse.json(
    conversions.sort(ConversionSorting).map((chat) => chat.id),
  );
}

export async function POST(req: NextRequest, { params }: { params: Params }) {
  const { id } = params;
  const { image, group_name, users } = (await req.json()) as Form;
  const group = await prisma.conversion.create({
    data: {
      is_group: true,
      name: group_name,
      profile: image,
      members: { connect: users.map((user) => ({ id: user })) },
      admins: { connect: [{ id }] },
    },
  });

  await Promise.all(
    [id, ...users].map((user) =>
      pusher.sendToUser(user, Events.NEW_GROUP_CREATED, { id: group.id }),
    ),
  );
  return NextResponse.json(group);
}

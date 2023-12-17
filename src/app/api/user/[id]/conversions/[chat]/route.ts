import { exclude, prisma } from "@lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../../../pages/api/auth/[...nextauth]";
import { removeEmpty } from "@lib/utils";
import { pusher } from "@lib/socket";
import { Events } from "@lib/events";

interface Params {
  id: string;
  chat: string;
}

export async function GET(_: NextRequest, { params }: { params: Params }) {
  const { id, chat } = params;
  const conversion = await prisma.conversion.findUnique({
    where: {
      OR: [{ members: { some: { id } } }, { admins: { some: { id } } }],
      id: chat,
    },
    include: {
      members: {
        select: {
          id: true,
          image: true,
          name: true,
          email: true,
        },
      },
      admins: {
        select: {
          id: true,
          image: true,
          name: true,
          email: true,
        },
      },
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          body: true,
          createdAt: true,
        },
        take: 1,
      },
      _count: {
        select: {
          messages: {
            where: { NOT: { seen: { some: { id } } }, fromID: { not: id } },
          },
        },
      },
    },
  });
  if (!conversion) return NextResponse.json(null);

  const { _count, messages, is_group, members, admins, ...rest } = conversion;
  return NextResponse.json({
    ...rest,
    admins: admins ?? [],
    is_group,
    unseenCount: _count.messages,
    lastAction: messages[0] || null,
    members: !is_group
      ? members.filter((memeber) => memeber.id !== id)
      : members ?? [],
  });
}

type EditQuery = {
  description?: string;
  name?: string;
  profile?: string;
};
export async function PATCH(req: NextRequest, { params }: { params: Params }) {
  const { chat } = params;
  const session = await getServerSession(authOptions);
  const data = removeEmpty(await req.json()) as EditQuery;
  await prisma.conversion.update({
    where: {
      id: chat,
      OR: [
        { admins: { some: { id: session?.user.id } } },
        { members: { some: { id: session?.user.id } } },
      ],
    },
    data,
  });
  await pusher.trigger(`presence-room@${chat}`, Events.GROUP_EDITED, data);
  return NextResponse.json(data, { status: 201 });
}

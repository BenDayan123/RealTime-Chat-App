import { prisma } from "@lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../../../pages/api/auth/[...nextauth]";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function GET(request: NextRequest) {
  await sleep(200);
  const { query } = Object.fromEntries(new URL(request.url).searchParams);
  const session = await getServerSession(authOptions);
  if (!query) return NextResponse.json([]);
  const users = await prisma.user.findMany({
    where: {
      id: { not: session?.user.id },
      OR: [
        {
          name: {
            search: query,
          },
        },
        {
          email: {
            search: query,
          },
        },
      ],
    },
    select: {
      image: true,
      name: true,
      email: true,
      id: true,
    },
  });
  return NextResponse.json(users);
}

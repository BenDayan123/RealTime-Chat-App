import { NextResponse } from "next/server";
import { prisma } from "@lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const user = await prisma.user.findUnique({
    where: { id },
    include: { messages: true },
  });
  return NextResponse.json(user);
}

import { NextResponse } from "next/server";
import { prisma } from "@lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const friends = await prisma.user.findMany({
    where: { NOT: { id: id ?? "" }},
    select: {
      id: true,
      name: true,
      image: true
    }
  });
  return NextResponse.json(friends);
}

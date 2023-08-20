import { NextResponse } from "next/server";
import { prisma } from "@lib/prisma";

export async function POST(request: Request) {
  const user = await prisma.user.create({ data: await request.json() });
  return NextResponse.json(user);
}

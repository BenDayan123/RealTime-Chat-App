import { prisma } from "@lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const message = await prisma.message.findUnique({
    where: { id },
  });
  return NextResponse.json(message);
}

export async function POST(req: Request) {
  return NextResponse.json({ name: "frenkel" });
  // const { key, name } = await req.json();
  // await redisClient.set(key, name);
  // const storedValue = redisClient.get(key);
  // return NextResponse.json(storedValue);
}

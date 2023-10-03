import { prisma } from "@lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  id: string;
}

export async function GET(_: NextRequest, { params }: { params: Params }) {
  const { id } = params;
  const conversions = await prisma.conversion.findMany({
    where: {
      members: { some: { id } },
    },
    select: {
      id: true,
    },
  });
  return NextResponse.json(conversions.map((chat) => chat.id));
}

// conversions.map(({ _count, messages, ...conversion }) => ({
//   ...conversion,
//   unseenCount: _count.messages,
//   lastAction: messages[0] || null,
//   members: conversion.members.filter((memeber) => memeber.id !== id),
// }))

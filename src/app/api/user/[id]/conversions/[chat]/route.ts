import { prisma } from "@lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface Params {
  id: string;
  chat: string;
}

export async function GET(_: NextRequest, { params }: { params: Params }) {
  const { id, chat } = params;
  const conversion = await prisma.conversion.findUnique({
    where: {
      members: { some: { id } },
      id: chat,
    },
    include: {
      members: true,
      messages: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          body: true,
          updatedAt: true,
        },
        take: 1,
      },
      _count: {
        select: {
          messages: { where: { seen: false, fromID: { not: id } } },
        },
      },
    },
  });
  if (!conversion) return NextResponse.json(null);

  const { _count, messages } = conversion;

  return NextResponse.json({
    ...conversion,
    unseenCount: _count.messages,
    lastAction: messages[0] || null,
    members: conversion?.members.filter((memeber) => memeber.id !== id),
  });
}

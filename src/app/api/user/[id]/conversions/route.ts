import { prisma } from "@lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import url from "url";

interface Params {
  id: string;
}

export async function GET(_: NextRequest, { params }: { params: Params }) {
  const { id } = params;
  const conversions = await prisma.conversion.findMany({
    where: {
      members: { some: { id } },
    },
    include: {
      members: true,
      _count: {
        select: {
          messages: { where: { seen: false, fromID: { not: id } } },
        },
      },
    },
  });
  return NextResponse.json(
    conversions.map(({ _count, ...conversion }) => ({
      ...conversion,
      unseenCount: _count.messages,
      members: conversion.members.filter((memeber) => memeber.id !== id),
    }))
  );
}

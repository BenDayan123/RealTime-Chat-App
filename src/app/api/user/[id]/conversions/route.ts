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
    },
  });
  return NextResponse.json(
    conversions.map((conversion) => ({
      ...conversion,
      members: conversion.members.filter((memeber) => memeber.id !== id),
    }))
  );
}

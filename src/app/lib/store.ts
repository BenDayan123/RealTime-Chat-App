"use client";

// import { type EdgeStoreRouter } from "../../pages/api/edgestore/[...edgestore]";
import { type EdgeStoreRouter } from "../api/edgestore/[...edgestore]/route";
import { createEdgeStoreProvider } from "@edgestore/react";

export const { EdgeStoreProvider, useEdgeStore } =
  createEdgeStoreProvider<EdgeStoreRouter>();

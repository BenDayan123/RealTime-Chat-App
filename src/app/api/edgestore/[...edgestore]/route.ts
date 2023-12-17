import { initEdgeStore } from "@edgestore/server";
import { createEdgeStoreNextHandler } from "@edgestore/server/adapters/next/app";
import { EdgeStoreProvider } from "@edgestore/server/providers/edgestore";
import { prisma } from "@lib/prisma";

const es = initEdgeStore.create();

const { EDGE_STORE_ACCESS_KEY, EDGE_STORE_SECRET_KEY } = process.env;

const edgeStoreRouter = es.router({
  publicFiles: es.fileBucket().beforeDelete(async ({ ctx, fileInfo }) => {
    const { url } = fileInfo;
    await prisma.file.deleteMany({ where: { url } });
    return true;
  }),
  publicImages: es
    .imageBucket({
      maxSize: 1024 * 1024 * 10,
    })
    .beforeDelete(async ({ ctx, fileInfo }) => {
      const { url } = fileInfo;
      await prisma.file.deleteMany({ where: { url } });
      return true;
    }),
});

const handler = createEdgeStoreNextHandler({
  router: edgeStoreRouter,
  provider: EdgeStoreProvider({
    accessKey: EDGE_STORE_ACCESS_KEY,
    secretKey: EDGE_STORE_SECRET_KEY,
  }),
});

export { handler as GET, handler as POST };
export type EdgeStoreRouter = typeof edgeStoreRouter;

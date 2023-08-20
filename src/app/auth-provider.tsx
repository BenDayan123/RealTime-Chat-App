"use client";

import { useState } from "react";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import {
  QueryClient,
  QueryClientProvider,
  Hydrate,
} from "@tanstack/react-query";

type Props = {
  children?: React.ReactNode;
  session: Session | null;
};

const NextAuthProvider = ({ children, session }: Props) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <Hydrate>{children}</Hydrate>
      </QueryClientProvider>
    </SessionProvider>
  );
};

export default NextAuthProvider;

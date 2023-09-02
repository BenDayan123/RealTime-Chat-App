"use client";

import { PropsWithChildren, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getPusher } from "@lib/socket";
import { PusherProvider } from "@harelpls/use-pusher";

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  const { data, update } = useSession();
  const pusher = getPusher(data?.user);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    update().then(() => setLoading(false));
  }, [update]);

  if (loading) return null;

  return <PusherProvider {...pusher}>{children}</PusherProvider>;
};

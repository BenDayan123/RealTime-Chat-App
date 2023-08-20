"use client";

import { useSession } from "next-auth/react";

import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";

type IContext = Socket | null;

const SocketContext = createContext<IContext>(null);

export function useSocket() {
  return React.useContext(SocketContext);
}

export const SocketProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    // (async () => {
    //   const session = await update();
    // })();
    socketInitilizer(session);

    return () => {
      if (socket) socket.disconnect();
      setSocket(null);
    };
  }, []);

  async function socketInitilizer(session: any) {
    await fetch("/api/socket");
    setSocket(
      io({
        query: { user: session?.user?.id },
      })
    );
  }

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

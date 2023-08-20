import { PropsWithChildren } from "react";
import { SocketProvider } from "./useSocket";
import { ConversionsProvider } from "./useConversion";

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <SocketProvider>
      <ConversionsProvider>{children}</ConversionsProvider>
    </SocketProvider>
  );
};

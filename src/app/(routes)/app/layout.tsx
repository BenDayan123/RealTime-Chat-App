"use client";

import SideBar from "@components/sidebar";
import { IFriend, IStatus } from "@interfaces/user";
import { useCallback, useEffect, useState } from "react";
import { Events } from "@lib/events";
import { motion } from "framer-motion";
import { useFriend, useFriends } from "@hooks/useFriends";
import { useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { PusherProvider, usePusher } from "@hooks/usePusher";
import { ChatProvider, useChat } from "@hooks/useChat";
import { GlobalChannelListener } from "@hooks/EventListner";
import { useRouter } from "next/navigation";
import { useDarkMode } from "@hooks/useDarkMode";
import Info from "@components/ChatInfo";
import "react-toastify/dist/ReactToastify.css";
import "./style.scss";

interface WatchListEvent {
  name: IStatus;
  user_ids: string[];
}

function ChatLayout({ children }: { children: React.ReactNode }) {
  const { isDarkMode } = useDarkMode(true);
  const { data: session } = useSession();
  const pusher = usePusher();
  const queryClient = useQueryClient();
  const { key } = useFriends({ status: "ACCEPTED" });
  const { moveToAccepted } = useFriend();
  const { showInfo, chatID } = useChat();
  const watchlistEventHandler = useCallback((event: WatchListEvent) => {
    const { name, user_ids } = event;
    queryClient.setQueryData<IFriend[]>(key, (old) => {
      return old?.map((friend: any) => ({
        ...friend,
        status: user_ids.includes(friend.id) ? name : friend.status,
      }));
    });
  }, []);

  useEffect(() => {
    if (!pusher) return;
    pusher.signin();

    pusher.user.bind(Events.NEW_GROUP_CREATED, (group: { id: string }) => {
      queryClient.setQueryData<string[]>(
        ["conversions", session?.user.id],
        (old) => (old ? [...old, group.id] : []),
      );
    });

    pusher.user.bind(Events.NEW_FRIEND_REQUEST, (request: any) => {
      queryClient.setQueryData<IFriend[]>(
        ["friends", "PENDING", session?.user.id],
        (old: any) => {
          return [...(old || []), request.user];
        },
      );
      toast(`${request.user.name} send you a friend request!`, {
        position: "bottom-left",
        progress: undefined,
        theme: isDarkMode ? "dark" : "light",
      });
    });
    pusher.user.bind(Events.FRIEND_STATUS_CHANGED, (request: any) => {
      const { status, friendship } = request;
      status === "ACCEPTED" && moveToAccepted(friendship.requestedTo);

      toast(
        `${
          friendship.requestedTo.name
        } ${status.toLowerCase()} your friend request`,
        {
          position: "bottom-left",
          progress: undefined,
          theme: isDarkMode ? "dark" : "light",
        },
      );
    });
    pusher.user.watchlist.bind("online", watchlistEventHandler);
    pusher.user.watchlist.bind("offline", watchlistEventHandler);

    return () => {
      pusher.user.watchlist.unbind_all();
      pusher.user.unbind_all();
      pusher.disconnect();
    };
  }, [pusher]);

  return (
    <main className="application">
      <GlobalChannelListener />
      {/* <button
        className="absolute right-0 top-0 z-20 m-5 cursor-pointer rounded-circle bg-surface-dark p-4 dark:bg-surface-light"
        onClick={toggle}
      >
        {isDarkMode ? "🌑" : "☀️"}
      </button> */}
      <SideBar />
      <div
        id="main-window"
        className="h-full bg-background-light dark:bg-background-dark"
      >
        {children}
      </div>
      <Info show={showInfo} chatID={chatID} />
    </main>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const { data, update } = useSession();
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    if (!data?.user) {
      router.replace("/login");
    } else update().then(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <PusherProvider params={data?.user}>
      <ChatProvider>
        <ToastContainer />
        <ChatLayout>{children}</ChatLayout>
      </ChatProvider>
    </PusherProvider>
  );
}

/* <div className="h-full w-full rounded-3xl bg-background-light dark:bg-background-dark"> */
/* </div> */

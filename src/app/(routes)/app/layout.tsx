"use client";

import SideBar from "@components/sidebar";
import { IFriend, IStatus } from "@interfaces/user";
import { useEffect, useState } from "react";
import { Events } from "@lib/events";
import { useFriend, useFriends } from "@hooks/useFriends";
import { useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { PusherProvider, usePusher } from "@hooks/usePusher";
import { ChatProvider } from "@hooks/useChat";
import { GlobalChannelListener } from "@hooks/EventListner";
import { useRouter as useNav } from "next/navigation";
import { useDarkMode } from "@hooks/useDarkMode";
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

  useEffect(() => {
    if (!pusher) return;
    pusher.signin();

    function watchlistEventHandler(event: WatchListEvent) {
      const { name, user_ids } = event;
      queryClient.setQueryData<IFriend[]>(key, (old) => {
        return old?.map((friend: any) => ({
          ...friend,
          status: user_ids.includes(friend.id) ? name : friend.status,
        }));
      });
    }

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
      if (request.type === "ingoing") {
        toast(`${request.user.name} send you a friend request!`, {
          position: "bottom-left",
          progress: undefined,
          theme: isDarkMode ? "dark" : "light",
        });
      }
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
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [pusher]);

  return (
    <main className="application">
      <GlobalChannelListener />
      <SideBar />
      <div
        id="main-window"
        className="h-full bg-background-light dark:bg-background-dark"
      >
        {children}
      </div>
    </main>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useNav();
  const { data, update } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/login");
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    update().then(() => setLoading(false));
    // eslint-disable-line react-hooks/exhaustive-deps
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

"use client";

import SideBar from "@components/sidebar";
import { IFriend, IStatus } from "@interfaces/user";
import { useCallback, useEffect, useState } from "react";
import { Events } from "@lib/events";
import { useFriends } from "@hooks/useFriends";
import { useQueryClient } from "@tanstack/react-query";
import { PusherProvider, usePusher } from "@harelpls/use-pusher";
import { useSession } from "next-auth/react";
import { getPusher } from "@lib/socket";
import "./style.scss";

interface WatchListEvent {
  name: IStatus;
  user_ids: string[];
}

function ChatLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const { client: pusher } = usePusher();
  const queryClient = useQueryClient();
  const { key } = useFriends({ status: "ACCEPTED" });

  const watchlistEventHandler = useCallback((event: WatchListEvent) => {
    const { name, user_ids } = event;
    console.log({ event });
    queryClient.setQueryData<IFriend[]>(key, (old) => {
      return old?.map((friend: any) => {
        if (user_ids.includes(friend.id)) friend.status = name;
        return friend;
      });
    });
  }, []);

  useEffect(() => {
    pusher?.signin();
  }, [pusher]);

  useEffect(() => {
    if (!pusher) return;
    pusher.user.bind(Events.FRIEND_REQUEST, (request: any) => {
      queryClient.setQueryData<IFriend[]>(
        ["friends", "PENDING", session?.user.id],
        (old: any) => {
          return [...(old || []), request.user];
        }
      );
      new Notification(`${request.user.name} send you a friend request!`, {
        body: request.user.email,
        icon: "https://educate.io/images/App-Icon-p-500.png",
      });
    });
    pusher.user.bind(Events.FRIEND_STATUS_CHANGED, (request: any) => {
      new Notification(request.message, {
        icon: "https://educate.io/images/App-Icon-p-500.png",
      });
    });
    pusher.user.watchlist.bind("online", watchlistEventHandler);
    pusher.user.watchlist.bind("offline", watchlistEventHandler);

    return () => {
      pusher.user.unbind_all();
    };
  }, [pusher]);

  return (
    <main className="application">
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
  const { data, update } = useSession();
  const pusher = getPusher(data?.user);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    update().then(() => setLoading(false));
  }, []);

  if (loading) return null;

  return (
    <PusherProvider {...pusher}>
      <ChatLayout>{children}</ChatLayout>
    </PusherProvider>
  );
}

/* <div className="h-full w-full rounded-3xl bg-background-light dark:bg-background-dark"> */
/* </div> */

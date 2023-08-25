"use client";

import { useCallback, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { IFriend } from "@interfaces/user";
import ConversationTab from "@components/conversationTab";
import { usePusher } from "@harelpls/use-pusher";

interface WatchListEvent {
  name: "online" | "offline";
  user_ids: string[];
}

const SideBar: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const { client: pusher } = usePusher();
  const key = ["friends", session?.user.id];

  const { data: friends } = useQuery<IFriend[]>({
    queryKey: key,
    queryFn: async () => {
      const res = await fetch(`/api/user/${session?.user.id}/friends`);
      if (!res.ok) throw new Error("Network response was not ok");
      return res.json();
    },
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  const watchlistEventHandler = useCallback((event: WatchListEvent) => {
    const { name, user_ids } = event;
    queryClient.setQueryData(key, (old: any) => {
      return old?.map((friend: any) => {
        if (user_ids.includes(friend.id)) friend.status = name;
        return friend;
      });
    });
  }, []);

  useEffect(() => {
    pusher?.user.watchlist.bind("online", watchlistEventHandler);
    pusher?.user.watchlist.bind("offline", watchlistEventHandler);
  }, [pusher]);

  return (
    <div id="sidebar" className="bg-background-light dark:bg-background-dark">
      <div className="flex flex-col gap-1 p-3 overflow-auto">
        {friends?.map((friend) => {
          const { image, name, id, status } = friend;
          return (
            <ConversationTab
              key={id}
              id={id}
              image={image}
              name={name}
              time="02:31 PM"
              lastStatus={status || "IDLE"}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SideBar;

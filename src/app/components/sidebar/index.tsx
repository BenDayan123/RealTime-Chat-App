"use client";

import { useCallback, useEffect, useState } from "react";
import { MdPeopleAlt } from "react-icons/md";
import { useSession } from "next-auth/react";
import { IFriend, IStatus } from "@interfaces/user";
import ConversationTab from "@components/conversationTab";
import { usePusher } from "@harelpls/use-pusher";
import Item from "./item";
import { Events } from "@lib/events";

interface WatchListEvent {
  name: IStatus;
  user_ids: string[];
}

const SideBar: React.FC = () => {
  const { data: session } = useSession();
  const { client: pusher } = usePusher();
  // const queryClient = useQueryClient();
  // const key = ["friends", session?.user.id];
  const [friends, setFriends] = useState<IFriend[]>([]);

  useEffect(() => {
    fetch(`/api/user/${session?.user.id}/friends`)
      .then((res) => res.json())
      .then((body) => setFriends(body));
  });

  const watchlistEventHandler = useCallback((event: WatchListEvent) => {
    const { name, user_ids } = event;
    setFriends((old) => {
      return old?.map((friend: any) => {
        if (user_ids.includes(friend.id)) friend.status = name;
        return friend;
      });
    });
  }, []);

  useEffect(() => {
    pusher?.bind(Events.FRIEND_REQUEST, (data: any) =>
      alert(JSON.stringify(data, null, 2))
    );
    pusher?.user.watchlist.bind("online", watchlistEventHandler);
    pusher?.user.watchlist.bind("offline", watchlistEventHandler);

    return () => {
      pusher?.unbind_all();
    };
  }, [pusher,watchlistEventHandler]);

  return (
    <div id="sidebar" className="bg-surface-light dark:bg-surface-dark">
      <ul className="p-3">
        <Item icon={MdPeopleAlt} navTo="/app/friends">
          Friends
        </Item>
      </ul>
      <div className="flex flex-col gap-1 p-3 overflow-auto">
        {friends &&
          friends.map((friend) => {
            const { image, name, id, status } = friend;
            return (
              <ConversationTab
                key={id}
                id={id}
                image={image}
                name={name}
                time="02:31 PM"
                status={status}
                lastStatus={status || "offline"}
              />
            );
          })}
      </div>
    </div>
  );
};

export default SideBar;

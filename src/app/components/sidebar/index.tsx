"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { IFriend } from "@interfaces/user";
import ConversationTab from "@components/conversationTab";

const SideBar: React.FC = () => {
  const { data: session } = useSession();
  const { data: friends } = useQuery<IFriend[]>({
    queryKey: ["friends", session?.user.id],
    queryFn: async () => {
      const response = await fetch(`/api/user/${session?.user.id}/friends`);
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    },
    enabled: !!session?.user.id,
  });

  return (
    <div id="sidebar" className="bg-background-light dark:bg-background-dark">
      <div className="flex flex-col gap-1 p-3 overflow-auto">
        {friends?.map((friend) => {
          const { image, name, id } = friend;
          return (
            <ConversationTab
              key={id}
              id={id}
              image={image}
              name={name}
              time="02:31 PM"
              lastStatus="Typing..."
            />
          );
        })}
      </div>
    </div>
  );
};

export default SideBar;

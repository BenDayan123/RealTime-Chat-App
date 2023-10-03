"use client";

import React from "react";
import { MdPeopleAlt } from "react-icons/md";
import ConversationTab from "@components/ConversationTab";
import { useSession } from "next-auth/react";
import { useConversions } from "@hooks/useConversions";
import Item from "./item";
import ProfileStatus from "@components/ProfileStatus";
import { useFriends } from "@hooks/useFriends";

const SideBar: React.FC = () => {
  const conversions = useConversions();
  const { data: session } = useSession();
  const { data: friends } = useFriends({ status: "ACCEPTED" });
  // const friends = queryClient.getQueryData<IFriend[]>([
  //   "friends",
  //   "ACCEPTED",
  //   session?.user.id,
  // ]);

  return (
    <div
      id="sidebar"
      className="bg-surface-light dark:bg-surface-dark flex flex-col"
    >
      <ul className="p-3">
        <Item icon={MdPeopleAlt} navTo="/app/friends">
          Friends
        </Item>
      </ul>
      <div className="p-3 h-full overflow-y-auto max-h-full">
        {conversions &&
          conversions.map(({ data: conversion, isLoading }) => {
            if (!conversion) return null;
            const { id, is_group, members } = conversion;
            const status = !is_group
              ? friends?.find((friend) => friend.id === members[0].id)
                  ?.status || "offline"
              : undefined;
            return (
              <ConversationTab
                className="bg-surface-light dark:bg-surface-dark"
                key={id}
                isLoading={isLoading}
                status={status}
                {...conversion}
              />
            );
          })}
      </div>
      <ProfileStatus src={session?.user.image || ""} alt="" className="m-4" />
    </div>
  );
};

export default SideBar;

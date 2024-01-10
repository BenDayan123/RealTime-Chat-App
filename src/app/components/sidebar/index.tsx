"use client";

import React, { useState } from "react";
import { MdCreate, MdPeopleAlt, MdMoreHoriz } from "react-icons/md";
import ConversationTab from "@components/ConversationTab";
import { useSession } from "next-auth/react";
import { useConversions } from "@hooks/useConversions";
import ProfileStatus from "@components/ProfileStatus";
import { useFriends } from "@hooks/useFriends";
import Button from "@components/buttons/button";
import Item from "./item";
import { CreateGroupForm } from "./CreateGroupForm";
import { Dialog } from "@components/Dialog";
import { IUser } from "@interfaces/user";
import { Switch } from "@components/inputs/switch";
import { useDarkMode } from "@hooks/useDarkMode";
import { buttonStyle } from "@components/ChatInfo/pages/AddParticipants";
import Image from "next/image";
import { cn } from "@lib/utils";

const SideBar: React.FC = () => {
  const { conversions } = useConversions();
  const { data: session } = useSession();
  const { data: friends } = useFriends({ status: "ACCEPTED" });
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<IUser[]>([]);
  const { isDarkMode, toggle } = useDarkMode(true);

  const handleClose = () => {
    setIsOpen(false);
    setSelected([]);
  };

  return (
    <div
      id="sidebar"
      className="flex flex-col bg-surface-light dark:bg-surface-dark max-md:hidden"
    >
      <ul className="flex items-center gap-2 p-3">
        <Item icon={MdPeopleAlt} navTo="/app/friends" className="flex-1">
          Friends
        </Item>
        <Button
          className={cn(buttonStyle, "h-full w-auto rounded-lg")}
          onClick={() => setIsOpen(true)}
          icon={
            <MdCreate size={20} className="fill-gray-900 dark:fill-white" />
          }
        />
      </ul>
      <div className="h-full max-h-full overflow-y-auto p-3">
        {conversions &&
          conversions.map(({ data: conversion, isLoading }) => {
            if (!conversion) return null;
            const { id, is_group, members } = conversion;
            const status = !is_group
              ? friends?.find((friend) => friend.id === members[0]?.id)?.status
              : undefined;
            return (
              <ConversationTab
                className="bg-surface-light dark:bg-surface-dark"
                key={id}
                isLoading={isLoading}
                status={status ?? "offline"}
                {...conversion}
              />
            );
          })}
      </div>
      <div className="z-10 mx-auto my-3 flex h-16 max-w-[90%] items-center gap-4 rounded-full bg-white p-3 text-gray-800 dark:bg-gray-800/70 dark:text-gray-100">
        <ProfileStatus
          src={session?.user.image || ""}
          status="online"
          alt=""
          className="aspect-square h-full w-auto"
        />
        <div className="">
          <h1 className="font-bold">{session?.user.name}</h1>
          <p className="text-sm opacity-70">{session?.user.email}</p>
        </div>
        <div className="cursor-pointer justify-self-end rounded-full p-1 hover:bg-gray-200/50 hover:dark:bg-gray-500/50">
          {/* <MdMoreHoriz clasName="fill-gray-800 dark:fill-white" size={20} /> */}
          <Switch checked={isDarkMode} onChange={toggle} />
        </div>
      </div>
      <Dialog
        show={isOpen}
        onClose={handleClose}
        className="space-y-3 text-black dark:text-white"
      >
        <CreateGroupForm
          onSelected={(user) => setSelected((prev) => [...prev, user])}
          selected={selected}
          onSubmit={handleClose}
        />
      </Dialog>
    </div>
  );
};

export default SideBar;

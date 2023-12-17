"use client";

import React, { useState } from "react";
import { MdCreate, MdPeopleAlt } from "react-icons/md";
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
      className="flex flex-col bg-surface-light dark:bg-surface-dark"
    >
      <ul className="flex items-center gap-2 p-3">
        <Item icon={MdPeopleAlt} navTo="/app/friends" className="flex-1">
          Friends
        </Item>
        <Button
          className="aspect-square h-full w-fit"
          onClick={() => setIsOpen(true)}
          icon={<MdCreate size={20} />}
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
      <div className="flex items-center justify-between p-3">
        <ProfileStatus
          src={session?.user.image || ""}
          alt=""
          className="m-2 h-12 w-auto"
        />
        <Switch checked={isDarkMode} onChange={toggle} />
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

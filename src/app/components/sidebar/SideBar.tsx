"use client";
import React, { useState } from "react";
import { MdAdd, MdPeopleAlt } from "react-icons/md";
import ConversationTab from "@components/ConversationTab";
import { useSession } from "next-auth/react";
import { useConversions } from "@hooks/useConversions";
import { MdCreate, MdOutlineMode } from "react-icons/md";
import ProfileStatus from "@components/ProfileStatus";
import { useFriends } from "@hooks/useFriends";
import Button from "@components/buttons/button";
import { Dialog } from "@components/Dialog";
import Input from "@components/inputs/input";
import AvatarsGroup from "@components/AvatarsGroup";
import Item from "./item";
import AutoComplete from "@components/AutoComplete/index";
import { IUser } from "@interfaces/user";
import { ImageInput } from "@components/inputs/image";

export const SideBar: React.FC = () => {
  const { conversions } = useConversions();
  const { data: session } = useSession();
  const { data: friends } = useFriends({ status: "ACCEPTED" });
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<IUser[]>([]);
  const [profile, setProfile] = useState<File>(new File([""], "filename"));

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
          className="aspect-square h-full w-fit rounded-full"
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
      <Dialog
        show={isOpen}
        onClose={() => {
          setIsOpen(false);
          setSelected([]);
        }}
        className="space-y-3 text-black dark:text-white"
      >
        <h1 className="text-2xl font-bold">Create new Group</h1>
        <ImageInput
          input={{ name: "image" }}
          className="mx-auto"
          image={profile}
          onChangeFile={(image) => setProfile(image)}
        />
        <Input icon={MdOutlineMode} name="Group Name" />
        <AutoComplete
          onSelected={(user) => setSelected((prev) => [...prev, user])}
          selected={selected}
        />
        <AvatarsGroup images={selected.map((user) => user.image) ?? []} />
        <Button
          name="Create"
          className="ml-auto w-fit rounded-lg px-10"
          icon={<MdAdd size={20} />}
        />
      </Dialog>
    </div>
  );
};

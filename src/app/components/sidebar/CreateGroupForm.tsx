"use client";

import React, { useState } from "react";
import { MdAdd, MdOutlineMode } from "react-icons/md";
import Button from "@components/buttons/button";
import Input from "@components/inputs/input";
import AvatarsGroup from "@components/AvatarsGroup";
import AutoComplete from "@components/AutoComplete/index";
import { ImageInput } from "@components/inputs/image";
import { useEdgeStore } from "@lib/store";
import axios from "axios";
import { useSession } from "next-auth/react";

interface Props {
  onSelected: (data: any) => void;
  onSubmit?: () => void;
  selected: any[];
}

export interface Form {
  image: string;
  group_name: string;
  users: string[];
}

export const CreateGroupForm: React.FC<Props> = ({
  onSelected,
  selected,
  onSubmit,
}) => {
  const [profile, setProfile] = useState<File>(new File([""], "filename"));
  const { edgestore } = useEdgeStore();
  const { data: session } = useSession();

  const handleAction = async (form: FormData) => {
    const image = form.get("image") as File;
    const { url } = await edgestore.publicFiles.upload({
      file: image,
      input: {
        uuid: Math.random().toString(36).slice(-6),
      },
    });
    form.delete("add_user");
    const data = Object.fromEntries(form.entries());
    const res = await axios.post(`/api/user/${session?.user.id}/conversions`, {
      ...data,
      image: url,
      users: selected.map((user) => user.id),
    });
    onSubmit && void onSubmit();
  };

  return (
    <form action={handleAction} className="space-y-3">
      <h1 className="text-2xl font-bold">Create new Group</h1>
      <ImageInput
        input={{ name: "image" }}
        className="mx-auto"
        image={profile}
        onChangeFile={(image) => setProfile(image)}
      />
      <Input icon={MdOutlineMode} name="Group Name" />
      <AutoComplete onSelected={onSelected} selected={selected} />
      <AvatarsGroup images={selected.map((user) => user.image) ?? []} />
      <Button
        name="Create"
        type="submit"
        className="ml-auto w-fit rounded-lg px-10"
        icon={<MdAdd size={20} />}
      />
    </form>
  );
};

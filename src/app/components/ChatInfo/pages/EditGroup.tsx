import { motion } from "framer-motion";
import { Params, variants } from ".";
import Button from "@components/buttons/button";
import { MdArrowBack } from "react-icons/md";
import { buttonStyle } from "./AddParticipants";
import { useChat } from "@hooks/useChat";
import { useConversion } from "@hooks/useConversions";
import { ImageInput } from "@components/inputs/image";
import Input from "@components/inputs/input";
import TextareaAutosize from "react-textarea-autosize";
import { useState } from "react";
import { useEdgeStore } from "@lib/store";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

type EditQuery = {
  description?: string;
  name?: string;
  profile?: string;
};

export function EditGroupPage({ switchPage }: Params) {
  const { chatID } = useChat();
  const {
    profile: oldProfile,
    name: oldName,
    description: oldDescription,
  } = useConversion(chatID);
  const { data: session } = useSession();
  const [profile, setProfile] = useState<File | null>(null);
  const [name, setName] = useState(oldName);
  const [description, setDescription] = useState(oldDescription);
  const { edgestore } = useEdgeStore();
  const { mutate: EditGroup, isLoading } = useMutation({
    mutationFn: (data: EditQuery) => {
      return axios.patch(
        `/api/user/${session?.user.id}/conversions/${chatID}`,
        data,
      );
    },
    onSuccess: () => {
      toast.success("Info changed successfuly", {
        position: "bottom-left",
        progress: undefined,
        theme: "colored",
      });
      switchPage(0);
    },
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const profile = form.get("profile") as File;
    let file = null;
    if (profile.size !== 0) {
      file = await edgestore.publicImages.upload({ file: profile });
      oldProfile && (await edgestore.publicImages.delete({ url: oldProfile }));
    }
    const data = Object.fromEntries(form.entries());
    EditGroup({ ...data, profile: file?.url } as EditQuery);
  }

  return (
    <motion.div
      variants={variants}
      animate="animate"
      initial="initial"
      exit="exit"
      transition={{ duration: 0.4 }}
      className="h-full overflow-auto bg-surface-light p-7 dark:bg-surface-dark"
    >
      <div className="flex items-center gap-7">
        <Button
          onClick={() => switchPage(0)}
          icon={
            <MdArrowBack className="fill-gray-800 dark:fill-white" size={20} />
          }
          className={buttonStyle}
        />
        <h1 className="my-4 text-3xl font-bold text-gray-800 dark:text-white">
          Edit Group
        </h1>
      </div>
      <form onSubmit={handleSubmit}>
        <ImageInput
          input={{ name: "profile" }}
          onChangeFile={(image) => setProfile(image)}
          defaultImage={oldProfile}
          className="mx-auto"
        />
        <Input
          name="name"
          defaultValue={name}
          onChange={(e) => setName(e.currentTarget.value)}
          className="bg-background-light dark:bg-background-dark"
        />
        <TextareaAutosize
          name="description"
          minRows={1}
          rows={1}
          maxRows={10}
          defaultValue={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          className="w-full resize-none rounded-lg bg-background-light p-3 text-onBG-light outline-none dark:bg-background-dark dark:text-onBG-dark"
        />
        <Button type="submit" name="Update" loading={isLoading} />
      </form>
    </motion.div>
  );
}

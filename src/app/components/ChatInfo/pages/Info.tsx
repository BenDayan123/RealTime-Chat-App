import { useRouter } from "next/navigation";
import { leaveGroup } from "@actions/group";
import { usePusher } from "@hooks/usePusher";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { useConversion } from "@hooks/useConversions";
import { useChat } from "@hooks/useChat";
import { MdOutlineExitToApp, MdAdd, MdCreate } from "react-icons/md";
import Button from "@components/buttons/button";
import { IUser } from "@interfaces/user";
import { motion } from "framer-motion";
import UserRow from "(routes)/app/friends/UserRow";
import { Params, variants } from ".";
import { ShowMoreText } from "@components/ShowMoreText";
import { cn } from "@lib/utils";
import { buttonStyle } from "./AddParticipants";

export function InfoPage({ switchPage }: Params) {
  const { chatID } = useChat();
  const { members, profile, admins, name, isAdmin, description } =
    useConversion(chatID);
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const pusher = usePusher();
  const router = useRouter();

  async function handleLeaveGroup() {
    await leaveGroup(chatID);
    pusher?.channel(`presence-room@${chatID}`).disconnect();
    queryClient.removeQueries({
      queryKey: ["conversion", chatID, session?.user.id],
    });
    router.push("/app/friends");
  }

  return (
    <motion.div
      variants={variants}
      animate="animate"
      initial="initial"
      exit="exit"
      transition={{ duration: 0.4 }}
      className="h-full space-y-2 overflow-auto bg-surface-light p-7 dark:bg-surface-dark"
    >
      <Button
        className={cn(buttonStyle, "absolute right-0 top-0 z-50 m-5")}
        onClick={() => switchPage(2)}
        icon={<MdCreate size={25} className="fill-gray-900 dark:fill-white" />}
      />
      <div className="space-y-1">
        <img
          src={profile}
          alt={chatID}
          className="mx-auto aspect-square w-[30%] rounded-circle object-cover"
        />
        <p
          className="text-center text-2xl font-bold"
          onChange={(e) => console.log(e.currentTarget.innerText)}
        >
          {name}
        </p>
        <p className="text-center opacity-80">
          Group • {members.length + admins.length} Participants
        </p>
      </div>

      {description ? (
        <ShowMoreText
          className="my-2 rounded-lg bg-background-light p-4 dark:bg-background-dark"
          text={description}
        />
      ) : (
        <div
          className="group mb-2 inline-flex w-full cursor-pointer items-center gap-3 rounded-lg bg-background-light px-5 py-2 text-blue-500 hover:bg-blue-500 hover:text-white dark:bg-background-dark dark:hover:bg-blue-500"
          onClick={() => switchPage(2)}
        >
          <div className="rounded-circle bg-blue-400/40 p-2 group-hover:bg-white/40 dark:bg-blue-900/40">
            <MdCreate
              className="fill-blue-500 transition-none group-hover:fill-white"
              size={20}
            />
          </div>
          Add Description
        </div>
      )}

      <p className="mb-2 text-xl">
        {members.length + admins.length} Participants
      </p>
      {isAdmin && (
        <div
          className="group mb-2 inline-flex w-full cursor-pointer items-center gap-3 rounded-lg bg-background-light px-5 py-2 text-blue-500 hover:bg-blue-500 hover:text-white dark:bg-background-dark dark:hover:bg-blue-500"
          onClick={() => switchPage(1)}
        >
          <div className="rounded-circle bg-blue-400/40 p-1 group-hover:bg-white/40 dark:bg-blue-900/40">
            <MdAdd
              className="fill-blue-500 transition-none group-hover:fill-white"
              size={30}
            />
          </div>
          Add Participants
        </div>
      )}
      {admins.map((user) => (
        <Item
          isAdmin
          name={user.name}
          key={user.id}
          image={user.image}
          id={user.id}
        />
      ))}
      {members.map((user) => (
        <Item name={user.name} image={user.image} key={user.id} id={user.id} />
      ))}
      <Button
        name="Leave Group"
        onClick={() => handleLeaveGroup()}
        icon={<MdOutlineExitToApp className="fill-white" size={20} />}
        className="w-full cursor-pointer rounded-lg bg-red-500/70 p-3 text-white transition-all hover:bg-red-700 active:scale-95"
      />
    </motion.div>
  );
}

const Item: React.FC<IUser & { isAdmin?: boolean }> = ({
  id,
  image,
  name,
  isAdmin = false,
}) => {
  const { data: session } = useSession();

  return (
    <UserRow
      id={id}
      image={image}
      name={name}
      description={session?.user.id === id ? "You" : ""}
      className="my-1 border-b-gray-500 bg-background-light dark:bg-background-dark"
    >
      {isAdmin && (
        <p className="rounded-full bg-green-400/40 px-6 py-1 text-green-500 dark:bg-green-800/40">
          Admin
        </p>
      )}
    </UserRow>
  );
};

import { MdArrowBack, MdSearch } from "react-icons/md";
import Button from "@components/buttons/button";
import { motion } from "framer-motion";
import UserRow from "(routes)/app/friends/UserRow";
import Input from "@components/inputs/input";
import { CheckBox } from "@components/inputs/checkbox";
import { useFriends } from "@hooks/useFriends";
import { Params, variants } from ".";
import { useCallback, useState } from "react";
import { cn } from "@lib/utils";
import { useChat } from "@hooks/useChat";
import { useConversion } from "@hooks/useConversions";
import { addParticipants } from "@actions/group";

export const buttonStyle =
  "aspect-square w-fit rounded-circle border-2 border-tran bg-gray-700/20 transition-all hover:border-black/70 hover:bg-gray-700/40 active:scale-95 dark:bg-white/20 hover:dark:border-white/70 dark:hover:bg-white/30";

export function AddParticipantsPage({ switchPage }: Params) {
  const { data: friends } = useFriends({ status: "ACCEPTED" });
  const [isLoading, setLoading] = useState(false);
  const { chatID } = useChat();
  const { members, admins } = useConversion(chatID);

  const IsDisabled = useCallback(
    (friendID: string) => {
      return (
        !!members.find((u) => u.id === friendID) ||
        !!admins.find((u) => u.id === friendID)
      );
    },
    [admins, members],
  );

  async function handleFormAction(data: FormData) {
    setLoading(false);
    await addParticipants(chatID, Array.from(data.values()) as string[]);
    setLoading(true);
    switchPage(0);
  }

  return (
    <motion.div
      className="h-full origin-center overflow-auto bg-surface-light p-7 dark:bg-surface-dark"
      variants={variants}
      animate="animate"
      initial="initial"
      transition={{ duration: 0.4 }}
      exit="exit"
    >
      <Button
        onClick={() => switchPage(0)}
        icon={
          <MdArrowBack className="fill-gray-800 dark:fill-white" size={20} />
        }
        className={buttonStyle}
      />
      <h1 className="my-4 text-3xl font-bold text-gray-800 dark:text-white">
        Add Friends
      </h1>
      <Input
        name="Search"
        icon={MdSearch}
        className="bg-background-light dark:bg-background-dark"
      />
      <form action={handleFormAction}>
        {friends?.map((friend) => (
          <UserSelection
            id={friend.id}
            key={friend.id}
            image={friend.image}
            name={friend.name}
            description=""
            disabled={IsDisabled(friend.id)}
          />
        ))}
        <Button name="Add" type="submit" loading={isLoading} />
      </form>
    </motion.div>
  );
}

function UserSelection(
  props: React.ComponentProps<typeof UserRow> & { disabled: boolean },
) {
  const [checked, setChecked] = useState(false);
  const { id, name, disabled } = props;
  return (
    <UserRow
      {...props}
      onClick={() => !disabled && setChecked((p) => !p)}
      className={cn(
        "hover:bg-gray-100 hover:dark:bg-gray-700/30",
        checked && "bg-gray-200 dark:bg-gray-700/60",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      <CheckBox
        value={id}
        checked={checked}
        name={name}
        disabled={disabled}
        onChange={() => setChecked((p) => !p)}
      />
    </UserRow>
  );
}

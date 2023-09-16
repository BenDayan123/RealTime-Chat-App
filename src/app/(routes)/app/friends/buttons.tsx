import Button from "@components/buttons/button";
import { useFriend } from "@hooks/useFriends";
import { cn } from "@lib/utils";
import { MdClose, MdCheck } from "react-icons/md";

const style =
  "w-12 h-12 aspect-square group rounded-full bg-surface-light dark:bg-surface-dark hover:bg-surface-light hover:dark:bg-surface-dark";
const iconsBaseStyle = "fill-onSurface-light dark:fill-onSurface-dark";

interface Props {
  userID: string;
}

export const AcceptButton: React.FC<Props> = ({ userID }) => {
  const { acceptRequest, isLoading } = useFriend();
  return (
    <Button
      loading={isLoading}
      onClick={() => acceptRequest({ friendID: userID })}
      icon={
        <MdCheck
          size={25}
          className={cn("group-hover:fill-green-500", iconsBaseStyle)}
        />
      }
      className={style}
    />
  );
};

export const IgnoreButton: React.FC<Props> = ({ userID }) => {
  return (
    <Button
      icon={
        <MdClose
          size={25}
          className={cn("group-hover:fill-red-500", iconsBaseStyle)}
        />
      }
      className={style}
    />
  );
};

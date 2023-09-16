"use client";

import { useRouter } from "next/navigation";
import ProfileStatus from "./ProfileStatus";
import { cn } from "@lib/utils";
import { useFriend } from "@hooks/useFriends";
import { IStatus } from "@interfaces/user";

interface Props {
  name: string;
  lastStatus: string;
  time?: string;
  image: string;
  id: string;
  className?: string;
  status?: IStatus;
}

const ConversationTab: React.FC<Props> = ({
  name,
  id,
  image,
  lastStatus,
  className,
  status,
  time,
}) => {
  const router = useRouter();
  const { acceptRequest } = useFriend();
  return (
    <div
      className={cn(
        "relative flex justify-around items-center py-2 px-5 my-1 overflow-hidden select-none rounded-lg gap-4 cursor-pointer",
        className
      )}
      onClick={() => router.push(`/app/chat/${id}`)}
    >
      <ProfileStatus
        className="rounded-full aspect-square object-cover"
        src={image}
        alt={name}
        width={35}
        height={35}
        status={status}
      />
      <div className="flex-1">
        <p className="text-onBG-light dark:text-onBG-dark font-bold">{name}</p>
        <p className="text-onSurface-light dark:text-onSurface-dark opacity-70 font-thin">
          {lastStatus}
        </p>
      </div>
      {time && (
        <p className="text-onSurface-light dark:text-onSurface-dark opacity-70 text-sm">
          {time}
        </p>
      )}
    </div>
  );
};

export default ConversationTab;

"use client";

import { usePathname, useRouter } from "next/navigation";
import ProfileStatus from "./ProfileStatus";
import { cn } from "@lib/utils";
import { IStatus } from "@interfaces/user";

interface Props {
  name: string;
  lastStatus: string;
  time?: string;
  image: string;
  id: string;
  unseenCount?: number;
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
  unseenCount,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div
      className={cn(
        "relative flex justify-around items-center py-2 px-5 my-1 overflow-hidden select-none rounded-lg gap-4 cursor-pointer",
        className,
        pathname === `/app/chat/${id}` &&
          "bg-background-light dark:bg-background-dark"
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
      <div className="flex flex-col items-center gap-1">
        {time && (
          <p className="text-onSurface-light dark:text-onSurface-dark opacity-70 text-sm">
            {time}
          </p>
        )}
        {!!unseenCount && unseenCount > 0 && (
          <div className="text-white bg-red-500 aspect-square rounded-full p-1 h-5 w-5 text-[.6em] text-center">
            {unseenCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationTab;

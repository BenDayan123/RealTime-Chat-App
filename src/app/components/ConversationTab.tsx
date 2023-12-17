"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import ProfileStatus from "./ProfileStatus";
import { cn, toTimeFormat } from "@lib/utils";
import { IStatus } from "@interfaces/user";
import { useConversion } from "@hooks/useConversions";
import { IConversion } from "@interfaces/conversion";
import { useMessages } from "@hooks/useMessages";
import dayjs from "dayjs";

interface Props extends IConversion {
  className?: string;
  status?: IStatus;
  isLoading: boolean;
}
// name: string;
//   lastStatus: string;
//   time?: string;
//   image: string;
//   id: string;
//   unseenCount?: number;
//   className?: string;
//   status?: IStatus;
const ConversationTab: React.FC<Props> = ({
  id,
  profile,
  members,
  is_group,
  name: title,
  status,
  className,
  unseenCount,
  isLoading,
}) => {
  const { liveAction } = useConversion(id);
  const { data: messages } = useMessages(id);
  const router = useRouter();
  const pathname = usePathname();

  const image = profile || members[0]?.image;
  const name = is_group ? title : members[0]?.name;
  const lastAction = useMemo(
    () => (messages ? messages.pages[0].at(-1) : undefined),
    [messages],
  );
  // const time = lastAction && toTimeFormat(lastAction?.updatedAt);
  const date = lastAction && dayjs(lastAction.updatedAt);
  const time = date?.format(
    (dayjs(new Date()).diff(date, "day") || 0) > 0 ? "DD/MM/YYYY" : "HH:mm",
  );
  const currentAction = getCurrentAction();

  function getCurrentAction() {
    switch (liveAction?.type) {
      case "TYPING": {
        return "is typing...";
      }
      case "RECORDING": {
        return "is recording...";
      }
    }
    if (lastAction?.files && lastAction.files.length > 0)
      return `${lastAction.files.length} attachments 📂`;
    if (lastAction?.voice) return "🎙️ voice message";
    if (lastAction?.body) return lastAction?.body;
  }

  if (isLoading) return <Skeleton />;

  return (
    <div
      className={cn(
        "relative my-1 flex cursor-pointer select-none items-center justify-around gap-4 overflow-hidden rounded-lg px-5 py-2",
        "hover:bg-background-light hover:dark:bg-background-dark",
        className,
        pathname === `/app/chat/${id}` &&
          "bg-background-light dark:bg-background-dark",
      )}
      onClick={() => router.push(`/app/chat/${id}`)}
    >
      <ProfileStatus
        src={image}
        alt={name}
        width={35}
        height={35}
        status={!is_group ? status : undefined}
      />
      <div className="flex-1 overflow-hidden">
        <p className="font-bold text-onBG-light dark:text-onBG-dark">{name}</p>
        <p
          className={cn(
            "truncate font-thin text-onSurface-light/70 dark:text-onSurface-dark/70",
            liveAction?.type && "text-blue-400 dark:text-blue-400",
          )}
          title={currentAction}
        >
          {currentAction}
        </p>
      </div>
      <div className="flex flex-col items-center gap-1">
        {time && (
          <p
            className={cn(
              "text-sm text-onSurface-light opacity-70 dark:text-onSurface-dark",
              unseenCount > 0 && "font-bold text-blue-500 dark:text-blue-500",
            )}
          >
            {time}
          </p>
        )}
        {!!unseenCount && unseenCount > 0 && (
          <div className="aspect-square h-5 w-5 self-end rounded-full bg-blue-500 p-1 text-center text-[.6em] text-white">
            {/* {unseenCount > 9 ? "9+" : unseenCount} */}
            {unseenCount}
          </div>
        )}
      </div>
    </div>
  );
};

const Skeleton: React.FC = () => {
  return (
    <div className="relative my-1 select-none rounded-lg bg-background-light px-5 py-2 dark:bg-background-dark">
      <div className="flex animate-pulse items-center justify-around gap-4 overflow-hidden">
        <div className="h-[50px] w-[50px] rounded-full bg-slate-700"></div>
        <div className="h-full w-full flex-1 overflow-hidden">
          <p className="mb-3 h-4 rounded-md bg-slate-700"></p>
          <p className="h-4 rounded-md bg-slate-700"></p>
        </div>
      </div>
    </div>
  );
};

export default ConversationTab;

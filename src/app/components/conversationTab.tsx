"use client";

import { usePathname, useRouter } from "next/navigation";
import ProfileStatus from "./ProfileStatus";
import { cn, toTimeFormat } from "@lib/utils";
import { IStatus } from "@interfaces/user";
import { useConversion } from "@hooks/useConversions";
import { IConversion } from "@interfaces/conversion";

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
  title,
  status,
  lastAction,
  className,
  unseenCount,
  isLoading,
}) => {
  const { liveAction } = useConversion(id);
  const router = useRouter();
  const pathname = usePathname();

  const image = profile || members[0].image;
  const name = is_group ? title : members[0].name;
  const time = lastAction && toTimeFormat(lastAction?.updatedAt);

  if (isLoading) return <Skeleton />;

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
      <div className="flex-1 overflow-hidden">
        <p className="text-onBG-light dark:text-onBG-dark font-bold">{name}</p>
        <p className="text-onSurface-light dark:text-onSurface-dark opacity-70 font-thin truncate">
          {liveAction || lastAction?.body || "offline"}
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

const Skeleton: React.FC = () => {
  return (
    <div className="relative py-2 px-5 my-1 select-none rounded-lg bg-background-light dark:bg-background-dark">
      <div className="flex justify-around items-center overflow-hidden animate-pulse gap-4">
        <div className="bg-slate-700 rounded-full w-[50px] h-[50px]"></div>
        <div className="flex-1 w-full overflow-hidden h-full">
          <p className="bg-slate-700 h-4 mb-3 rounded-md"></p>
          <p className="bg-slate-700 h-4 rounded-md"></p>
        </div>
      </div>
    </div>
  );
};

export default ConversationTab;

"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import ProfileStatus from "./profileStatus";

interface Props {
  name: string;
  lastStatus: string;
  time?: string;
  image: string;
  id: string;
  status?: "online" | "offline";
}

const ConversationTab: React.FC<Props> = ({
  name,
  id,
  image,
  lastStatus,
  status,
  time,
}) => {
  const router = useRouter();
  return (
    <div
      className="flex justify-around items-center py-3 overflow-hidden select-none rounded-lg px-5 gap-4 hover:bg-background-light cursor-pointer hover:dark:bg-background-dark"
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

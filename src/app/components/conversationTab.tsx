"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  name: string;
  lastStatus: string;
  time: string;
  image: string;
  id: string;
}

const ConversationTab: React.FC<Props> = ({
  name,
  id,
  image,
  lastStatus,
  time,
}) => {
  const router = useRouter();
  return (
    <div
      className="flex justify-around py-3 overflow-hidden select-none rounded-lg px-5 gap-4 hover:bg-surface-light cursor-pointer hover:dark:bg-surface-dark"
      onClick={() => router.push(`/chat/${id}`)}
    >
      <Image
        className="rounded-full aspect-square object-cover"
        src={image}
        alt={name}
        width={50}
        height={50}
      />
      <div className="flex-1">
        <p className="text-onBG-light dark:text-onBG-dark font-bold">{name}</p>
        <p className="text-onSurface-light dark:text-onSurface-dark opacity-70 font-thin">
          {lastStatus}
        </p>
      </div>
      <p className="text-onSurface-light dark:text-onSurface-dark opacity-70 text-sm">
        {time}
      </p>
    </div>
  );
};

export default ConversationTab;

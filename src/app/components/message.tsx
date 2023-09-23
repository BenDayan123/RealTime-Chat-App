"use client";

import { PropsWithChildren, memo, useEffect } from "react";
import { cn } from "@lib/utils";
import { MdDoneAll } from "react-icons/md";
import ProfileStatus from "./ProfileStatus";
import { useInView } from "react-intersection-observer";

interface Props {
  id: string;
  mine: boolean;
  isConnected?: boolean;
  sender: string;
  seen?: boolean;
  profile?: string;
  time?: string;
  onView?: (inView: boolean) => void;
}

const Message: React.FC<PropsWithChildren<Props>> = ({
  children,
  mine,
  id,
  sender,
  isConnected,
  profile,
  seen,
  time,
  onView,
}) => {
  const { ref, inView } = useInView({ triggerOnce: true });

  useEffect(() => {
    onView && onView(inView);
  }, [inView]);

  return (
    <div
      ref={ref}
      className={cn(
        "max-w-[50%] w-fit select-none flex gap-2",
        mine && "self-end"
      )}
    >
      {profile && !mine && (
        <ProfileStatus
          className={cn("self-center", isConnected && "invisible")}
          src={profile}
          alt=""
          height={35}
          width={35}
        />
      )}
      <div>
        {!mine && !isConnected && (
          <p className="text-onBG-light text-sm font-bold dark:text-onBG-dark my-1">
            {sender}
          </p>
        )}
        <div
          className={cn(
            "py-2 px-4 font-light rounded-md w-fit whitespace-pre-line break-words relative",
            mine ? "bg-surface-dark text-white" : "bg-surface-light text-black",
            !isConnected && "rounded-tl-none"
          )}
          // bg-blue-400
        >
          {children}
          <div className="flex justify-end gap-x-2">
            {time && (
              <p className="opacity-75 text-right text-[.7rem]">{time}</p>
            )}
            {mine && (
              <MdDoneAll
                className={cn(seen ? "fill-green-400" : "fill-white")}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Message);

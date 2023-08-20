import { PropsWithChildren } from "react";
import { cn } from "@lib/utils";

interface Props {
  mine: boolean;
  sender: string;
}

const Message: React.FC<PropsWithChildren<Props>> = ({
  children,
  mine,
  sender,
}) => {
  return (
    <div className={cn("max-w-[50%] w-fit select-none", mine && "self-end")}>
      {!mine && <p className="text-white text-sm">{sender}</p>}
      <div
        className={cn(
          "p-3 font-light rounded-md whitespace-pre-line break-words",
          mine && "bg-blue-400 text-white",
          !mine && "bg-primary-light text-black"
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default Message;

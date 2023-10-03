import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { cn } from "@lib/utils";

interface Props extends ImageProps {
  status?: "online" | "offline";
}

const ProfileStatus: React.FC<Props> = ({ status, ...props }) => {
  const { className, ...rest } = props;
  const [isLoading, setLoading] = useState(false);

  if (isLoading)
    return (
      <div
        className={cn(
          "bg-slate-700 animate-pulse rounded-full w-[50px] h-[50px]"
        )}
      ></div>
    );

  return (
    <div
      className={cn(
        "relative bg-inherit transition-none rounded-full",
        className
      )}
    >
      <Image
        className={
          "rounded-full aspect-square object-cover pointer-events-none"
        }
        onLoadingComplete={() => setLoading(false)}
        width={50}
        height={50}
        {...rest}
      />
      {status && (
        <div className="absolute -bottom-[6px] -right-[6px] p-[4px] bg-inherit transition-none rounded-full">
          <div
            className={cn(
              "w-3 aspect-square rounded-full",
              status === "online" ? "bg-[#46dc7c]" : "bg-gray-400"
            )}
          ></div>
        </div>
      )}
    </div>
  );
};

export default ProfileStatus;

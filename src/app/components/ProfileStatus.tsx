import { cn } from "@lib/utils";
// import { useState } from "react";
// import Image, { ImageProps } from "next/image";
// import { SkeletonImage } from "./Skeletons/image";

interface Props
  extends React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > {
  status?: "online" | "offline";
}

const ProfileStatus: React.FC<Props> = ({ status, ...props }) => {
  const { className, ...rest } = props;

  return (
    <div
      className={cn(
        "relative rounded-full bg-inherit transition-none",
        className,
      )}
    >
      <img
        className="pointer-events-none aspect-square h-full rounded-full object-cover"
        alt=""
        {...rest}
      />
      {status && (
        <div className="absolute -bottom-[6px] -right-[6px] rounded-full bg-inherit p-[4px] transition-none">
          <div
            className={cn(
              "aspect-square w-3 rounded-full",
              status === "online" ? "bg-green-500" : "bg-gray-400",
            )}
          ></div>
        </div>
      )}
    </div>
  );
};

export default ProfileStatus;

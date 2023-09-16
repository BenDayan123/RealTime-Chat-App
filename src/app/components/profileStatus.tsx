import Image, { ImageProps } from "next/image";
import { cn } from "@lib/utils";

interface Props extends ImageProps {
  status?: "online" | "offline";
}

const ProfileStatus: React.FC<Props> = ({ status, ...rest }) => {
  return (
    <div className="relative bg-inherit transition-none">
      <Image
        className="rounded-full aspect-square object-cover"
        width={50}
        height={50}
        {...rest}
      />
      {status && (
        <div className="absolute -bottom-1 -right-1 p-[3px] bg-inherit transition-none rounded-full">
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

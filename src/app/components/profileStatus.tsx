import Image, { ImageProps } from "next/image";
import { cn } from "@lib/utils";

interface Props extends ImageProps {
  status?: "online" | "offline";
}

const ProfileStatus: React.FC<Props> = ({ status, ...rest }) => {
  return (
    <div className="relative">
      <Image
        className="rounded-full aspect-square object-cover"
        width={50}
        height={50}
        {...rest}
      />
      {status && (
        <div
          className={cn(
            "absolute -bottom-1 -right-1 w-4 aspect-square rounded-full border-[3px] border-surface-dark",
            status === "online" ? "bg-[#46dc7c]" : "bg-gray-500"
          )}
        ></div>
      )}
    </div>
  );
};

export default ProfileStatus;

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
            "absolute bottom-0 right-0 w-4 h-4 rounded-full border-[0px] border-background-dark",
            status === "online" ? "bg-green-500" : "bg-gray-500"
          )}
        ></div>
      )}
    </div>
  );
};

export default ProfileStatus;

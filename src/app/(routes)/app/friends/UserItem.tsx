import ProfileStatus from "@components/ProfileStatus";
import { IStatus } from "@interfaces/user";
import { cn } from "@lib/utils";
import { NextPage } from "next";

interface Props {
  name: string;
  description: string;
  image: string;
  id: string;
  status?: IStatus;
  buttons: React.ReactNode[] | React.ReactNode;
  className?: string;
}
const UserItem: NextPage<Props> = ({
  name,
  description,
  image,
  className,
  id,
  status,
  buttons,
}) => {
  return (
    <div
      className={cn(
        "relative flex justify-around items-center py-2 bg-inherit whitespace-pre px-5 my-2 overflow-hidden select-none rounded-lg gap-4 cursor-pointer",
        className
      )}
    >
      <ProfileStatus
        src={image}
        alt={name}
        status={status}
        width={35}
        height={35}
      />
      <div className="flex-1">
        <p className="text-onBG-light dark:text-onBG-dark font-bold">{name}</p>
        <p className="text-onSurface-light dark:text-onSurface-dark opacity-70 font-thin">
          {description}
        </p>
      </div>
      {buttons}
    </div>
  );
};

export default UserItem;

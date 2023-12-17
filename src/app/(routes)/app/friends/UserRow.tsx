import ProfileStatus from "@components/ProfileStatus";
import { IStatus } from "@interfaces/user";
import { cn } from "@lib/utils";
import { NextPage } from "next";
import { PropsWithChildren } from "react";

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  name: string;
  description: string;
  image: string;
  id: string;
  status?: IStatus;
}
const UserRow: NextPage<PropsWithChildren<Props>> = ({
  name,
  description,
  image,
  className,
  status,
  children,
  ...rest
}) => (
  <div
    className={cn(
      "relative my-2 flex cursor-pointer select-none items-center justify-around gap-4 overflow-hidden whitespace-pre rounded-lg bg-inherit px-5 py-2",
      className,
    )}
    {...rest}
  >
    <ProfileStatus
      src={image}
      alt={name}
      status={status}
      width={35}
      height={35}
    />
    <div className="flex-1">
      <p className="font-bold text-onBG-light dark:text-onBG-dark">{name}</p>
      <p className="font-thin text-onSurface-light opacity-70 dark:text-onSurface-dark">
        {description}
      </p>
    </div>
    {children}
  </div>
);

export default UserRow;

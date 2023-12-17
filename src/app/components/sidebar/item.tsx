import React from "react";
import { PropsWithChildren } from "react";
import { IconType } from "react-icons";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@lib/utils";

interface Props
  extends React.DetailedHTMLProps<
    React.LiHTMLAttributes<HTMLLIElement>,
    HTMLLIElement
  > {
  icon?: IconType;
  navTo?: string;
}

const Item: React.FC<PropsWithChildren<Props>> = ({
  children,
  icon: Icon,
  navTo,
  className,
}) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <li
      onClick={() => navTo && router.push(navTo)}
      className={cn(
        `flex cursor-pointer select-none items-center
       gap-4 rounded-lg px-6 py-4 text-onBG-light hover:bg-background-light dark:text-onBG-dark hover:dark:bg-background-dark`,
        pathname === navTo && "bg-onBG-dark dark:bg-onBG-light",
        className,
      )}
    >
      {Icon && <Icon size={30} />}
      {children}
    </li>
  );
};

export default Item;

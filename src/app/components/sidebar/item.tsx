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
}) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <li
      onClick={() => navTo && router.push(navTo)}
      className={cn(
        `hover:bg-background-light text-onBG-light dark:text-onBG-dark hover:dark:bg-background-dark
       cursor-pointer py-4 px-6 rounded-lg select-none flex items-center gap-4`,
        pathname === navTo && "bg-onBG-dark dark:bg-onBG-light"
      )}
    >
      {Icon && <Icon size={30} />}
      {children}
    </li>
  );
};

export default Item;

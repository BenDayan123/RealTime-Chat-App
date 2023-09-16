"use client";

import { PropsWithChildren } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@lib/utils";

interface Props
  extends React.DetailedHTMLProps<
    React.LiHTMLAttributes<HTMLLIElement>,
    HTMLLIElement
  > {
  to: string;
}

const Item: React.FC<PropsWithChildren<Props>> = ({
  children,
  className,
  to,
}) => {
  const pathname = usePathname();
  return (
    <Link
      href={to}
      className={cn(
        "text-onSurface-light dark:text-onSurface-dark py-2 px-4 rounded-md select-none cursor-pointer",
        "hover:text-surface-dark dark:hover:bg-surface-dark",
        pathname === to && "bg-surface-light dark:bg-surface-dark",
        className
      )}
    >
      {children}
    </Link>
  );
};

export default Item;

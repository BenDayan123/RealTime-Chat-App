"use client";

import { PropsWithChildren } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn, normalizeUrl } from "@lib/utils";

interface Props
  extends React.DetailedHTMLProps<
    React.LiHTMLAttributes<HTMLLIElement>,
    HTMLLIElement
  > {
  to: string;
  counter?: number;
}

const Item: React.FC<PropsWithChildren<Props>> = ({
  children,
  className,
  counter,
  to,
}) => {
  const pathname = usePathname();
  return (
    <Link
      href={to}
      className={cn(
        "flex-center relative cursor-pointer select-none rounded-md px-7 py-2 text-onSurface-light dark:text-onSurface-dark",
        "hover:text-surface-dark hover:no-underline dark:hover:bg-surface-dark",
        pathname === normalizeUrl(to) &&
          "bg-surface-light dark:bg-surface-dark",
        className,
      )}
    >
      {counter && counter !== 0 && (
        <span className="flex-center absolute right-0 top-0 aspect-square h-5 w-5 -translate-y-1/2 translate-x-1/2 rounded-full bg-blue-500 text-xs text-white">
          {counter > 9 ? `${counter}+` : counter}
        </span>
      )}
      {children}
    </Link>
  );
};

export default Item;

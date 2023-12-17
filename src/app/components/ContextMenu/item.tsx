import { cn } from "@lib/utils";
import React, { PropsWithChildren, ReactNode } from "react";
import { IconType } from "react-icons";

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  icon?: IconType | ReactNode;
  divide?: boolean;
  show?: boolean;
}

export const Item: React.FC<PropsWithChildren<Props>> = ({
  className,
  children,
  icon: Icon,
  divide = false,
  show = true,
  ...rest
}) => {
  if (!show) return false;
  return (
    <>
      <div
        {...rest}
        className={cn(
          "flex cursor-pointer select-none items-center gap-1 rounded-md p-2 hover:bg-gray-700/10 dark:text-white dark:hover:bg-white/10",
          className,
        )}
      >
        {Icon && React.isValidElement(Icon) && Icon}
        {children}
      </div>
      {divide && (
        <hr className="my-1 h-[1px] w-full bg-gray-900/50 dark:bg-white dark:opacity-20"></hr>
      )}
    </>
  );
};

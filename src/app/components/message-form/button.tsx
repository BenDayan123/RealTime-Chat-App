import { cn } from "@lib/utils";
import React, { PropsWithChildren } from "react";

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLElement>,
    HTMLElement
  > {}

export const Button: React.FC<PropsWithChildren<Props>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <i
      {...rest}
      className={cn(
        "flex-center group relative cursor-pointer rounded-lg bg-onBG-light bg-opacity-0 p-3 hover:bg-opacity-30 active:scale-90 dark:bg-onBG-dark dark:bg-opacity-0 hover:dark:bg-opacity-10",
        className,
      )}
    >
      {children}
    </i>
  );
};

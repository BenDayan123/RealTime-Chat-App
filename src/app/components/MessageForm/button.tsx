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
        "flex-center group relative cursor-pointer rounded-lg bg-tran p-3 hover:bg-onBG-light/10 active:scale-90 hover:dark:bg-onBG-dark/10",
        className,
      )}
    >
      {children}
    </i>
  );
};

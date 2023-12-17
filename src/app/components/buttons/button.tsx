import React, { ReactNode } from "react";
import { PropsWithChildren } from "react";
import { cn } from "@lib/utils";
import { IconType } from "react-icons";
import LineSpinner from "@components/loaders/lineSpinner";

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  loading?: boolean;
  icon?: IconType | ReactNode;
}

const Button: React.FC<PropsWithChildren<Props>> = ({
  children,
  className,
  name,
  icon: Icon,
  loading = false,
  ...rest
}) => {
  return (
    <button
      className={cn(
        "flex h-12 w-full cursor-pointer items-center justify-center gap-3 overflow-hidden rounded-lg bg-blue-700 p-3 text-white transition-all hover:bg-blue-600 active:scale-90",
        className,
      )}
      type="button"
      {...rest}
    >
      {loading ? (
        <LineSpinner size={20} />
      ) : (
        <>
          {Icon && React.isValidElement(Icon) && Icon}
          {name && <div>{name}</div>}
        </>
      )}
    </button>
  );
};

export default Button;

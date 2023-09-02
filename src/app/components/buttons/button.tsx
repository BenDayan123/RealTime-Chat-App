import React from "react";
import { PropsWithChildren } from "react";
import LoadingSpinner from "@components/loadingSpinner";
import { cn } from "@lib/utils";
import { IconType } from "react-icons";

interface Props
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  loading?: boolean;
  icon?: IconType;
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
        "my-4 w-full h-12 rounded-lg flex flex-wrap items-center justify-center gap-3 bg-blue-700 p-3 text-white transition-all hover:bg-blue-600 active:scale-90 overflow-hidden",
        className
      )}
      type="button"
      {...rest}
    >
      {loading ? (
        <LoadingSpinner fill="fill-white" size="w-6 h-6" />
      ) : (
        <>
          {Icon && <Icon size={25} />}
          <div>{name}</div>
        </>
      )}
    </button>
  );
};

export default Button;

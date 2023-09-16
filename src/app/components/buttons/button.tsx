import React, { ReactNode } from "react";
import { PropsWithChildren } from "react";
import { cn } from "@lib/utils";
import { IconType } from "react-icons";
import { Pulsar } from "@uiball/loaders";

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
        "w-full h-12 rounded-lg flex flex-wrap items-center justify-center gap-3 bg-blue-700 p-3 text-white transition-all hover:bg-blue-600 active:scale-90 overflow-hidden",
        className
      )}
      type="button"
      {...rest}
    >
      {loading ? (
        <Pulsar size={25} speed={1.75} color="white" />
      ) : (
        // <LoadingSpinner fill="fill-white" size="w-6 h-6" />
        <>
          {Icon && React.isValidElement(Icon) && Icon}
          {name && <div>{name}</div>}
        </>
      )}
    </button>
  );
};

export default Button;

"use client";

import { cn } from "@lib/utils";
import { PropsWithChildren, useState } from "react";
import { MdCheck } from "react-icons/md";

interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {}

export const CheckBox: React.FC<PropsWithChildren<Props>> = ({
  className,
  checked,
  ...rest
}) => {
  const { disabled } = rest;
  return (
    <div
      className={cn(
        "checked relative mx-2 h-5 w-5 cursor-pointer rounded border-gray-300 bg-gray-200 focus-within:ring-2 focus-within:ring-blue-500 dark:border-gray-600 dark:bg-background-dark dark:ring-offset-gray-800 dark:focus-within:ring-blue-600",
        checked && !disabled && "bg-blue-500 dark:bg-blue-500",
        disabled && "pointer-events-none opacity-50",
        className,
      )}
    >
      <input
        type="checkbox"
        {...rest}
        checked={disabled ? false : checked}
        className="peer h-full w-full opacity-0"
      />
      <MdCheck
        className="absolute-center pointer-events-none fill-white opacity-0 peer-checked:opacity-100"
        size={16}
      />
    </div>
  );
};

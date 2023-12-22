import React from "react";
import { motion } from "framer-motion";
import { cn } from "@lib/utils";

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export const Switch: React.FC<Props> = ({ checked, onChange, className }) => {
  //70px- width
  return (
    <div
      className={cn(
        "relative flex aspect-video w-[44px] cursor-pointer justify-start rounded-full bg-gray-400/40 p-1 transition-colors dark:bg-white/40",
        checked && "justify-end bg-blue-500 dark:bg-blue-500",
        className,
      )}
      tabIndex={0}
      onClick={() => onChange(!checked)}
    >
      <motion.div
        className="max-w-1/2 aspect-square rounded-full bg-white"
        layout
        transition={spring}
      ></motion.div>
    </div>
  );
};

const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30,
};

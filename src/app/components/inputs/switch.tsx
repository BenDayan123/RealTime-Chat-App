import React from "react";
import { motion } from "framer-motion";
import { cn } from "@lib/utils";

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Switch: React.FC<Props> = ({ checked, onChange }) => {
  return (
    <div
      className={cn(
        "relative flex aspect-video w-[70px] cursor-pointer justify-start rounded-full bg-gray-400/40 p-1 transition-colors dark:bg-white/40",
        checked && "justify-end bg-blue-500 dark:bg-blue-500",
      )}
      onClick={() => onChange(!checked)}
    >
      <motion.div
        className="aspect-square w-1/2 rounded-full bg-white"
        layout
        transition={spring}
      />
    </div>
  );
};

const spring = {
  type: "spring",
  stiffness: 700,
  damping: 30,
};

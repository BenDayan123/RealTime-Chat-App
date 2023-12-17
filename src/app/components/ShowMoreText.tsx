import { cn } from "@lib/utils";
import { HTMLMotionProps, motion } from "framer-motion";
import { PropsWithChildren, useMemo, useState } from "react";

interface Props extends HTMLMotionProps<"p"> {
  text: string;
}

export const ShowMoreText: React.FC<Props> = ({
  text,
  className,
  ...props
}) => {
  const [isHidden, setIsHidden] = useState(text.length > 50);

  return (
    <div className="relative overflow-hidden">
      <motion.p
        suppressContentEditableWarning={true}
        {...props}
        className={cn(
          "relative overflow-hidden whitespace-pre-line transition-all",
          isHidden && "line-clamp-3",
          className,
        )}
      >
        {text}
      </motion.p>
      {isHidden && (
        <div
          onClick={() => setIsHidden(false)}
          className="absolute bottom-0 left-1/2 flex h-full w-full -translate-x-1/2 cursor-pointer select-none items-end justify-center rounded-lg bg-gradient-to-t from-background-light to-tran dark:from-background-dark"
        >
          <p className="m-2 text-center text-lg font-bold text-gray-700 transition-all hover:scale-110 dark:text-gray-200">
            Show more...
          </p>
        </div>
      )}
    </div>
  );
};

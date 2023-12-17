import { cn } from "@lib/utils";
import { PropsWithChildren } from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";

interface Props extends HTMLMotionProps<"div"> {
  show: boolean;
  onClose: () => void;
}

export const Dialog: React.FC<PropsWithChildren<Props>> = ({
  className,
  show,
  onClose,
  children,
  ...rest
}) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          {...rest}
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          className="flex-center fixed inset-0 z-50 bg-black/60 transition-all duration-300"
          onClick={onClose}
        >
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.9 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={cn(
              "w-full max-w-md overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl dark:bg-background-dark",
              className,
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

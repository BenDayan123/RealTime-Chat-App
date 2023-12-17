import { motion, AnimatePresence } from "framer-motion";
import { EditGroupPage, InfoPage, AddParticipantsPage } from "./pages";
import { useState } from "react";

interface Props {
  show: boolean;
  chatID: string;
}

const Info: React.FC<Props> = ({ show }) => {
  const [page, setPage] = useState(0);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute right-0 top-0 z-30 h-full w-[25vw] bg-surface-light text-gray-700 dark:bg-surface-dark dark:text-white"
          animate={{ opacity: 1, x: 0 }}
          initial={{ opacity: 0, x: "100%" }}
          exit={{ opacity: 0, x: "100%" }}
          onAnimationComplete={() => setPage(0)}
          transition={{
            type: "spring",
            bounce: 0,
            duration: 0.7,
            delayChildren: 0.3,
            staggerChildren: 0.05,
          }}
        >
          {
            [
              <InfoPage switchPage={(p) => setPage(p)} key={0} />,
              <AddParticipantsPage switchPage={(p) => setPage(p)} key={1} />,
              <EditGroupPage switchPage={(p) => setPage(p)} key={2} />,
            ][page]
          }
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Info;

import { AnimatePresence, motion } from "framer-motion";

interface Props {
  images: string[];
  animate?: boolean;
}

const AvatarsGroup: React.FC<Props> = ({ images, animate = true }) => {
  return (
    <div className="mt-3 flex -space-x-3 overflow-hidden p-1">
      <AnimatePresence>
        {images.map((image, i) => (
          <motion.img
            className="inline-block h-12 w-12 rounded-full object-cover ring-4 ring-white dark:ring-background-dark"
            animate={animate ? { x: [50, 0] } : {}}
            transition={{ type: "spring", damping: 5 }}
            src={image}
            key={i}
            alt=""
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AvatarsGroup;

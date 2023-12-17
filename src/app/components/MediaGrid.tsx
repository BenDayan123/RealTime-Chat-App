import { IFile } from "@interfaces/message";
import { cn } from "@lib/utils";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Props {
  images?: IFile[];
}

export const MediaGrid: React.FC<Props> = ({ images }) => {
  if (!images || images?.length === 0) return;
  const firstImages = images.slice(0, 4);
  const leftImages = images.length - firstImages.length;

  return (
    <div
      className={cn(
        "gallery relative grid max-w-[350px] grid-flow-dense auto-rows-fr grid-cols-[repeat(2,_1fr)] gap-2 rounded-lg max-xl:max-w-full",
        firstImages.length === 1 && "grid-cols-[repeat(1,1fr)]",
        firstImages.length % 2 === 0 && "grid-cols-[repeat(2,_1fr)]",
        firstImages.length === 3 && "grid-cols-[repeat(3,_1fr)]",
      )}
    >
      {firstImages.map(({ url, id: fileID }, i) => (
        <div
          key={fileID}
          className="relative aspect-square overflow-hidden rounded-xl"
        >
          {i === firstImages.length - 1 && leftImages > 0 && (
            <div className="flex-center absolute h-full w-full select-none bg-black bg-opacity-70">
              <h1 className="text-5xl">+{leftImages}</h1>
            </div>
          )}
          <CellGrid src={url} alt={fileID} />
        </div>
      ))}
    </div>
  );
};

const CellGrid: React.FC<
  React.DetailedHTMLProps<
    React.ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  >
> = ({ alt, src, ...props }) => {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <img
        {...props}
        src={src}
        alt={alt}
        className="aspect-auto h-full w-full object-cover transition-all hover:scale-110"
        onClick={() => setOpen((p) => !p)}
      />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="flex-center fixed left-1/2 top-1/2 z-[99999] h-screen w-screen -translate-x-1/2 -translate-y-1/2 bg-black/80"
            onClick={() => setOpen(false)}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              type: "spring",
              bounce: 0,
              duration: 0.7,
              delayChildren: 0.3,
              staggerChildren: 0.05,
            }}
          >
            <motion.img
              onClick={(e) => e.stopPropagation()}
              transformTemplate={({ scale }) => `scale(${scale})`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              src={src}
              alt={alt}
              transition={{
                type: "spring",
                bounce: 0,
                duration: 0.7,
                delayChildren: 0.3,
                staggerChildren: 0.05,
              }}
              className="h-3/4 origin-center rounded-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

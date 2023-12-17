import mime from "mime";
import { FaFile } from "react-icons/fa";
import { useMemo } from "react";
import { SkeletonImage } from "./Skeletons/image";
import { formatFileSize } from "@edgestore/react/utils";
import { VoicePlayer } from "./VoicePlayer";

interface Props {
  url: string;
  size: number;
}

export const MessageFile: React.FC<Props> = ({ url, size }) => {
  const [type] = useMemo(() => {
    const mimeFile = mime.getType(url);
    return mimeFile?.split("/") || [];
  }, [url]);

  switch (type) {
    case "video": {
      return (
        <video
          className="aspect-auto h-auto w-[27em] rounded-lg"
          src={url}
          controls
        />
      );
    }
    case "audio": {
      return (
        <VoicePlayer
          audio={url}
          className="bg-surface-light dark:bg-surface-dark"
        />
      );
    }
    default: {
      return (
        <a
          className="m-1 flex cursor-pointer select-none items-center gap-2 rounded-md border border-white border-opacity-30 bg-white bg-opacity-80 p-4 shadow-md backdrop-blur-xl hover:bg-opacity-100 hover:no-underline dark:border-black dark:border-opacity-30 dark:bg-black dark:bg-opacity-20 dark:shadow-none dark:hover:bg-opacity-30"
          href={url}
          target="_blank"
          download
        >
          <FaFile size={30} className="fill-gray-900 dark:fill-white" />
          <div className="text-gray-900 dark:text-white">
            <p className="font-bold">{url.split("/").at(-1)}</p>
            <p className="text-gray-500 opacity-80">
              {formatFileSize(size)}, {type} file
            </p>
          </div>
        </a>
      );
    }
  }
};

// case "image": {
//   return (
//     <SkeletonImage
//       className="aspect-auto h-auto w-full select-none rounded-lg object-center"
//       sizes="30vw"
//       src={url}
//       alt={url}
//     />
//   );
// }

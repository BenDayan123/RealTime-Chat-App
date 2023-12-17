import { useChat } from "@hooks/useChat";
import { cn } from "@lib/utils";
import { memo, useMemo } from "react";
import { FaFileAudio } from "react-icons/fa";
import { MdInsertDriveFile, MdVideoFile } from "react-icons/md";
import { PiTrashFill, PiFileTextFill } from "react-icons/pi";
import { BsFillFileEarmarkFontFill } from "react-icons/bs";
import Button from "@components/buttons/button";
import { FileState } from "@components/DropZoneWrapper";

const RenderFile: React.FC<{ type: string; file: File }> = memo(
  ({ type, file }) => {
    if (type === "image") {
      return (
        <img
          src={URL.createObjectURL(file)}
          alt={file.name}
          className="pointer-events-none max-w-full object-contain"
        />
      );
    }
    if (type === "video") {
      return <MdVideoFile size={100} className="m-auto fill-blue-200" />;
    }
    if (type === "text") {
      return <PiFileTextFill size={100} className="m-auto fill-blue-200" />;
    }
    if (type === "audio") {
      return <FaFileAudio size={100} className="m-auto fill-blue-200" />;
    }
    if (type === "font") {
      return (
        <BsFillFileEarmarkFontFill
          size={100}
          className="m-auto fill-blue-200"
        />
      );
    }
    return <MdInsertDriveFile size={100} className="m-auto fill-blue-200" />;
  },
);

RenderFile.displayName = "RenderFile";
interface Props {
  fileState: FileState;
}

export const File: React.FC<Props> = ({ fileState }) => {
  const { file } = fileState;
  const [type] = useMemo(() => file.type.split("/"), [fileState, file.type]);
  const { removeFile } = useChat();

  return (
    <div className="group relative grid aspect-square h-full grid-rows-2 rounded-md bg-background-light p-2 dark:bg-background-dark">
      <Button
        className="absolute right-2 top-2 aspect-square w-auto -translate-y-1/2 translate-x-1/2 cursor-pointer
        bg-background-light opacity-0 group-hover:opacity-100 dark:bg-background-dark"
        onClick={() => removeFile(fileState.key)}
        icon={<PiTrashFill className="fill-red-500 transition-all" size={25} />}
      />

      <div
        className={cn(
          "row-span-2 flex h-full justify-center transition-opacity",
          type === "image" && "bg-surface-light dark:bg-surface-dark",
        )}
      >
        <RenderFile file={file} type={type} />
      </div>
      <p
        className="mt-1 truncate p-1 text-sm leading-4 text-onBG-light dark:text-onBG-dark"
        title={fileState.file.name}
      >
        {fileState.file.name}
      </p>
    </div>
  );
};

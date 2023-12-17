import { formatFileSize } from "@edgestore/react/utils";
import { MdInsertDriveFile } from "react-icons/md";

interface Props {
  name: string;
  progress: number;
  size?: number;
}

const Progress: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <div className="">
      <p className="text-right text-xs">{progress}%</p>
      <div className="my-2 bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-full rounded-full dark:bg-blue-400 transition-all"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

const UploadFileMessage: React.FC<Props> = ({ name, progress, size }) => {
  if (!progress) return null;

  return (
    <div className="ml-auto w-fit bg-surface-light dark:bg-surface-dark text-black dark:text-white p-4 flex items-center gap-x-2 rounded-md overflow-hidden">
      <div className="grid h-full place-items-center relative p-2 aspect-square rounded-full bg-sky-400">
        <MdInsertDriveFile size={35} className="fill-white" />
      </div>

      <div className="flex-1">
        <h1 className="text-lg">
          {name} -{" "}
          <span className="text-sm opacity-80">({formatFileSize(size)})</span>
        </h1>
        <Progress progress={progress} />
      </div>
    </div>
  );
};

export default UploadFileMessage;

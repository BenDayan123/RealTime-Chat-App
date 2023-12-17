import { File } from "./item";
import { cn } from "@lib/utils";
import { FileState } from "@components/DropZoneWrapper";

interface Props {
  files: FileState[];
  isDragActive?: boolean;
}

const FilesDropZone: React.FC<Props> = ({ files, isDragActive }) => {
  if (!isDragActive && files.length === 0) return null;

  return (
    <div
      className={cn(
        "bg-surface-light dark:bg-surface-dark relative flex gap-4 items-center p-6 mb-2 h-64 overflow-x-auto overflow-y-hidden",
        isDragActive && "border-dashed border-2 border-sky-500"
      )}
    >
      {files.map((file) => (
        <File fileState={file} key={file.key} />
      ))}
    </div>
  );
};

export default FilesDropZone;

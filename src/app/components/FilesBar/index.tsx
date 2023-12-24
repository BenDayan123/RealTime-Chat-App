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
        "relative mb-2 flex h-64 items-center gap-4 overflow-x-auto overflow-y-hidden rounded-lg bg-surface-light p-6 dark:bg-surface-dark",
        isDragActive && "border-2 border-dashed border-sky-500",
      )}
    >
      {files.map((file) => (
        <File fileState={file} key={file.key} />
      ))}
    </div>
  );
};

export default FilesDropZone;

"use client";

import { useState, PropsWithChildren, useEffect } from "react";
import { formatFileSize } from "@edgestore/react/utils";
import React from "react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";

export type FileState = {
  file: File;
  key: string;
  progress: "PENDING" | "COMPLETE" | "ERROR" | number;
};

type InputProps = {
  className?: string;
  value?: FileState[];
  onError?: (error: string | undefined) => void;
  onChange?: (files: FileState[]) => void | Promise<void>;
  onFilesAdded?: (addedFiles: FileState[]) => void | Promise<void>;
  disabled?: boolean;
  dropzoneOptions?: Omit<DropzoneOptions, "disabled">;
};

const ERROR_MESSAGES = {
  fileTooLarge(maxSize: number) {
    return `The file is too large. Max size is ${formatFileSize(maxSize)}.`;
  },
  fileInvalidType() {
    return "Invalid file type.";
  },
  tooManyFiles(maxFiles: number) {
    return `You can only add ${maxFiles} file(s).`;
  },
  fileNotSupported() {
    return "The file is not supported.";
  },
};

export const MultiFileDropzone: React.FC<PropsWithChildren<InputProps>> = ({
  dropzoneOptions,
  value,
  className,
  disabled,
  onFilesAdded,
  onChange,
  children,
  onError,
}) => {
  const [error, setError] = useState<string>();
  if (dropzoneOptions?.maxFiles && value?.length) {
    disabled = disabled ?? value.length >= dropzoneOptions.maxFiles;
  }

  const { getRootProps, fileRejections, isDragActive } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: (files) => {
      setError(undefined);
      if (
        dropzoneOptions?.maxFiles &&
        (value?.length ?? 0) + files.length > dropzoneOptions.maxFiles
      ) {
        setError(ERROR_MESSAGES.tooManyFiles(dropzoneOptions.maxFiles));
      } else if (files) {
        const addedFiles = files.map<FileState>((file) => ({
          file,
          key: Math.random().toString(36).slice(2),
          progress: "PENDING",
        }));
        onFilesAdded?.(addedFiles);
        onChange?.([...(value ?? []), ...addedFiles]);
      }
    },
    ...dropzoneOptions,
  });

  const errorMessage = React.useMemo(() => {
    if (!fileRejections[0]) return undefined;
    const { errors } = fileRejections[0];
    switch (errors[0]?.code) {
      case "file-too-large": {
        return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0);
      }
      case "file-invalid-type": {
        return ERROR_MESSAGES.fileInvalidType();
      }
      case "too-many-files": {
        return ERROR_MESSAGES.tooManyFiles(dropzoneOptions?.maxFiles ?? 0);
      }
      default: {
        return ERROR_MESSAGES.fileNotSupported();
      }
    }
  }, [fileRejections, dropzoneOptions]);

  useEffect(() => {
    onError && onError(error ?? errorMessage);
  }, [errorMessage, error, onError]);

  return <div {...getRootProps({ className })}>{children}</div>;
};

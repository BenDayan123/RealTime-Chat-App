import { FileState } from "@components/DropZoneWrapper";
import React, { PropsWithChildren, useCallback, useState } from "react";

interface IContext {
  showInfo: boolean;
  setShowInfo: React.Dispatch<React.SetStateAction<boolean>>;
  body: string;
  setBody: React.Dispatch<React.SetStateAction<string>>;
  files: FileState[];
  setFiles: React.Dispatch<React.SetStateAction<FileState[]>>;
  updateFileProgress: (key: string, progress: FileState["progress"]) => void;
  removeFile: (key: string) => void;
  cleanChat: () => void;
  chatID: string;
  setChatID: React.Dispatch<React.SetStateAction<string>>;
}

const ChatContext = React.createContext<IContext>({} as IContext);

export function useChat() {
  return React.useContext(ChatContext);
}

export const ChatProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [body, setBody] = useState<string>("");
  const [files, setFiles] = useState<FileState[]>([]);
  const [chatID, setChatID] = useState<string>("");
  const [showInfo, setShowInfo] = useState(false);

  const updateFileProgress = useCallback(
    (key: string, progress: FileState["progress"]) => {
      setFiles((prev) =>
        prev.map((file) => (file.key === key ? { ...file, progress } : file)),
      );
    },
    [setFiles],
  );

  function removeFile(key: string) {
    setFiles((prev) => prev.filter((file) => file.key !== key));
  }

  function cleanChat() {
    setBody("");
    setFiles([]);
  }

  return (
    <ChatContext.Provider
      value={{
        showInfo,
        setShowInfo,
        body,
        setBody,
        files,
        setFiles,
        chatID,
        setChatID,
        updateFileProgress,
        removeFile,
        cleanChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

"use client";

import React, { useMemo } from "react";
import MessageForm from "@components/MessageForm";
import { useMessages } from "@hooks/useMessages";
import { useEffect, useRef } from "react";
import { TypingBubble } from "@components/TypingBubble";
import { useConversion } from "@hooks/useConversions";
import ChatTitle from "./title";
import LineSpinner from "@components/loaders/lineSpinner";
import FilesDropBar from "@components/FilesBar";
import { useChat } from "@hooks/useChat";
import { MultiFileDropzone as FilesDropZone } from "@components/DropZoneWrapper";
import UploadFileMessage from "@components/FileUploadMessage";
import Squircle from "@components/loaders/squircle";
import { toast } from "react-toastify";
import { useEffectOnce, useUpdateEffect } from "usehooks-ts";
import MessageList from "./MessageList";
import { useDarkMode } from "@hooks/useDarkMode";
import { cn } from "@lib/utils";
import AvatarsGroup from "@components/AvatarsGroup";
import Info from "@components/ChatInfo";

interface Props {
  params: {
    id: string;
  };
}

const MB = 2 ** 20;

export default function ChatApp({ params: { id } }: Props) {
  const { isDarkMode } = useDarkMode(true);
  const { data, isLoading, fetchNextPage, hasNextPage, isFetching } =
    useMessages(id);
  const messages = useMemo(
    () => data?.pages.reduce((prev, curr) => [...curr, ...prev], []),
    [data],
  );
  const { files, setChatID, setFiles, setShow, showInfo } = useChat();
  const uploadedFiles = useMemo(
    () => files.filter((file) => typeof file.progress == "number"),
    [files],
  );
  const { updateChat, members, profile, is_group, admins, ...chat } =
    useConversion(id);
  const pageYOffset = useRef(0);
  const chatContainer = useRef<HTMLDivElement>(null);

  function scrollToBottom() {
    if (!chatContainer.current) return;
    chatContainer.current.scrollTo({
      top: chatContainer.current.scrollHeight,
    });
  }

  function handleScroll(e: React.UIEvent<HTMLDivElement, UIEvent>) {
    const chat = e.currentTarget;
    if (chat.scrollTop === 0 && hasNextPage) {
      pageYOffset.current = chat.scrollHeight;
      fetchNextPage();
    }
  }
  useUpdateEffect(() => {
    if (!chatContainer.current) return;
    chatContainer.current.scrollTo({
      top: chatContainer.current.scrollHeight - pageYOffset.current,
      behavior: "instant",
    });
  }, [messages, chatContainer]);

  useEffect(() => {
    setChatID(id);
  }, [id]);

  useEffectOnce(() => {
    scrollToBottom();
  });

  if (isLoading || !members) return <Squircle />;

  return (
    <FilesDropZone
      className="flex h-full max-h-full max-w-full flex-col"
      value={files}
      dropzoneOptions={{ maxFiles: 10, maxSize: 13 * MB }}
      onError={(error) => {
        toast.error(error, {
          position: "bottom-left",
          progress: undefined,
          theme: "colored",
        });
      }}
      onChange={(files) => setFiles(files)}
      onFilesAdded={async (addedFiles) => setFiles([...files, ...addedFiles])}
    >
      {is_group && <Info show={showInfo} chatID={id} />}
      <div
        className={cn(
          "gradient-background pointer-events-none absolute left-0 top-0 z-0 h-full w-full blur-3xl",
          isDarkMode ? "opacity-0" : "opacity-30",
        )}
      ></div>
      <ChatTitle
        onClick={is_group ? () => setShow((prev) => !prev) : undefined}
        image={(is_group ? profile : members[0].image) ?? ""}
        title={is_group ? chat.name : members[0].name}
      />
      <div
        className="h-full max-h-full flex-1 overflow-auto overflow-x-hidden p-6"
        onScroll={handleScroll}
        ref={chatContainer}
      >
        {!hasNextPage && (
          <div className="pointer-events-none z-10 mx-auto flex w-fit flex-col items-center space-y-1 drag-none">
            {is_group ? (
              <AvatarsGroup
                animate={false}
                images={[
                  ...members.map((e) => e.image),
                  ...admins.map((e) => e.image),
                ]}
              />
            ) : (
              <img
                src={members[0].image}
                className="z-10 aspect-square h-auto w-28 rounded-full object-cover"
                alt=""
              />
            )}
            <p className="text-xl font-bold text-black dark:text-white">
              {is_group ? chat.name : members[0].name}
            </p>
            <p className="text-base text-black opacity-70 dark:text-white">
              {is_group ? "Group Chat" : "Private conversion"}
            </p>
          </div>
        )}
        {isFetching && <LineSpinner />}
        <MessageList messages={messages} />
        <UploadFileMessage
          name={`Uploading ${uploadedFiles.length} files`}
          size={uploadedFiles.reduce((a, b) => a + b.file.size, 0)}
          progress={
            +(
              uploadedFiles.reduce((a, b) => {
                return typeof b.progress == "number" ? a + b.progress : a;
              }, 0) / uploadedFiles.length
            ).toFixed(2)
          }
        />
      </div>
      <div className="w-full p-5 pt-0">
        {uploadedFiles.length === 0 && <FilesDropBar files={files} />}
        {chat.liveAction?.type === "TYPING" && (
          <TypingBubble name={chat.liveAction.user} />
        )}
        <MessageForm id={id} />
      </div>
    </FilesDropZone>
  );
}
// console.log(
//   "%frenkel is gay!",
//   "box-sizing:content-box;font:normal normal bold 70px/normal Helvetica,sans-serif;color:transparent;text-align:center;text-shadow:3px 0 0 #d91f26,6px 0 0 #e25b0e,9px 0 0 #f5dd08,12px 0 0 #059444,15px 0 0 #0287ce,18px 0 0 #044d91,21px 0 0 #2a1571;transition:all 600ms cubic-bezier(.68,-.55,.265,1.55)"
// );
// console.log("%cstop!", "color:red;font-size:2rem");

"use client";

import React, { useCallback } from "react";
import Message from "@components/Message";
import MessageForm from "@components/message-form";
import { usePusher } from "@harelpls/use-pusher";
import { useMessages } from "@hooks/useMessages";
import { useSession } from "next-auth/react";
import { Ring } from "@uiball/loaders";
import { useEffect, useRef, useState } from "react";
import { TypingBubble } from "@components/TypingBubble";
import { toTimeFormat } from "@lib/utils";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { DateSeparator } from "@components/DateSeparator";
import { useConversion } from "@hooks/useConversions";
import ChatTitle from "./title";

interface Props {
  params: {
    id: string;
  };
}

export default function ChatApp({ params: { id } }: Props) {
  const { data: messages, isLoading } = useMessages(id);
  const { data: session } = useSession();
  const { updateChat, members, profile, is_group, ...chat } = useConversion(id);
  const [batchedMessages, setBatchedMessages] = useState<string[]>([]);
  const { client: pusher } = usePusher();
  const chatContainer = useRef<HTMLDivElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        const binaryStr = reader.result;
        console.log(binaryStr);
      };
      reader.readAsArrayBuffer(file);
    });
  }, []);
  const { getRootProps, getInputProps, isDragActive, acceptedFiles, rootRef } =
    useDropzone({ onDrop });

  function scrollToBottom() {
    if (!chatContainer.current) return;
    chatContainer.current.scrollTo({
      top: chatContainer.current.scrollHeight,
    });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const timeOutID = setTimeout(() => {
      if (batchedMessages.length > 0) {
        axios
          .post("/api/message/seen", {
            messages: batchedMessages,
            socket_id: pusher?.connection.socket_id,
            channel_id: `presence-room@${id}`,
          })
          .then(() => {
            updateChat((old) => ({
              unseenCount: Math.max(
                0,
                old.unseenCount - batchedMessages.length
              ),
            }));
          });
        setBatchedMessages([]);
      }
    }, 700);
    return () => clearTimeout(timeOutID);
  }, [batchedMessages]);

  if (isLoading || !chat)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Ring size={100} lineWeight={5} speed={2} color="gray" />
      </div>
    );
  return (
    <div
      {...getRootProps({
        onClick: (e) => e.preventDefault(),
        className: "max-h-full h-full flex flex-col",
      })}
    >
      <ChatTitle
        image={(is_group ? profile : members[0]?.image) || ""}
        title={(is_group ? chat.title : members[0]?.name) || ""}
      />
      <div
        className="h-full flex flex-col gap-2 p-6 pt-24 overflow-auto"
        ref={chatContainer}
      >
        {messages?.map((message, i) => {
          const { body, from, id, createdAt, seen } = message;
          const mine = from.id === session?.user.id,
            createdDate = new Date(createdAt);
          return (
            <React.Fragment key={id}>
              <DateSeparator
                date={createdDate}
                prevDate={
                  i !== 0 ? new Date(messages[i - 1].createdAt) : undefined
                }
              />
              <Message
                mine={mine}
                time={toTimeFormat(createdAt)}
                id={id}
                key={id}
                seen={seen}
                onView={(inView) => {
                  if (inView && !seen && !mine && !batchedMessages.includes(id))
                    setBatchedMessages((prev) => [...prev, id]);
                }}
                isConnected={
                  i !== 0 && messages[i - 1].fromID === message.fromID
                }
                profile={from.image}
                sender={from.name}
              >
                {body}
              </Message>
            </React.Fragment>
          );
        })}
      </div>
      <div className="p-5 pt-0 w-full">
        {chat.liveAction && <TypingBubble name={chat.liveAction} />}
        <MessageForm id={id} />
      </div>
    </div>
  );
}

// console.log(
//   "%frenkel is gay!",
//   "box-sizing:content-box;font:normal normal bold 70px/normal Helvetica,sans-serif;color:transparent;text-align:center;text-shadow:3px 0 0 #d91f26,6px 0 0 #e25b0e,9px 0 0 #f5dd08,12px 0 0 #059444,15px 0 0 #0287ce,18px 0 0 #044d91,21px 0 0 #2a1571;transition:all 600ms cubic-bezier(.68,-.55,.265,1.55)"
// );
// console.log("%cstop!", "color:red;font-size:2rem");

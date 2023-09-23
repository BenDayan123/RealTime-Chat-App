"use client";

import React from "react";
import Message from "@components/Message";
import MessageForm from "@components/message-form";
import { useChannel, useEvent, usePusher } from "@harelpls/use-pusher";
import { useMessages } from "@hooks/useMessages";
import { useSession } from "next-auth/react";
import { Ring } from "@uiball/loaders";
import { useEffect, useRef, useState } from "react";
import { Events } from "@lib/events";
import { TypingBubble } from "@components/TypingBubble";
import { toTimeFormat, calcDaysDifference } from "@lib/utils";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { DateSeparator } from "@components/DateSeparator";

interface Props {
  params: {
    id: string;
  };
}

export default function ChatApp({ params: { id } }: Props) {
  const { data: messages, isLoading } = useMessages(id);
  const [batchedMessages, setBatchedMessages] = useState<string[]>([]);
  const channel = useChannel(`presence-room@${id}`);
  const { client: pusher } = usePusher();
  const { data: session } = useSession();
  const chatContainer = useRef<HTMLDivElement>(null);
  const [typersName, setTypersName] = useState<any | null>(null);
  const queryClient = useQueryClient();

  function scrollToBottom() {
    if (!chatContainer.current) return;
    chatContainer.current.scrollTo({
      top: chatContainer.current.scrollHeight,
    });
  }
  useEffect(() => {
    scrollToBottom();
  }, [typersName]);

  useEvent<any>(channel, Events.USER_TYPEING, (data) => {
    setTypersName(data);
  });
  useEvent(channel, Events.USER_STOP_TYPING, () => {
    setTypersName(null);
  });

  useEffect(() => {
    const timeOutID = setTimeout(() => {
      if (batchedMessages.length > 0) {
        axios.post("/api/message/seen", {
          messages: batchedMessages,
          socket_id: pusher?.connection.socket_id,
          channel_id: channel?.name,
        });
        queryClient.setQueryData(
          ["conversions", session?.user.id],
          (old: any) => {
            return old.map((chat: any) => ({
              ...chat,
              unseenCount:
                chat.unseenCount - batchedMessages.length >= 0
                  ? chat.unseenCount - batchedMessages.length
                  : 0,
            }));
          }
        );
        setBatchedMessages([]);
      }
    }, 700);
    return () => clearTimeout(timeOutID);
  }, [batchedMessages]);

  if (isLoading)
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Ring size={100} lineWeight={5} speed={2} color="gray" />
      </div>
    );
  return (
    <div className="max-h-full h-full flex flex-col">
      <div
        className="h-full flex flex-col gap-2 p-6 pt-10 overflow-auto"
        ref={chatContainer}
      >
        {messages?.map((message, i) => {
          const { body, from, id, createdAt, seen } = message;
          const mine = from.id === session?.user.id,
            createdDate = new Date(createdAt);
          return (
            <React.Fragment key={id}>
              {i !== 0 ? (
                <DateSeparator
                  date={createdDate}
                  prevDate={new Date(messages[i - 1].createdAt)}
                />
              ) : (
                <DateSeparator date={createdDate} />
              )}
              <Message
                mine={mine}
                time={toTimeFormat(createdAt)}
                id={id}
                key={id}
                seen={seen}
                onView={(inView) => {
                  if (inView && !seen && !mine)
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
        {typersName && <TypingBubble user={typersName.user} />}
      </div>
      <div className="p-5 pt-0 w-full">
        <MessageForm id={id} />
      </div>
    </div>
  );
}
// <h1 className="text-onBG-light my-5 dark:text-onBG-dark text-center text-4xl">
// Chat ID: {id}
// </h1>
// const pusher = getPusher(session?.user);
// useEffect(() => {
//   const channel = pusher.subscribe(`presence-room-${id}`);
//   channel.bind("new-message", (data: IMessage) => {
//     console.log(data);
//     data && setMessages((prev) => [...prev, data]);
//   });
//   channel.bind("pusher:member_added", (memeber: any) => {
//     console.log(memeber);
//   });
//   channel.bind("pusher:subscription_succeeded", (memeber: any) => {
//     console.log(memeber);
//   });

//   return () => pusher.unsubscribe(`presence-room-${id}`);
// }, []);
// useEvent(channel, "pusher:member_added", (data) => {
//   console.log("pusher:member_added: ", data);
// });
// useEvent(channel, "pusher:subscription_succeeded", (data) => {
//   console.log("pusher:subscription_succeeded: ", data);
// });
// useEvent(channel, "pusher:member_removed", (data) => {
//   console.log("pusher:member_removed: ", data);
// });
// console.log(
//   "%frenkel is gay!",
//   "box-sizing:content-box;font:normal normal bold 70px/normal Helvetica,sans-serif;color:transparent;text-align:center;text-shadow:3px 0 0 #d91f26,6px 0 0 #e25b0e,9px 0 0 #f5dd08,12px 0 0 #059444,15px 0 0 #0287ce,18px 0 0 #044d91,21px 0 0 #2a1571;transition:all 600ms cubic-bezier(.68,-.55,.265,1.55)"
// );
// console.log("%cstop!", "color:red;font-size:2rem");

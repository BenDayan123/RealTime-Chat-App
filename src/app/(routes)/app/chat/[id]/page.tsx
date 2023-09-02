"use client";

import ConversationTab from "@components/conversationTab";
import Message from "@components/message";
import MessageForm from "@components/message-form";
import { useEvent, usePresenceChannel, usePusher } from "@harelpls/use-pusher";
import { IMessage } from "@interfaces/message";
import { useEffect, useState } from "react";

export default function ChatApp({
  params: { id },
}: {
  params: { id: string };
}) {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { channel, myID, members } = usePresenceChannel(`presence-room-${id}`);
  const { client: pusher } = usePusher();

  useEffect(() => {
    pusher?.signin();
  }, [pusher]);

  useEvent<IMessage>(channel, "new-message", (data) => {
    console.log(data);
    data && setMessages((prev) => [...prev, data]);
  });

  return (
    <div className="max-h-full h-full flex flex-col">
      <h1 className="text-onBG-light my-5 dark:text-onBG-dark text-center text-4xl">
        Chat ID: {id}
      </h1>
      <h1 className="text-onBG-light dark:text-onBG-dark opacity-70 text-center text-2xl">
        My ID: {myID}
      </h1>
      <div className="h-full flex flex-col gap-3 p-6 overflow-auto">
        {messages.map((message, i) => {
          const { id, body, sender } = message;
          return (
            <Message
              mine
              // mine={id === pusher?.connection.socket_id}
              key={i}
              sender={sender}
            >
              {body}
            </Message>
          );
        })}
      </div>
      {members &&
        Object.entries(members).map(([id, info]) => {
          const { name, image, email } = info;
          return (
            <ConversationTab
              key={id}
              id={id}
              name={name}
              image={image}
              lastStatus={email}
            />
          );
        })}
      <div className="p-5 w-full">
        <MessageForm id={id} />
      </div>
    </div>
  );
}

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

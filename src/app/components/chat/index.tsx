"use client";

import Message from "@components/message";
import MessageForm from "@components/message-form";
import { useEffect, useState } from "react";
import { IMessage } from "@interfaces/message";
import ConversationTab from "@components/conversationTab";
import { useEvent, usePresenceChannel, usePusher } from "@harelpls/use-pusher";
// import { useEffect } from "react";
// import { getPusher } from "@lib/socket";
// import { useSession } from "next-auth/react";

interface Props {
  id: string;
}

const ChatApp: React.FC<Props> = ({ id }) => {
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
  // useEvent(channel, "pusher:member_added", (data) => {
  //   console.log("pusher:member_added: ", data);
  // });
  // useEvent(channel, "pusher:subscription_succeeded", (data) => {
  //   console.log("pusher:subscription_succeeded: ", data);
  // });
  // useEvent(channel, "pusher:member_removed", (data) => {
  //   console.log("pusher:member_removed: ", data);
  // });
  return (
    <div className="max-h-full h-full flex flex-col">
      <h1>Chat ID: {id}</h1>
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
              time="02:31 PM"
              lastStatus={email}
            />
          );
        })}
      <div className="p-5 w-full">
        <MessageForm id={id} />
      </div>
    </div>
  );
};

export default ChatApp;

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

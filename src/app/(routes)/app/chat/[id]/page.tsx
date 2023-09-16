"use client";

import ConversationTab from "@components/ConversationTab";
import Message from "@components/Message";
import MessageForm from "@components/message-form";
import { usePresenceChannel } from "@harelpls/use-pusher";
import { useMessages } from "@hooks/useMessages";
import { useSession } from "next-auth/react";

export default function ChatApp({
  params: { id },
}: {
  params: { id: string };
}) {
  const { data: messages } = useMessages(id);
  const { members } = usePresenceChannel(`presence-room@${id}`);
  const { data: session } = useSession();

  return (
    <div className="max-h-full h-full flex flex-col">
      <h1 className="text-onBG-light my-5 dark:text-onBG-dark text-center text-4xl">
        Chat ID: {id}
      </h1>
      <div className="h-full flex flex-col gap-3 p-6 overflow-auto">
        {messages?.map((message) => {
          const { body, from, id } = message;
          return (
            <Message
              mine={from.id === session?.user.id}
              key={id}
              sender={from.name}
            >
              {body}
            </Message>
          );
        })}
      </div>
      {members &&
        Object.entries(members).map(([id, info]) => {
          const { name, image, email } = info as any;
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

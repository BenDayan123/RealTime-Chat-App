"use client";

import Message from "@components/message";
import MessageForm from "@components/message-form";
import { useSocket } from "@hooks/useSocket";
import { useEffect, useState } from "react";
import { IMessage } from "@interfaces/message";

interface Props {
  id: string;
}

const ChatApp: React.FC<Props> = ({ id }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const socket = useSocket();

  useEffect(() => {
    socket?.on("new_message", (data: IMessage) =>
      setMessages((prev) => [...prev, data])
    );
  }, [socket]);

  return (
    <div className="max-h-full h-full flex flex-col">
      <h1>Chat ID: {id}</h1>
      <div className="h-full flex flex-col gap-3 p-6 overflow-auto">
        {messages.map((message, i) => {
          console.log({ message });
          const { id, body, sender } = message;
          return (
            <Message mine={id === socket?.id} key={i} sender={sender}>
              {body}
            </Message>
          );
        })}
      </div>
      <div className="p-5 w-full">
        <MessageForm id={id} />
      </div>
    </div>
  );
};
export default ChatApp;

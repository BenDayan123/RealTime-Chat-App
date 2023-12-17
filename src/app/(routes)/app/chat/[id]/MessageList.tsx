import React, { useEffect, useState } from "react";
import { DateSeparator } from "@components/DateSeparator";
import { MediaGrid } from "@components/MediaGrid";
import Message from "@components/Message";
import { usePusher } from "@hooks/usePusher";
import { IMessage } from "@interfaces/message";
import { groupBy, toTimeFormat } from "@lib/utils";
import { useSession } from "next-auth/react";
import axios from "axios";
import mime from "mime";
import { useConversion } from "@hooks/useConversions";
import { MessageFile } from "@components/FileMessage";
import { useChat } from "@hooks/useChat";
import { VoicePlayer } from "@components/VoicePlayer";
import dayjs from "dayjs";

interface Props {
  messages?: IMessage[];
}

const MessageList: React.FC<Props> = ({ messages }) => {
  const { chatID } = useChat();
  const { data: session } = useSession();
  const [batchedMessages, setBatchedMessages] = useState<string[]>([]);
  const pusher = usePusher();
  const { updateChat, admins, members } = useConversion(chatID);

  useEffect(() => {
    const timeOutID = setTimeout(() => {
      if (batchedMessages.length === 0) return;
      axios
        .post("/api/message/seen", {
          messages: batchedMessages,
          socket_id: pusher?.connection.socket_id,
          channel_id: `presence-room@${chatID}`,
        })
        .then(() => {
          updateChat((old) => ({
            unseenCount: Math.max(0, old.unseenCount - batchedMessages.length),
          }));
        });
      setBatchedMessages([]);
    }, 700);
    return () => clearTimeout(timeOutID);
  }, [batchedMessages, pusher?.connection.socket_id, updateChat]);

  if (!messages) return;

  return (
    <>
      {messages.map((message, i) => {
        const { body, from, id, createdAt, seen, files, voice, type } = message;
        const mine = from.id === session?.user.id,
          createdDate = new Date(createdAt),
          { images, other } = groupBy(files, ({ url }) =>
            mime.getType(url)?.split("/")[0] === "image" ? "images" : "other",
          ),
          isConnected = i !== 0 && messages[i - 1].fromID === message.fromID,
          isAllSeen =
            (admins?.length || 0) + (members?.length || 0) <=
            (seen?.length || 0) + 1,
          time = dayjs(createdAt).format("HH:mm");
        function onView(inView: boolean) {
          if (
            inView &&
            !seen?.find((user) => user.id === session?.user.id) &&
            !mine &&
            !batchedMessages.includes(id)
          )
            setBatchedMessages((prev) => [...prev, id]);
        }
        return (
          <React.Fragment key={id}>
            <DateSeparator
              date={createdDate}
              prevDate={
                i !== 0 ? new Date(messages[i - 1].createdAt) : undefined
              }
            />
            {voice && type === "AUDIO" && (
              <Message
                id={id}
                type={type}
                seen={isAllSeen}
                mine={mine}
                showBG={false}
                sender={from.name}
                onView={onView}
                isConnected={isConnected}
                time={time}
              >
                <VoicePlayer
                  audio={voice.url}
                  className="bg-surface-light dark:bg-surface-dark"
                />
              </Message>
            )}
            {images?.length > 0 && (
              <Message
                type={type}
                id={id}
                seen={isAllSeen}
                mine={mine}
                showBG={false}
                sender={from.name}
                onView={onView}
                isConnected={isConnected}
                time={time}
              >
                <MediaGrid images={images} />
              </Message>
            )}
            {other?.map(({ url, id: fileID, size }) => (
              <Message
                mine={mine}
                type={type}
                time={time}
                id={id}
                key={fileID}
                seen={isAllSeen}
                showBG={false}
                onView={onView}
                isConnected={isConnected}
                profile={from.image}
                sender={from.name}
              >
                <MessageFile url={url} size={size} />
              </Message>
            ))}
            <Message
              mine={mine}
              type={type}
              time={time}
              id={id}
              key={id}
              seen={isAllSeen}
              onView={onView}
              isConnected={isConnected}
              profile={from.image}
              sender={from.name}
              body={body}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};

export default MessageList;

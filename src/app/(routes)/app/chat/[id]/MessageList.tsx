import React, { useEffect, useState } from "react";
import { DateSeparator } from "@components/DateSeparator";
import { MediaGrid } from "@components/MediaGrid";
import { Message } from "@components/Message";
import { usePusher } from "@hooks/usePusher";
import { IMessage } from "@interfaces/message";
import { groupBy } from "@lib/utils";
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
  }, [batchedMessages]);

  if (!messages) return;

  return (
    <>
      {messages.map((message, i) => {
        const { body, from, id, createdAt, seen, files, voice, type } = message;
        const mine = from.id === session?.user.id,
          { images, other } = groupBy(files, ({ url }) =>
            mime.getType(url)?.split("/")[0] === "image" ? "images" : "other",
          ),
          isAllSeen =
            (admins?.length || 0) + (members?.length || 0) <=
            (seen?.length || 0) + 1;
        function onView(inView: boolean) {
          if (
            inView &&
            !seen?.find((user) => user.id === session?.user.id) &&
            !mine &&
            !batchedMessages.includes(id)
          )
            setBatchedMessages((prev) => [...prev, id]);
        }
        const data = {
          id,
          type,
          mine,
          onView,
          profile: from.image,
          sender: from.name,
          seen: isAllSeen,
          time: dayjs(createdAt).format("HH:mm"),
          isConnected: i !== 0 && messages[i - 1].fromID === message.fromID,
        };
        return (
          <React.Fragment key={id}>
            <DateSeparator
              date={new Date(createdAt)}
              prevDate={
                i !== 0 ? new Date(messages[i - 1].createdAt) : undefined
              }
            />
            {voice && type === "AUDIO" && (
              <Message {...data} showBG={false}>
                <VoicePlayer
                  audio={voice.url}
                  className="bg-surface-light dark:bg-surface-dark"
                />
              </Message>
            )}
            {images?.length > 0 && (
              <Message {...data} showBG={false}>
                <MediaGrid images={images} />
              </Message>
            )}
            {other?.map(({ url, id: fileID, size }) => (
              <Message key={fileID} showBG={false} {...data}>
                <MessageFile url={url} size={size} />
              </Message>
            ))}
            <Message {...data} body={body} />
          </React.Fragment>
        );
      })}
    </>
  );
};

export default MessageList;

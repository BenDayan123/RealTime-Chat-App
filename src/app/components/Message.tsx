"use client";

import { PropsWithChildren, useCallback, useEffect, memo } from "react";
import { cn, isUrl, urlRegex } from "@lib/utils";
import {
  MdContentCopy,
  MdDoneAll,
  MdOutlineReply,
  MdSpeaker,
} from "react-icons/md";
import { useInView } from "react-intersection-observer";
import { IFile, IMessage } from "@interfaces/message";
import Link from "next/link";
import { motion } from "framer-motion";
import { ContextMenuWrapper, Item } from "./ContextMenu";
import { IoMdTrash } from "react-icons/io";
import axios from "axios";
import { useChat } from "@hooks/useChat";
import { MessageType } from "@prisma/client";
import { YouTubeEmbed } from "react-social-media-embed";
import ReactionBar from "./ReactionBar";
import { AddReaction } from "@actions/message";
import { useSession } from "next-auth/react";
import { IUser } from "@interfaces/user";
import MessageReplay from "./MessageReplay";

interface Props {
  id: string;
  mine: boolean;
  isConnected?: boolean;
  sender: IUser;
  seen?: boolean;
  type: MessageType;
  showBG?: boolean;
  profile?: string;
  reactions: IMessage["reactions"];
  time: string;
  body?: string;
  files?: IFile[];
  replay: IMessage["replay"];
  onView?: (inView: boolean) => void;
  onDelete?: () => Promise<any>;
}

export const Message: React.FC<PropsWithChildren<Props>> = memo(
  ({
    children,
    mine,
    sender,
    isConnected,
    replay,
    seen,
    type,
    time,
    onDelete,
    body,
    id,
    files,
    reactions,
    onView,
    showBG = true,
  }) => {
    const { ref, inView } = useInView({ triggerOnce: true });
    const { data: session } = useSession();
    const { chatID, setReplay } = useChat();

    useEffect(() => {
      onView && void onView(inView);
    }, [inView, onView]);

    async function DeleteMessage() {
      onDelete && (await onDelete());
      await axios.delete("/api/message", {
        data: { messages: [id], channel_id: chatID },
      });
    }
    if (!children && !body) return null;

    return (
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeOut" }}
        ref={ref}
        className={cn(
          "relative my-2 w-fit max-w-[60%] auto-rows-fr grid-cols-[max-content_max-content] gap-x-2 max-xl:max-w-full",
          mine && "ml-auto",
        )}
      >
        {!mine && !isConnected && (
          <p className="col-start-2 row-start-1 my-1 text-sm font-bold text-onBG-light dark:text-onBG-dark">
            {sender.name}
          </p>
        )}
        <ContextMenuWrapper
          items={
            <>
              <Item
                className="hover:bg-opacity-0 dark:hover:bg-opacity-0"
                divide
              >
                {["😁", "👍", "❤️", "😂"].map((emoji) => (
                  <div
                    key={emoji}
                    onClick={() => AddReaction(id, emoji)}
                    className={cn(
                      "aspect-square rounded-full bg-gray-700/10 p-2 text-sm transition-all hover:scale-110 dark:bg-white/10",
                      reactions[emoji]?.find(
                        (user) => user.id === session?.user.id,
                      ) && "bg-blue-400 hover:scale-100 dark:bg-blue-400",
                    )}
                  >
                    {emoji}
                  </div>
                ))}
              </Item>
              <Item
                icon={<MdOutlineReply size={20} />}
                onClick={() =>
                  setReplay({
                    id,
                    body,
                    files,
                    from: mine ? { ...sender, name: "You" } : sender,
                  })
                }
              >
                Replay
              </Item>
              <Item
                onClick={() => navigator.clipboard.writeText(body ?? "")}
                icon={<MdContentCopy size={20} />}
              >
                Copy Text
              </Item>
              <Item
                icon={<MdSpeaker size={20} />}
                onClick={() => {
                  const msg = new SpeechSynthesisUtterance(
                    `${sender.name} saying ${body}`,
                  );
                  window.speechSynthesis.speak(msg);
                }}
              >
                Speak Message
              </Item>
              <Item
                onClick={() => DeleteMessage()}
                show={mine}
                className="text-red-500 hover:bg-red-500 hover:text-white dark:text-red-500 dark:hover:bg-red-500 hover:dark:text-white"
                icon={
                  <IoMdTrash
                    size={20}
                    className="fill-red-500 group-hover:fill-white"
                  />
                }
              >
                Delete
              </Item>
            </>
          }
        >
          <div
            className={cn(
              "message relative col-start-2 h-auto w-fit break-words rounded-md font-light",
              mine && "bg-message-out-bg-light text-message-out-text-light",
              !mine &&
                "bg-message-in-bg-light text-message-in-text-light dark:bg-message-in-bg-dark dark:text-message-in-text-dark",
              !showBG && "bg-transparent dark:bg-transparent",
              !isConnected && !mine && "rounded-tl-none",
              !isConnected && mine && "rounded-tr-none",
            )}
          >
            {replay && <MessageReplay {...replay} />}
            <div className={cn("px-4 py-2", !showBG && "p-0")}>
              {type !== "TEXT" && children}
              <EmbedBody body={body} />
              <div
                className={cn(
                  "mt-2 flex justify-end gap-x-2",
                  !showBG && "text-black dark:text-white",
                )}
              >
                {mine && (
                  <MdDoneAll
                    className={cn(seen ? "fill-blue-700" : "fill-gray-300")}
                  />
                )}
                {time && (
                  <p className="select-none text-right text-[.7rem] opacity-75">
                    {time}
                  </p>
                )}
              </div>
            </div>
          </div>
        </ContextMenuWrapper>
        <ReactionBar reactions={reactions} />
      </motion.div>
    );
  },
);

Message.displayName = "Message";

const EmbedBody: React.FC<{ body?: string }> = ({ body }) => {
  const embedLink = useCallback((link: string) => {
    const host = new URL(link).host;
    switch (host.replace("www.", "").split(".")[0]) {
      // case "youtube": {
      //   return <YouTubeEmbed url={link} width={450} height={253} />;
      // }
      default: {
        return (
          <Link href={link} target="_blank">
            {link}
          </Link>
        );
      }
    }
  }, []);

  if (!body) return null;
  return (
    <div className="whitespace-pre-line">
      {body.split(urlRegex).map((word, i) =>
        isUrl(word) ? (
          <div className="my-1 overflow-hidden rounded-lg" key={word + i}>
            {embedLink(word)}
          </div>
        ) : (
          word
        ),
      )}
    </div>
  );
};

// bg-blue-400
// import {
//   YouTubeEmbed,
//   TikTokEmbed,
//   TwitterEmbed,
//   InstagramEmbed,
// } from "react-social-media-embed";

// case "tiktok": {
//   return <TikTokEmbed url={link} height={550} />;
// }
// case "twitter": {
//   return <TwitterEmbed url={link} height={350} />;
// }
// case "instagram": {
//   return <InstagramEmbed url={link} height={500} />;
// }

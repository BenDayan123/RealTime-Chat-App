"use client";

import { PropsWithChildren, useCallback, useEffect, memo } from "react";
import { cn, isUrl, urlRegex } from "@lib/utils";
import { MdDoneAll, MdDone } from "react-icons/md";
import { useInView } from "react-intersection-observer";
import { IFile } from "@interfaces/message";
import Link from "next/link";
import { motion } from "framer-motion";
import { ContextMenuWrapper, Item } from "./ContextMenu";
import { IoMdTrash } from "react-icons/io";
import axios from "axios";
import { useChat } from "@hooks/useChat";
import { MessageType } from "@prisma/client";
import { useEdgeStore } from "@lib/store";
import { YouTubeEmbed } from "react-social-media-embed";
import ProfileStatus from "./ProfileStatus";

interface Props {
  id: string;
  mine: boolean;
  isConnected?: boolean;
  sender: string;
  seen?: boolean;
  type: MessageType;
  showBG?: boolean;
  profile?: string;
  time: string;
  body?: string;
  files?: IFile[];
  onView?: (inView: boolean) => void;
  onDelete?: () => Promise<any>;
}

export const Message: React.FC<PropsWithChildren<Props>> = memo(
  ({
    children,
    mine,
    sender,
    isConnected,
    seen,
    type,
    profile,
    time,
    onDelete,
    body,
    id,
    onView,
    showBG = true,
  }) => {
    const { ref, inView } = useInView({ triggerOnce: true });
    const { chatID } = useChat();

    useEffect(() => {
      onView && void onView(inView);
    }, [inView, onView]);

    async function DeleteMessage() {
      onDelete && (await onDelete());
      await axios.delete("/api/message", {
        data: { messages: [id], channel_id: chatID },
      });
    }

    const embedLink = useCallback((link: string) => {
      const host = new URL(link).host;
      switch (host.replace("www.", "").split(".")[0]) {
        case "youtube": {
          return <YouTubeEmbed url={link} width={450} height={253} />;
        }
        default: {
          return (
            <Link href={link} target="_blank">
              {link}
            </Link>
          );
        }
      }
    }, []);

    const renderBody = useCallback(() => {
      return body?.split(urlRegex).map((word, i) =>
        isUrl(word) ? (
          <div className="my-1 overflow-hidden rounded-lg" key={i}>
            {embedLink(word)}
          </div>
        ) : (
          word
        ),
      );
    }, [body, embedLink]);

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
            {sender}
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
                    className="aspect-square rounded-full bg-gray-700/10 p-2 transition-all hover:brightness-125 dark:bg-white/10"
                  >
                    {emoji}
                  </div>
                ))}
              </Item>
              <Item>Select Message</Item>
              <Item divide={mine}>Edit</Item>
              <Item
                onClick={() => DeleteMessage()}
                show={mine}
                className="text-red-500 hover:bg-red-700/30 dark:text-red-500"
                icon={<IoMdTrash size={20} className="fill-red-500" />}
              >
                Delete
              </Item>
            </>
          }
        >
          <div
            className={cn(
              "message relative col-start-2 h-auto w-fit break-words rounded-md px-4 py-2 font-light",
              mine && "bg-message-out-bg-light text-message-out-text-light",
              !mine &&
                "bg-message-in-bg-light text-message-in-text-light dark:bg-message-in-bg-dark dark:text-message-in-text-dark",
              !showBG && "bg-transparent p-0 dark:bg-transparent",
              !isConnected && !mine && "rounded-tl-none",
              !isConnected && mine && "rounded-tr-none",
            )}
          >
            {body && <p className="whitespace-pre-line">{renderBody()}</p>}
            {type !== "TEXT" && children}
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
        </ContextMenuWrapper>
      </motion.div>
    );
  },
);

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

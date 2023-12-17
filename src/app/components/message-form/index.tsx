"use client";

import { useMemo, useState } from "react";
import axios from "axios";
import RecordButton from "./recorder";
import TextareaAutosize from "react-textarea-autosize";
import EmojiPicker from "emoji-picker-react";
import { MdEmojiEmotions, MdSend } from "react-icons/md";
import { cn } from "@lib/utils";
import { useSession } from "next-auth/react";
import { Events } from "@lib/events";
import { useChat } from "@hooks/useChat";
import { useEdgeStore } from "@lib/store";
import { usePusher } from "@hooks/usePusher";
import { useDarkMode } from "@hooks/useDarkMode";
import { Button } from "./button";

interface Props {
  id: string;
}

const IconStyle =
  "fill-onBG-light dark:fill-onBG-dark opacity-60 group-hover:opacity-100";

const MessageForm: React.FC<Props> = ({ id }) => {
  const { isDarkMode } = useDarkMode(true);
  const { body, files, setBody, updateFileProgress, cleanChat } = useChat();
  const { edgestore } = useEdgeStore();
  const [showEmojis, setEmojis] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();
  const { data: session } = useSession();
  const pusher = usePusher();
  const channel = pusher?.channel(`presence-room@${id}`);
  const canSend = useMemo(() => !!body || files.length > 0, [body, files]);

  async function SendMessage() {
    if (!canSend) return;
    const uploadedFiles = await Promise.all(
      files.map((fileState) =>
        edgestore.publicFiles.upload({
          file: fileState.file,
          onProgressChange: (progress) => {
            updateFileProgress(fileState.key, progress);
          },
        }),
      ),
    );
    await axios.post("/api/message", {
      channel_name: `presence-room@${id}`,
      sender_id: session?.user.id,
      files: uploadedFiles,
      body,
    });
    cleanChat();
  }

  function EmojiToggle() {
    setEmojis(!showEmojis);
  }

  function stopTypingHandler() {
    setTypingTimeout(
      setTimeout(() => {
        setTypingTimeout(undefined);
        channel?.trigger(Events.USER_STOP_TYPING, {});
      }, 1500),
    );
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      channel?.trigger(Events.USER_STOP_TYPING, {});
      SendMessage();
      return false;
    }
    return true;
  }

  function handleInput(e: React.FormEvent<HTMLTextAreaElement>) {
    setBody(e.currentTarget.value);
    if (!typingTimeout) {
      channel?.trigger(Events.USER_TYPING, { name: session?.user.name });
      stopTypingHandler();
    } else {
      clearTimeout(typingTimeout);
      stopTypingHandler();
    }
  }

  return (
    <div
      className={`relative flex items-center rounded-md border-2 border-blue-400 bg-surface-light px-4 py-2 dark:border-opacity-0 dark:bg-surface-dark`}
    >
      <RecordButton
        onStartRecording={() =>
          channel?.trigger(Events.USER_RECORDING, { name: session?.user.name })
        }
        onStopRecording={() => channel?.trigger(Events.USER_STOP_RECORDING, {})}
      />
      <TextareaAutosize
        value={body}
        minRows={1}
        rows={1}
        maxRows={10}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder="Type a message..."
        className="h-full w-full resize-none bg-tran px-3 text-onBG-light outline-none dark:text-onBG-dark"
      />
      <Button onClick={EmojiToggle}>
        <MdEmojiEmotions className={IconStyle} size={25} />
      </Button>
      <Button onClick={SendMessage}>
        <MdSend
          size={25}
          className={cn(
            IconStyle,
            !canSend && "cursor-not-allowed opacity-10 group-hover:opacity-10",
          )}
        />
      </Button>
      {showEmojis && (
        <div className="absolute -top-4 right-0 z-20 -translate-y-full">
          <EmojiPicker
            onEmojiClick={({ emoji }) => setBody((prev) => prev + emoji)}
            emojiStyle={"native" as any}
            theme={(isDarkMode ? "dark" : "light") as any}
          />
        </div>
      )}
    </div>
  );
};

export default MessageForm;

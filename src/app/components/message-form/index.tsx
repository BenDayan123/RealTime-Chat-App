"use client";

import { useState } from "react";
import axios from "axios";
import RecordButton from "./recorder";
import TextareaAutosize from "react-textarea-autosize";
import EmojiPicker from "emoji-picker-react";
import { MdEmojiEmotions, MdSend } from "react-icons/md";

// import EmojiEmotions from "@mui/icons-material/EmojiEmotions";
// import Send from "@mui/icons-material/Send";

interface Props {
  id: string;
}

const MessageForm: React.FC<Props> = ({ id }) => {
  const [text, setText] = useState("");
  const [showEmojis, setEmojis] = useState(false);

  // useEffect(() => {
  //   console.log({ members });
  // }, [members]);

  function handleSend() {
    axios.post("/api/message", { text, roomID: `presence-room-${id}` });
    setText("");
  }

  function EmojiToggle() {
    setEmojis(!showEmojis);
  }

  return (
    <div
      className={`relative bg-surface-light px-6 py-4 gap-2 dark:bg-surface-dark rounded-md flex items-start border-blue-400 border-2 dark:border-opacity-0`}
    >
      <RecordButton />
      <TextareaAutosize
        value={text}
        minRows={1}
        rows={1}
        maxRows={10}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
            return false;
          }
          return true;
        }}
        onInput={(e) => setText(e.currentTarget.value)}
        placeholder="Type a message..."
        className="resize-none w-full h-full px-3 outline-none bg-tran text-onBG-light dark:text-onBG-dark"
      />
      <i onClick={EmojiToggle}>
        <MdEmojiEmotions
          className="fill-onBG-light dark:fill-onBG-dark opacity-60 cursor-pointer"
          size={25}
        />
      </i>
      <i onClick={handleSend}>
        <MdSend
          size={25}
          className={`fill-onBG-light dark:fill-onBG-dark opacity-60 cursor-pointer ${
            text === "" ? "opacity-10 pointer-events-none" : ""
          }`}
        />
      </i>
      {showEmojis && (
        <div className="absolute -top-4 right-0 -translate-y-full">
          <EmojiPicker
            onEmojiClick={(emoji) => setText((prev) => prev + emoji.emoji)}
            emojiStyle={"native" as any}
          />
        </div>
      )}
    </div>
  );
};

export default MessageForm;

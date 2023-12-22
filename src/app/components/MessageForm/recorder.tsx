"use client";

//@ts-ignore
import { LiveAudioVisualizer } from "react-audio-visualize";
import { useCallback, useEffect, useState } from "react";
import { MdKeyboardVoice, MdPauseCircle, MdSend } from "react-icons/md";
import { useTimer } from "use-timer";
import { cn, secondsToISOFormet } from "@lib/utils";
import { useDarkMode } from "@hooks/useDarkMode";
import { VoicePlayer } from "@components/VoicePlayer";
import { UUID } from "@lib/utils";
import { useEdgeStore } from "@lib/store";
import { Button } from "./button";
import { UploadVoiceMessage } from "@actions/message";
import { useSession } from "next-auth/react";
import { useChat } from "@hooks/useChat";
import LineSpinner from "@components/loaders/lineSpinner";

const fileType = "webm";
const mimeType = `audio/${fileType}`;

interface Props {
  onStartRecording?: () => void;
  onStopRecording?: () => void;
}

const RecordButton: React.FC<Props> = ({
  onStartRecording,
  onStopRecording,
}) => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();
  const isDarkMode = useDarkMode(true);
  const timer = useTimer();
  const [blob, setBlob] = useState<Blob>();
  const { edgestore } = useEdgeStore();
  const [loading, setLoading] = useState(false);
  const [, setChunks] = useState<Blob[]>([]);
  const { data: session } = useSession();
  const { chatID } = useChat();

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const recorder = new MediaRecorder(stream);
          setMediaRecorder(recorder);
          recorder.addEventListener("dataavailable", (e: BlobEvent) => {
            setChunks((prev) => [...prev, e.data]);
          });
          recorder.addEventListener("stop", () => {
            setChunks((curr) => {
              const blob = new Blob(curr, { type: mimeType });
              setBlob(blob);
              return [];
            });
          });
        })
        .catch((err) => {
          console.error(`The following getUserMedia error occurred: ${err}`);
        });
    } else console.error("getUserMedia not supported on your browser!");

    return () => void setMediaRecorder(undefined);
  }, []);

  const handleUploading = async () => {
    if (!blob) return;
    setLoading(true);
    const file = new File([blob], `${UUID()}.${fileType}`);
    const { uploadedAt, size, url } = await edgestore.publicFiles.upload({
      file,
      input: {
        uuid: Math.random().toString(36).slice(-6),
      },
    });
    await UploadVoiceMessage({
      voice: { uploadedAt, size, url },
      sender_id: session?.user.id || "",
      channel_name: `presence-room@${chatID}`,
    });
    setBlob(undefined);
    setChunks([]);
    setLoading(false);
  };

  const handleRecording = useCallback(() => {
    if (!mediaRecorder) return;

    const handleStart = () => {
      mediaRecorder?.start();
      timer.reset();
      timer.start();
      onStartRecording && void onStartRecording();
    };
    const handleStop = () => {
      mediaRecorder?.stop();
      timer.pause();
      onStopRecording && void onStopRecording();
    };

    mediaRecorder.state === "recording" ? handleStop() : handleStart();
  }, [mediaRecorder]);

  if (!mediaRecorder) return null;

  return (
    <div className="flex select-none items-center">
      <Button onClick={handleRecording}>
        {mediaRecorder.state === "recording" ? (
          <MdPauseCircle className="fill-red-500" size={25} />
        ) : (
          <MdKeyboardVoice
            className="fill-onBG-light opacity-60 group-hover:opacity-100 dark:fill-onBG-dark"
            size={25}
          />
        )}
      </Button>
      <div
        className={cn(
          "duration-400 mx-2 flex-1 gap-1 overflow-hidden rounded-full transition-[width]",
          "bg-background-light text-black dark:bg-background-dark dark:text-white",
          mediaRecorder.state === "recording" ||
            (mediaRecorder.state === "inactive" && blob)
            ? "visible w-[300px] opacity-100"
            : "invisible m-0 w-0 p-0",
        )}
      >
        {mediaRecorder.state === "recording" ? (
          <div className="flex items-center justify-evenly">
            <div className="flex-center gap-3">
              <span className="relative flex h-3 w-3">
                {mediaRecorder.state === "recording" && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                )}
                <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500"></span>
              </span>
              <p className="animate-pulse font-bold">
                {secondsToISOFormet(timer.time)}
              </p>
            </div>
            <LiveAudioVisualizer
              mediaRecorder={mediaRecorder}
              width={130}
              height={55}
              barWidth={2}
              gap={3}
              barColor={isDarkMode ? "white" : "black"}
            />
          </div>
        ) : (
          blob && <VoicePlayer audio={blob} />
        )}
      </div>
      {blob && (
        <Button onClick={() => handleUploading()}>
          {loading ? (
            <LineSpinner className="p-0" size={25} />
          ) : (
            <MdSend
              size={25}
              className="fill-onBG-light opacity-60 group-hover:opacity-100 dark:fill-onBG-dark"
            />
          )}
        </Button>
      )}
    </div>
  );
};
export default RecordButton;
// light:bg-gradient-to-r from-cyan-400 to-cyan-600
//
// currentTime={3}

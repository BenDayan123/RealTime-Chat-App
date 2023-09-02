"use client";

import { useEffect, useState } from "react";
import { MdKeyboardVoice } from "react-icons/md";

const mimeType = "audio/webm";

const RecordButton: React.FC = () => {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [, setChunks] = useState<Blob[]>([]);
  const [url, setURL] = useState("");

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          const recorder = new MediaRecorder(stream, { mimeType });
          setMediaRecorder(recorder);
          recorder.addEventListener("dataavailable", (e: BlobEvent) => {
            setChunks((prev) => [...prev, e.data]);
          });
          recorder.addEventListener("stop", () => {
            setChunks((curr) => {
              const blob = new Blob(curr, { type: mimeType });
              setURL(URL.createObjectURL(blob));
              return [];
            });
          });
        })
        .catch((err) => {
          console.error(`The following getUserMedia error occurred: ${err}`);
        });
    } else console.log("getUserMedia not supported on your browser!");
  }, []);

  function handleRecording() {
    if (!mediaRecorder) return;
    mediaRecorder.state === "recording"
      ? mediaRecorder.stop()
      : mediaRecorder.start();
    console.log(mediaRecorder.state);
  }

  return (
    <>
      <i
        onMouseDown={handleRecording}
        onMouseUp={handleRecording}
        className="group"
      >
        <MdKeyboardVoice
          className="fill-onBG-light dark:fill-onBG-dark active:scale-90 group-hover:fill-active group-hover:opacity-100 cursor-pointer opacity-60"
          size={25}
        />
      </i>
      {/* {blob && (
        <AudioVisualizer
          blob={blob}
          width={300}
          height={75}
          barWidth={2}
          gap={6}
          currentTime={1}
          barPlayedColor="#0f111a"
          barColor="#f76565"
        />
      )} */}
    </>
  );
};
export default RecordButton;

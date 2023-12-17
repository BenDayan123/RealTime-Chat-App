//@ts-ignore
import { AudioVisualizer } from "react-audio-visualize";
import { useEffect, useRef, useState } from "react";
import { MdPlayArrow, MdOutlinePause } from "react-icons/md";
import { cn, secondsToISOFormet } from "@lib/utils";
import axios from "axios";
import usePromise from "@hooks/usePromise";

interface Props {
  audio: Blob | string;
  className?: string;
}

async function generateURL(audio: Props["audio"]) {
  if (audio instanceof Blob)
    return { url: URL.createObjectURL(audio), blob: audio };

  const { data } = await axios.get(audio, {
    responseType: "arraybuffer",
    headers: {
      "Content-Type": "audio/wav",
    },
  });
  return {
    url: audio,
    blob: new Blob([data], {
      type: "audio/wav",
    }),
  };
}

export const VoicePlayer: React.FC<Props> = ({ audio, className }) => {
  const playerRef = useRef<HTMLAudioElement>(null);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [data] = usePromise(() => generateURL(audio), [audio]);
  const { url, blob } = data || {};
  const player = playerRef.current;

  function handleTimeChange(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const boundingBox = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - boundingBox.left;
    const percentage = (clickX / boundingBox.width) * 100;
    const clampedPercentage = Math.max(0, Math.min(100, percentage));
    if (playerRef.current && playerRef.current.duration !== Infinity) {
      playerRef.current.currentTime =
        (playerRef.current.duration * clampedPercentage) / 100;
    }
  }
  const togglePlayPause = () => {
    if (!player) return;
    player.paused ? player.play() : player.pause();
  };

  useEffect(() => {
    playerRef.current && playerRef.current.load();
  }, [playerRef]);

  return (
    <div
      className={cn(
        "flex items-center gap-x-2 overflow-hidden rounded-full px-2",
        className,
      )}
    >
      <audio
        src={url}
        ref={playerRef}
        onDurationChange={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
      />
      <div className="relative">
        <div
          className={cn(
            "relative z-10 aspect-square cursor-pointer rounded-full bg-blue-500 p-2 transition-colors duration-700 active:scale-75",
            !player?.paused && "bg-white",
          )}
          onClick={() => togglePlayPause()}
        >
          {player?.paused ? (
            <MdPlayArrow size={25} className="fill-white" />
          ) : (
            <MdOutlinePause size={25} className="fill-blue-500" />
          )}
        </div>
        <div
          className={cn(
            "absolute-center pointer-events-auto z-0 aspect-square h-auto w-32 rounded-full bg-blue-500 transition-[transform] duration-500 ease-in-out",
            player?.paused ? "scale-0" : "scale-[5]",
            player?.readyState === 2 && "animate-pulse",
          )}
        ></div>
      </div>

      <div onClick={handleTimeChange} className="z-10 flex-1 cursor-pointer">
        <AudioVisualizer
          blob={blob}
          width={160}
          height={55}
          currentTime={currentTime}
          barWidth={2}
          barPlayedColor="white"
          gap={3}
          barColor="#ffffff6e"
        />
      </div>
      <p className="z-10 p-2 text-sm font-bold text-black dark:text-white">
        {secondsToISOFormet(duration - currentTime)}
      </p>
    </div>
  );
};

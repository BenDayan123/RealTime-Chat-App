import { IMessage, IReaction } from "@interfaces/message";
import { useEffect, useMemo } from "react";

interface Props {
  reactions: IMessage["reactions"];
}

const ReactionBar: React.FC<Props> = ({ reactions }) => {
  const { emojies, counter } = useMemo(
    () => ({
      counter: Object.values(reactions).reduce(
        (acc, curr) => curr.length + acc,
        0,
      ),
      emojies: Object.keys(reactions),
    }),
    [reactions],
  );

  if (!Boolean(counter)) return null;

  return (
    <div className="w-fit -translate-y-1/3 select-none space-x-1 rounded-full bg-surface-light px-2 py-1 text-xs dark:bg-surface-dark">
      {emojies.map((emoji) => (
        <span key={emoji}>{emoji}</span>
      ))}
      <span className="text-onSurface-light dark:text-onSurface-dark">
        {counter}
      </span>
    </div>
  );
};

export default ReactionBar;

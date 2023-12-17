import DotPulse from "@components/loaders/dotPulse";

interface Props {
  name: string;
}
export const TypingBubble: React.FC<Props> = ({ name }) => {
  return (
    <div className="text-white mx-auto my-4 flex gap-x-2 items-center">
      <p className="text-onBG-light dark:text-onBG-dark text-sm inline-flex">
        <b className="text-blue-300 mx-1">{name}</b>is typing
      </p>
      <div className="px-4 rounded-full bg-onBG-light bg-opacity-60">
        <DotPulse />
      </div>
    </div>
  );
};

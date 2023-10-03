import { DotPulse } from "@uiball/loaders";

interface Props {
  name: string;
}
export const TypingBubble: React.FC<Props> = ({ name }) => {
  return (
    <div className="text-white mx-auto my-4 flex gap-x-2 items-center">
      <div className="py-2 px-3 rounded-full bg-onBG-light bg-opacity-60">
        <DotPulse size={15} speed={1} color="gray" />
      </div>
      <p className="text-onBG-light dark:text-onBG-dark text-sm">
        <b className="text-blue-300">{name}</b>
      </p>
    </div>
  );
};

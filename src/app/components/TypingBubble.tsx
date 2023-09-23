import { DotPulse } from "@uiball/loaders";

interface Props {
  user: any;
}
export const TypingBubble: React.FC<Props> = ({ user }) => {
  return (
    <div className="text-white mx-auto my-4 flex gap-x-2 items-center">
      <div className="py-2 px-3 rounded-full bg-onBG-light bg-opacity-60">
        <DotPulse size={20} speed={1} color="gray" />
      </div>
      <p className="text-onBG-light dark:text-onBG-dark">
        <b className="text-blue-400">{user.name}</b> is typing
      </p>
    </div>
  );
};

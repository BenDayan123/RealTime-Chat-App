import ProfileStatus from "@components/ProfileStatus";

interface Props {
  title: string;
  image: string;
}

const ChatTitle: React.FC<Props> = ({ title, image }) => {
  return (
    <header
      className="w-full p-5 absolute backdrop-blur flex gap-4 items-center z-10 border-b-2
        bg-surface-light bg-opacity-80 dark:bg-surface-dark dark:border-b-slate-200/10 dark:bg-opacity-60"
    >
      <ProfileStatus src={image} alt="" />
      <p className="text-onSurface-light dark:text-onSurface-dark">{title}</p>
    </header>
  );
};

export default ChatTitle;

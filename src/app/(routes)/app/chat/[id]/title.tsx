import ProfileStatus from "@components/ProfileStatus";

interface Props {
  title: string;
  image: string;
  onClick?: () => void;
}

const ChatTitle: React.FC<Props> = ({ title, image, onClick }) => {
  return (
    <header
      className="relative z-10 flex w-full items-center gap-4 border-b-2 bg-surface-light bg-opacity-80
        p-5 backdrop-blur dark:border-b-slate-200/10 dark:bg-surface-dark dark:bg-opacity-60"
      onClick={onClick}
    >
      {image && <ProfileStatus src={image} className="h-14" alt="" />}
      {title && (
        <p className="text-onSurface-light dark:text-onSurface-dark">{title}</p>
      )}
    </header>
  );
};

export default ChatTitle;

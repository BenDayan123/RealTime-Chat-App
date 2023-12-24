import { useChat } from "@hooks/useChat";
import { IMessage } from "@interfaces/message";
import { cn } from "@lib/utils";
import { MdClose } from "react-icons/md";

interface Props
  extends React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    >,
    Partial<IMessage> {
  // name?: string;
  // body?: string;
  // files?: IFile[];
  onForm?: boolean;
}

const MessageReplay: React.FC<Props> = ({
  from,
  body,
  onForm,
  files,
  className,
  ...props
}) => {
  const { setReplay } = useChat();

  function embedBody() {
    if (body) return body;
    if (files && files?.length > 0) return `${files?.length} attachments 📂`;
    return "🎙️ voice message";
  }

  return (
    <div className={cn("w-full select-none p-1", onForm && "p-3 pb-0")}>
      <div
        className={cn(
          "relative rounded-md border-l-2 border-blue-500 bg-gray-200 px-5 py-3 dark:bg-gray-800",
          className,
        )}
        {...props}
      >
        <div className="font-bold text-gray-700 dark:text-gray-200">
          {onForm && "Replay To "}
          <span className="font-bold text-blue-500">{from?.name}</span>
        </div>
        <p className="text-gray-700 dark:text-gray-200">{embedBody()}</p>
        {onForm && (
          <span
            className="absolute right-0 top-0 m-2 cursor-pointer rounded-full p-1 transition-all hover:bg-black/30 active:scale-90 dark:hover:bg-white/30"
            onClick={() => setReplay(null)}
          >
            <MdClose className="fill-gray-700 dark:fill-gray-200" size={15} />
          </span>
        )}
      </div>
    </div>
  );
};

export default MessageReplay;

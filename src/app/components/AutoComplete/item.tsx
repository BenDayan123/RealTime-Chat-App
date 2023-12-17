import ProfileStatus from "@components/ProfileStatus";
import { cn } from "@lib/utils";
import { MdCheck } from "react-icons/md";
import { SearchedUser } from ".";

interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  data: SearchedUser;
}

const Option: React.FC<Props> = ({ data: user, onClick, ...rest }) => {
  const { id, name, email, image } = user;
  const selected = false;
  return (
    <div
      className={cn(
        "relative cursor-pointer select-none px-2 py-1 text-gray-900 hover:bg-blue-500 hover:text-white dark:text-white",
        // active && "bg-blue-500 text-white",
      )}
      onClick={onClick}
    >
      <div className="flex gap-2">
        <ProfileStatus src={image} alt={name} width={35} height={35} />
        <div className="truncate">
          <h2 className={cn(selected ? "font-medium" : "font-normal")}>
            {name}
          </h2>
          <p className="text-gray-900 dark:text-white/60">{email}</p>
        </div>
      </div>
      {selected && (
        <span
          className={cn(
            "absolute inset-y-0 left-0 flex items-center pl-3",
            //   "active" ? "text-white" : "text-teal-600",
          )}
        >
          <MdCheck className="h-5 w-5" />
        </span>
      )}
    </div>
  );
};

export default Option;

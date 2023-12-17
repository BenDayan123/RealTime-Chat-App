import dayjs from "dayjs";
interface Props {
  date: Date;
  prevDate?: Date;
}

export const DateSeparator: React.FC<Props> = ({ date, prevDate }) => {
  const dateObj = dayjs(date);
  if (
    prevDate &&
    dayjs(prevDate).startOf("day").diff(dateObj.startOf("day"), "d") === 0
  )
    return null;

  const renderDateByNow = () => {
    const diff = dayjs(new Date())
      .startOf("day")
      .diff(dateObj.startOf("day"), "d");
    switch (diff) {
      case 0: {
        return "Today";
      }
      case 1: {
        return "Yesterday";
      }
      default: {
        return dayjs(date).format("dddd, MMM D");
      }
    }
  };
  return (
    <div
      className="mx-auto my-2 w-fit select-none rounded-md bg-blue-50 px-2 py-1 text-sm font-medium text-blue-700 
      ring-1 ring-inset ring-blue-700/10 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30"
    >
      {renderDateByNow()}
    </div>
  );
};

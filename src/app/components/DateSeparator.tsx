import { calcDaysDifference, formatDateToDDMMYY } from "@lib/utils";
interface Props {
  date: Date;
  prevDate?: Date;
}

export const DateSeparator: React.FC<Props> = ({ date, prevDate }) => {
  if (prevDate && calcDaysDifference(prevDate, date) === 0) return null;

  const renderDateByNow = () => {
    switch (calcDaysDifference(date, new Date())) {
      case 0: {
        return "Today";
      }
      case 1: {
        return "Yesterday";
      }
      default: {
        return formatDateToDDMMYY(date);
      }
    }
  };
  return (
    <div
      className="rounded-md w-min bg-blue-50 px-2 py-1 my-2 mx-auto text-sm font-medium text-blue-700 ring-1 
      ring-inset ring-blue-700/10 dark:ring-blue-400/30 dark:text-blue-400 dark:bg-blue-400/10 select-none"
    >
      {renderDateByNow()}
    </div>
  );
};

import { calcDaysDifference, formatDateToDDMMYY } from "@lib/utils";

interface Props {
  date: Date;
  prevDate?: Date;
}

export const DateSeparator: React.FC<Props> = ({ date, prevDate }) => {
  if (prevDate && calcDaysDifference(prevDate, date) === 0) return null;

  const renderDateByCalander = () => {
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
    <div className="rounded-full bg-blue-500 text-white mx-auto px-4 py-2 select-none sticky top-0">
      {renderDateByCalander()}
    </div>
  );
};

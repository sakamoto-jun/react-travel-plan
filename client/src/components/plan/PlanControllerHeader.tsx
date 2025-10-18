import CalenderIcon from "@/assets/icons/calendar_today.svg?react";
import { format } from "date-fns";

interface Props {
  startDate: Date | null;
  endDate: Date | null;
}

const PlanControllerHeader = ({ startDate, endDate }: Props) => {
  return (
    <div className="mb-18 flex flex-col gap-y-18 leading-none">
      <h2 className="text-35 font-bold text-left">도쿄</h2>
      {startDate && endDate && (
        <div className="flex items-center gap-x-8">
          <span className="text-17 font-medium tracking-[0.17px]">{`${format(
            startDate,
            "yyyy.MM.dd(EEE)"
          )} - ${format(endDate, "yyyy.MM.dd(EEE)")}`}</span>
          <CalenderIcon />
        </div>
      )}
    </div>
  );
};

export default PlanControllerHeader;

import DeleteIcon from "@/assets/icons/delete.svg?react";
import type { Place } from "@/types";
import { addDays, format } from "date-fns";

interface ListProps {
  startDate: Date;
  plannedAccommodations: (Place | null)[];
  onRemoveAccommodation: (index: number) => void;
}
interface ItemProps {
  index: number;
  dateLabel: string;
  plannedAccommodation: Place | null;
  onRemoveAccommodation: () => void;
}

// 리스트
const PlannedAccommodationList = ({
  startDate,
  plannedAccommodations,
  onRemoveAccommodation,
}: ListProps) => {
  return (
    <ul className="flex flex-col gap-y-8">
      {plannedAccommodations.map((plannedAccommodation, index) => {
        const dateLabel = createAccommodationDateLabel(startDate, index);

        return (
          <PlannedAccommodationItem
            key={index}
            index={index}
            dateLabel={dateLabel}
            plannedAccommodation={plannedAccommodation}
            onRemoveAccommodation={() => onRemoveAccommodation(index)}
          />
        );
      })}
    </ul>
  );
};

// 아이템
const PlannedAccommodationItem = ({
  index,
  dateLabel,
  plannedAccommodation,
  onRemoveAccommodation,
}: ItemProps) => {
  return (
    <li className="flex items-center">
      <div className="flex justify-center items-center w-30 h-30 rounded-full bg-[#B335C7] mr-10">
        <span className="text-16 font-semibold text-white tracking-[0.16px]">
          {index + 1}
        </span>
      </div>
      <div className="flex items-center w-[390px] px-12 py-10 border border-gray200 bg-white rounded-10">
        {plannedAccommodation ? (
          <img
            className="w-48 h-48 bg-bg rounded-6 shrink-0 mr-12"
            src={plannedAccommodation.thumbnail}
            alt={plannedAccommodation.name}
          />
        ) : (
          <div className="w-48 h-48 bg-bg rounded-6 shrink-0 mr-12"></div>
        )}
        <div className="flex-1 mr-12">
          <h6 className="text-15 font-semibold tracking-[0.15px] mb-8">
            {plannedAccommodation
              ? plannedAccommodation.name
              : "숙소를 추가해 주세요."}
          </h6>
          <p className="text-14 text-gray500 tracking-[0.14px]">{dateLabel}</p>
        </div>
        {plannedAccommodation && (
          <button type="button" onClick={onRemoveAccommodation}>
            <DeleteIcon />
          </button>
        )}
      </div>
    </li>
  );
};

// 유틸 함수
function createAccommodationDateLabel(startDate: Date, index: number) {
  const dayStart = addDays(startDate, index);
  const dayEnd = addDays(startDate, index + 1);

  const startStr = format(dayStart, "MM.dd(EEE)");
  const endStr = format(dayEnd, "MM.dd(EEE)");

  return `${startStr} - ${endStr}`;
}

export default PlannedAccommodationList;

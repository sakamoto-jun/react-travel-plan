import DeleteIcon from "@/assets/icons/delete.svg?react";
import type { Place } from "@/types";
import { clamp, convertMinutesToTime } from "@/utils/time";
import { useEffect, useState } from "react";
import Button from "../common/Button";
import CategoryLabel from "../common/CategoryLabel";

interface Props {
  plannedPlaces: {
    place: Place;
    duration: number;
  }[];
  onRemovePlace: (index: number) => void;
  onChangeDuration: (index: number, duration: number) => void;
}

const PlannedPlaceList = ({
  plannedPlaces,
  onRemovePlace,
  onChangeDuration,
}: Props) => {
  return (
    <ul className="flex flex-col gap-y-8">
      {plannedPlaces.map((plannedPlace, index) => (
        <PlannedPlaceItem
          key={plannedPlace.place.name}
          index={index}
          plannedPlace={plannedPlace}
          onRemovePlace={() => onRemovePlace(index)}
          onChangeDuration={(duration: number) =>
            onChangeDuration(index, duration)
          }
        />
      ))}
    </ul>
  );
};

const PlannedPlaceItem = ({
  index,
  plannedPlace,
  onRemovePlace,
  onChangeDuration,
}: {
  index: number;
  plannedPlace: { place: Place; duration: number };
  onRemovePlace: () => void;
  onChangeDuration: (duration: number) => void;
}) => {
  const { place, duration } = plannedPlace;
  const { hours, minutes } = convertMinutesToTime(duration);

  const [isEditing, setIsEditing] = useState(false);
  const [hoursValue, setHoursValue] = useState(hours);
  const [minutesValue, setMinutesValue] = useState(minutes);

  useEffect(() => {
    setHoursValue(hours);
    setMinutesValue(minutes);
  }, [hours, minutes]);

  const handleCompleteEdit = () => {
    const totalMinutes = hoursValue * 60 + minutesValue;

    onChangeDuration(totalMinutes);
    setIsEditing(false);
  };

  return (
    <li className="flex items-center">
      <div className="flex justify-center items-center w-30 h-30 rounded-full bg-main mr-10">
        <span className="text-16 font-semibold text-white tracking-[0.16px]">
          {index + 1}
        </span>
      </div>
      <div className="flex items-center w-[390px] px-12 py-10 border border-gray200 bg-white rounded-10">
        {!isEditing ? (
          <>
            <img
              className="w-48 h-48 bg-bg rounded-6 shrink-0 mr-12"
              src={place.thumbnail}
              alt={place.name}
            />
            <div className="flex-1 mr-12">
              <h6 className="text-15 font-semibold tracking-[0.15px] mb-8">
                {place.name}
              </h6>
              <p className="inline-flex gap-x-6 text-14 tracking-[0.14px]">
                <CategoryLabel category={place.category} />
                <span
                  className="max-w-160 text-gray500 truncate"
                  title={place.address}
                >
                  {place.address}
                </span>
              </p>
            </div>
            <Button
              variant="action"
              className="shrink-0 mr-5"
              onClick={() => setIsEditing(true)}
            >
              {hours}시 {minutes}분
            </Button>
            <button type="button" onClick={onRemovePlace}>
              <DeleteIcon />
            </button>
          </>
        ) : (
          <>
            <span className="leading-[48px] text-15 font-semibold tracking-[0.15px]">
              머무는 시간
            </span>
            <div className="flex-1 inline-flex items-center justify-center text-15 font-medium tracking-[0.15px]">
              <input
                type="number"
                className="max-w-45 text-20 font-medium tracking-[0.2px] text-right"
                min={0}
                max={99}
                value={hoursValue}
                onInput={(e) => {
                  const target = e.currentTarget;
                  if (target.value.length > 2) {
                    target.value = target.value.slice(0, 2); // 입력 값 자릿수가 2개 이상이면 2개로 제한
                  }
                  setHoursValue(clamp(Number(target.value), 0, 99));
                }}
              />
              <span className="mr-12">시간</span>
              <input
                type="number"
                className="max-w-45 text-20 font-medium tracking-[0.2px] text-right"
                min={0}
                max={59}
                value={minutesValue}
                onInput={(e) => {
                  const target = e.currentTarget;
                  if (target.value.length > 2) {
                    target.value = target.value.slice(0, 2);
                  }
                  setMinutesValue(clamp(Number(target.value), 0, 59));
                }}
              />
              <span>분</span>
            </div>
            <Button
              variant="action"
              className="mr-5"
              onClick={handleCompleteEdit}
            >
              완료
            </Button>
          </>
        )}
      </div>
    </li>
  );
};

export default PlannedPlaceList;

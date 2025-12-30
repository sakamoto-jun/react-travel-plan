import { usePlanStore } from '@/store';
import { convertMinutesToTime, convertTimeToMinutes, formatTimeUnit } from '@/utils/time';
import { useMemo } from 'react';
import { useShallow } from 'zustand/shallow';
import PlannedPlaceList from './PlannedPlaceList';

const PlaceController = () => {
  const { dailyTimes, plannedPlaces, removePlannedPlace, setDurationForPlannedPlace } =
    usePlanStore(
      useShallow((s) => ({
        dailyTimes: s.dailyTimes,
        plannedPlaces: s.plannedPlaces,
        removePlannedPlace: s.removePlannedPlace,
        setDurationForPlannedPlace: s.setDurationForPlannedPlace,
      }))
    );

  const { plannedTime, totalTime } = useMemo(() => {
    const plannedTime =
      plannedPlaces?.reduce((sum, { duration }) => {
        return sum + duration;
      }, 0) ?? 0;
    const totalTime =
      dailyTimes?.reduce((sum, { startTime, endTime }) => {
        return sum + (convertTimeToMinutes(endTime) - convertTimeToMinutes(startTime));
      }, 0) ?? 0;

    return {
      plannedTime: convertMinutesToTime(plannedTime),
      totalTime: convertMinutesToTime(totalTime),
    };
  }, [dailyTimes, plannedPlaces]);

  return (
    <div className="flex flex-col">
      <h5 className="inline-flex items-end text-black mb-13">
        <span className="text-30 font-medium tracking-[0.3px] mr-8">{plannedPlaces.length}</span>
        <span className="text-15 tracking-[0.15px] mb-4">
          {`${formatTimeUnit(plannedTime.hours)}시간 ${formatTimeUnit(
            plannedTime.minutes
          )}분 / ${formatTimeUnit(totalTime.hours)}시간 ${formatTimeUnit(totalTime.minutes)}분`}
        </span>
      </h5>
      {plannedPlaces.length > 0 ? (
        <PlannedPlaceList
          plannedPlaces={plannedPlaces}
          onRemovePlace={removePlannedPlace}
          onChangeDuration={setDurationForPlannedPlace}
        />
      ) : (
        <EmptyList />
      )}
    </div>
  );
};

const EmptyList = () => {
  return (
    <div className="flex justify-center items-end w-[430px] h-90 bg-bg rounded-10">
      <p className="text-14 text-gray500 mb-5">장소를 선택해 주세요</p>
    </div>
  );
};

export default PlaceController;

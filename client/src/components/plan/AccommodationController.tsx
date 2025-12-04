import { usePlanStore } from "@/store";
import PlannedAccommodationList from "./PlannedAccommodationList";

const AccommodationController = () => {
  const { plannedAccommodations, removePlannedAccommodation, startDate } =
    usePlanStore();

  const plannedAccommodationsLength =
    plannedAccommodations.filter(Boolean).length;
  const accommodationsCount = new Set(plannedAccommodations).size;

  return (
    <div className="flex flex-col">
      <h5 className="inline-flex items-end text-black mb-13">
        <span className="text-30 font-medium tracking-[0.3px] mr-8">
          {accommodationsCount}
        </span>
        <span className="text-15 tracking-[0.15px] mb-4">
          {plannedAccommodationsLength}일 / {plannedAccommodations.length}일
        </span>
      </h5>
      <PlannedAccommodationList
        startDate={startDate!}
        plannedAccommodations={plannedAccommodations}
        onRemoveAccommodation={removePlannedAccommodation}
      />
    </div>
  );
};

export default AccommodationController;

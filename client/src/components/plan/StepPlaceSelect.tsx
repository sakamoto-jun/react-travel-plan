import PlaceContainer from "./PlaceContainer";
import PlaceController from "./PlaceController";

const StepPlaceSelect = () => {
  return (
    <div className="flex-1 overflow-y-hidden">
      <div className="flex flex-col h-full">
        <div className="mb-18 p-14 border-b-3 border-b-main text-center">
          <h4 className="text-18 font-semibold text-main">장소 선택</h4>
        </div>
        <PlaceContainer />
      </div>
      <div className="absolute z-10 min-w-[400px] left-full top-0 bottom-0 px-24 py-30 bg-white">
        <PlaceController />
      </div>
    </div>
  );
};

export default StepPlaceSelect;

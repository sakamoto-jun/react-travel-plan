import PlaceContainer from "./PlaceContainer";

const StepPlaceSelect = () => {
  return (
    <div className="flex-1 flex flex-col overflow-y-hidden">
      <div className="mb-18 p-14 border-b-3 border-b-main text-center">
        <h4 className="text-18 font-semibold text-main">장소 선택</h4>
      </div>
      <PlaceContainer />
    </div>
  );
};

export default StepPlaceSelect;

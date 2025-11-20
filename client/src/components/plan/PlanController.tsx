import { usePlanStore } from "@/store";
import Wizard from "../common/Wizard";
import PlaceContainer from "./PlaceContainer";
import PlaceController from "./PlaceController";
import PlanControllerHeader from "./PlanControllerHeader";
import StepDateConfirm from "./StepDateConfirm";

const PlanController = () => {
  const { startDate, endDate } = usePlanStore();

  const steps = [
    {
      title: "날짜 확인",
      component: ({ onNext }: { onNext: () => void }) => (
        <div className="relative flex flex-col px-24 py-30">
          <PlanControllerHeader startDate={startDate} endDate={endDate} />
          <StepDateConfirm onCompleted={onNext} />
        </div>
      ),
    },
    {
      title: "장소 선택",
      component: () => (
        <>
          <div className="flex flex-col px-24 py-30">
            <PlanControllerHeader startDate={startDate} endDate={endDate} />
            <div className="flex-1 overflow-y-hidden">
              <div className="flex flex-col h-full">
                <div className="mb-18 p-14 border-b-3 border-b-main text-center">
                  <h4 className="text-18 font-semibold text-main">장소 선택</h4>
                </div>
                <PlaceContainer />
              </div>
            </div>
          </div>
          <div className="px-24 py-30 bg-white">
            <PlaceController />
          </div>
        </>
      ),
    },
    { title: "숙소 선택", component: () => <div>숙소 선택</div> },
  ];

  return <Wizard steps={steps} />;
};

export default PlanController;

import { usePlanStore } from "@/store";
import Wizard from "../common/Wizard";
import PlanControllerHeader from "./PlanControllerHeader";
import StepDateConfirm from "./StepDateConfirm";
import StepPlaceSelect from "./StepPlaceSelect";

const steps = [
  { title: "날짜 확인", component: StepDateConfirm },
  { title: "장소 선택", component: StepPlaceSelect },
  { title: "숙소 선택", component: () => <div>숙소 선택</div> },
];

const PlanController = () => {
  const { startDate, endDate } = usePlanStore();

  return (
    <Wizard steps={steps}>
      <PlanControllerHeader startDate={startDate} endDate={endDate} />
    </Wizard>
  );
};

export default PlanController;

import { usePlanStore } from "@/store";
import DailyTimeSelector from "./DailyTimeSelector";
import PlanControllerHeader from "./PlanControllerHeader";
import PlanSteps from "./PlanSteps";

const PlanController = () => {
  const { startDate, endDate } = usePlanStore();

  return (
    <div className="flex">
      <PlanSteps />
      <div className="px-24 py-30">
        <PlanControllerHeader startDate={startDate} endDate={endDate} />
        <DailyTimeSelector />
      </div>
    </div>
  );
};

export default PlanController;

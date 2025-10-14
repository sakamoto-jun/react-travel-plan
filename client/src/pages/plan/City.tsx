import TravelPeriodModal from "@/components/plan/TravelPeriodModal";
import { usePlanStore } from "@/store";

const PlanCity = () => {
  const { status } = usePlanStore();

  if (status === "period_edit") return <TravelPeriodModal />;
};

export default PlanCity;

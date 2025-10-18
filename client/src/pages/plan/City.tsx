import WideLayout from "@/components/common/WideLayout";
import PlanController from "@/components/plan/PlanController";
import TravelPeriodModal from "@/components/plan/TravelPeriodModal";
import { usePlanStore } from "@/store";

const PlanCity = () => {
  const { status } = usePlanStore();

  return (
    <>
      {status === "period_edit" && <TravelPeriodModal />}
      <WideLayout>
        <div className="flex h-full">
          <PlanController />
          <div className="flex-1 bg-gray300">지도 영역</div>
        </div>
      </WideLayout>
    </>
  );
};

export default PlanCity;

import Loading from "@/components/common/Loading";
import WideLayout from "@/components/common/WideLayout";
import Map from "@/components/plan/Map";
import PlanController from "@/components/plan/PlanController";
import TravelPeriodModal from "@/components/plan/TravelPeriodModal";
import { getCity } from "@/services/plan";
import { usePlanStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const PlanCity = () => {
  const { city: cityCode } = useParams();
  const { status } = usePlanStore();
  const { data, isLoading, error } = useQuery({
    queryKey: ["city", cityCode],
    queryFn: () => getCity(cityCode!),
    enabled: !!cityCode,
  });

  if (isLoading) return <Loading />;
  if (error) return <div>에러가 발생했습니다 😭</div>;
  if (!data) return null;

  return (
    <>
      {status === "period_edit" && <TravelPeriodModal />}
      <WideLayout>
        <div className="flex h-full">
          <PlanController />
          <div className="flex-1 bg-gray300">
            <Map center={data.coordinates} />
          </div>
        </div>
      </WideLayout>
    </>
  );
};

export default PlanCity;

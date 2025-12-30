import ErrorMessage from '@/components/common/ErrorMessage';
import Loading from '@/components/common/Loading';
import WideLayout from '@/components/common/WideLayout';
import PlanController from '@/components/plan/PlanController';
import PlanMapContainer from '@/components/plan/PlanMapContainer';
import TravelPeriodModal from '@/components/plan/TravelPeriodModal';
import { planQueries } from '@/services/queryFactory';
import { usePlanStore } from '@/store';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

const PlanCity = () => {
  const { city: cityCode } = useParams();
  const status = usePlanStore((s) => s.status);
  const {
    data: city,
    isLoading,
    error,
  } = useQuery({
    ...planQueries.city(cityCode ?? ''),
    enabled: Boolean(cityCode),
  });

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage />;
  if (!city) return null;

  return (
    <>
      {status === 'period_edit' && <TravelPeriodModal />}
      <WideLayout>
        <div className="flex h-full">
          <PlanController city={city} />
          <div className="flex-1 bg-gray300">
            <PlanMapContainer coordinates={city.coordinates} />
          </div>
        </div>
      </WideLayout>
    </>
  );
};

export default PlanCity;

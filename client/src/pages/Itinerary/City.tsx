import ErrorMessage from '@/components/common/ErrorMessage';
import Loading from '@/components/common/Loading';
import WideLayout from '@/components/common/WideLayout';
import ItineraryController from '@/components/itinerary/ItineraryController';
import useGenerateItinerary from '@/hooks/Itinerary/useGenerateItinerary';
import { planQueries } from '@/services/queryFactory';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const ItineraryCity = () => {
  const { city: cityCode } = useParams();
  const itineraryQuery = useGenerateItinerary();
  const cityQuery = useQuery({
    ...planQueries.city(cityCode ?? ''),
    enabled: Boolean(cityCode),
  });
  const navigate = useNavigate();

  useEffect(() => {
    if (itineraryQuery.isInvalid) navigate(`/plan/${cityCode}`, { replace: true });
  }, [itineraryQuery.isInvalid, cityCode, navigate]);

  if (itineraryQuery.isLoading || cityQuery.isLoading) return <Loading />;
  if (itineraryQuery.error || cityQuery.error) return <ErrorMessage />;
  if (!itineraryQuery.data || !cityQuery.data) return null;

  return (
    <WideLayout>
      <div className="h-full">
        <ItineraryController itinerary={itineraryQuery.data} city={cityQuery.data} />
      </div>
    </WideLayout>
  );
};

export default ItineraryCity;

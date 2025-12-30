import useDebounce from '@/hooks/common/useDebounce';
import { getPlaces } from '@/services/plan';
import { usePlanStore } from '@/store';
import type { Place } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import ErrorMessage from '../common/ErrorMessage';
import Loading from '../common/Loading';
import SearchInput from '../common/SearchInput';
import PlaceList from './PlaceList';

const AccommodationContainer = () => {
  const [queryValue, setQueryValue] = useState('');

  const addPlannedAccommodation = usePlanStore((s) => s.addPlannedAccommodation);

  const debouncedQueryValue = useDebounce(queryValue);

  const { city: cityCode } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ['accommdations', cityCode, debouncedQueryValue],
    queryFn: () => {
      const queryString = {
        ...{ category: 'accommodation' },
        ...(debouncedQueryValue ? { q: debouncedQueryValue } : {}),
      }; // undefined 조건 제거

      return getPlaces(cityCode!, queryString);
    },
    enabled: Boolean(cityCode),
    staleTime: 5000,
  });

  return (
    <div className="min-w-[380px] flex-1 flex flex-col gap-y-18 overflow-y-hidden">
      <SearchInput
        className="h-40"
        placeholder="숙소명을 입력하세요"
        onSearch={(q) => setQueryValue(q)}
      />
      {isLoading && <Loading />}
      {!isLoading && error && <ErrorMessage />}
      {!isLoading && !error && data && (
        <PlaceList places={data} onAddPlace={(place: Place) => addPlannedAccommodation(place)} />
      )}
    </div>
  );
};

export default AccommodationContainer;

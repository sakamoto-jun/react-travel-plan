import useDebounce from "@/hooks/useDebounce";
import { getPlaces } from "@/services/plan";
import { usePlanStore } from "@/store";
import type { Place } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import Loading from "../common/Loading";
import SearchInput from "../common/SearchInput";
import PlaceFilterList from "./PlaceFilterList";
import PlaceList from "./PlaceList";

const PlaceContainer = () => {
  const [queryValue, setQueryValue] = useState("");
  const [filterType, setFilterType] = useState<Place["category"] | null>(null);

  const { addPlannedPlace } = usePlanStore();

  const debouncedQueryValue = useDebounce(queryValue);

  const { city: cityCode } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["places", cityCode, debouncedQueryValue, filterType],
    queryFn: () => {
      const queryString = {
        ...(filterType ? { category: filterType } : {}),
        ...(debouncedQueryValue ? { q: debouncedQueryValue } : {}),
      }; // undefined 조건 제거

      return getPlaces(cityCode!, queryString);
    },
    enabled: Boolean(cityCode),
    staleTime: 5000,
  });

  const handleChangeFilter = (category: Place["category"]) => {
    if (filterType === category) {
      setFilterType(null);
    } else {
      setFilterType(category);
    }
  };

  return (
    <div className="flex-1 flex flex-col gap-y-18 overflow-y-hidden">
      <SearchInput
        className="h-40"
        placeholder="장소명을 입력하세요"
        onSearch={(q) => setQueryValue(q)}
      />
      <PlaceFilterList
        filterType={filterType}
        onChangeFilter={handleChangeFilter}
      />
      {isLoading && <Loading />}
      {!isLoading && error && (
        <div className="text-gray400 text-14">에러가 발생했습니다 😭</div>
      )}
      {!isLoading && !error && data && (
        <PlaceList
          places={data}
          onAddPlace={(place: Place) => addPlannedPlace(place)}
        />
      )}
    </div>
  );
};

export default PlaceContainer;

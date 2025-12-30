import ErrorMessage from "@/components/common/ErrorMessage";
import Loading from "@/components/common/Loading";
import NarrowLayout from "@/components/common/NarrowLayout";
import SearchInput from "@/components/common/SearchInput";
import CityList from "@/components/home/CityList";
import FilterList from "@/components/home/FilterList";
import useDebounce from "@/hooks/common/useDebounce";
import { getCities, searchCities } from "@/services/home";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Home = () => {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query);

  const { data, isLoading, error } = useQuery({
    queryKey: ["cities", debouncedQuery],
    queryFn: () => {
      if (debouncedQuery) {
        return searchCities(debouncedQuery);
      } else {
        return getCities();
      }
    }, // queryFn은 항상 return 하여 Promise를 반환하게 만들어야 됨.
    staleTime: 5000,
  });

  return (
    <NarrowLayout className="flex flex-col items-center py-30">
      <SearchInput
        className="max-w-[340px] h-40 mb-24"
        placeholder="도시, 국가, 지역으로 검색"
        onSearch={(q) => setQuery(q)}
      />
      <div className="mb-21">
        <FilterList selectedFilter="all" onChange={() => {}} />
      </div>
      {isLoading && <Loading />}
      {!isLoading && error && <ErrorMessage />}
      {!isLoading && !error && data && <CityList cities={data} />}
    </NarrowLayout>
  );
};

export default Home;

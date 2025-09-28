import Loading from "@/components/common/Loading";
import NarrowLayout from "@/components/common/NarrowLayout";
import CityList from "@/components/home/CityList";
import FilterList from "@/components/home/FilterList";
import SearchInput from "@/components/home/SearchInput";
import { getCities, searchCities } from "@/services/home";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const Home = () => {
  // const {data} = useQuery(/* 국가필터, 검색필터 */);
  const [query, setQuery] = useState("");
  const { data, isLoading, error } = useQuery({
    queryKey: ["cities", query],
    queryFn: () => {
      if (query) {
        return searchCities(query);
      } else {
        return getCities();
      }
    }, // queryFn은 항상 return 하여 Promise를 반환하게 만들어야 됨.
  });

  if (isLoading) return <Loading />;
  if (error) return <div>에러가 발생했습니다 😭</div>;
  if (!data) return null;

  return (
    <NarrowLayout className="flex flex-col items-center py-30">
      <SearchInput onCompositionEnd={(value) => setQuery(value)} />
      <div className="mb-21">
        <FilterList selectedFilter="all" onChange={() => {}} />
      </div>
      <CityList cities={data} />
    </NarrowLayout>
  );
};

export default Home;

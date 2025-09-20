import NarrowLayout from "@/components/common/NarrowLayout";
import CityList from "@/components/home/CityList";
import FilterList from "@/components/home/FilterList";
import SearchInput from "@/components/home/SearchInput";

const Home = () => {
  // const {data} = useQuery(/* 국가필터, 검색필터 */);
  // 상태 관리 여기서 진행 + 필터 처리 해줘야 함

  return (
    <NarrowLayout className="flex flex-col items-center py-30">
      <SearchInput onCompositionEnd={(value) => console.log(value)} />
      <div className="mb-21">
        <FilterList selectedFilter="all" onChange={() => {}} />
      </div>
      <CityList cities={DUMMY_DATA} />
    </NarrowLayout>
  );
};

export default Home;

const DUMMY_DATA = [
  {
    _id: "1",
    city: "seoul",
    name: "서울",
    description: "대한민국의 수도",
    thumbnail: "https://picsum.photos/316/200?random=1",
  },
  {
    _id: "2",
    city: "busan",
    name: "부산",
    description: "대한민국 제2의 도시",
    thumbnail: "https://picsum.photos/316/200?random=2",
  },
  {
    _id: "3",
    city: "jeju",
    name: "제주",
    description: "대한민국의 휴양지",
    thumbnail: "https://picsum.photos/316/200?random=3",
  },
  {
    _id: "4",
    city: "tokyo",
    name: "도쿄",
    description: "일본의 수도",
    thumbnail: "https://picsum.photos/316/200?random=4",
  },
  {
    _id: "5",
    city: "osaka",
    name: "오사카",
    description: "일본 제2의 도시",
    thumbnail: "https://picsum.photos/316/200?random=5",
  },
];

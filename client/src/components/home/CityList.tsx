import type { City } from "@/types";
import Card from "./Card";

interface CityListProps {
  cities: City[];
}

const CityList = ({ cities }: CityListProps) => {
  return (
    <div className="w-full flex flex-wrap justify-between gap-y-28 ">
      {cities.map((city) => (
        <Card
          key={city._id}
          title={city.nameEn}
          description={`${city.country.name} ${city.name}`}
          image={city.thumbnail}
        />
      ))}
    </div>
  );
};

export default CityList;

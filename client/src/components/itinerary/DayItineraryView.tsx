import SubwayIcon from '@/assets/icons/directions_subway.svg?react';
import type { ItineraryItem } from '@/types';
import CategoryLabel from '../common/CategoryLabel';

interface Props {
  places: ItineraryItem[];
}

const DayItineraryView = ({ places }: Props) => {
  return (
    <>
      {places.map(({ place, startTime, endTime }, index) => (
        <div
          key={index}
          className="flex items-center relative pl-29 before:absolute before:top-35 before:left-10 before:w-1 before:h-69 before:bg-gray200 last:before:hidden"
          data-testid="itinerary-card"
        >
          <SubwayIcon className="absolute top-0 left-0" />
          <div className="flex-1 flex flex-col gap-y-8">
            <p className="text-14 text-gray500">{`${startTime} - ${endTime}`}</p>
            <CategoryLabel category={place.category} className="text-13" />
            <h5 className="text-16 font-semibold text-gray900">{place.name}</h5>
          </div>
          <img
            src={place.thumbnail}
            alt={place.name}
            className="w-75 h-55 shrink-0 rounded-6 bg-bg"
          />
        </div>
      ))}
    </>
  );
};

export default DayItineraryView;

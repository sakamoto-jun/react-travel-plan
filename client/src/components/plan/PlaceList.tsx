import HeartIcon from "@/assets/icons/favorite.svg?react";
import StarIcon from "@/assets/icons/grade.svg?react";
import PlusIcon from "@/assets/icons/plus.svg?react";
import PlusRectIcon from "@/assets/icons/plus_rect.svg?react";
import { categories } from "@/constant";
import type { Place } from "@/types";

interface Props {
  places: Place[];
  onAddPlace: (place: Place) => void;
}

const PlaceList = ({ places, onAddPlace }: Props) => {
  return (
    <div className="flex-1 flex flex-col gap-y-24 overflow-y-auto">
      {places.map((place) => (
        <PlaceItem
          key={`${place.cityCode}_${place.name}`}
          place={place}
          onAddPlace={onAddPlace}
        />
      ))}
    </div>
  );
};

const PlaceItem = ({
  place,
  onAddPlace,
}: {
  place: Place;
  onAddPlace: (place: Place) => void;
}) => {
  const { name, thumbnail, category, address, rating, likes } = place;

  return (
    <div className="flex gap-x-11">
      <img className="w-68 h-68 rounded-6 bg-bg" src={thumbnail} alt={name} />
      <div className="flex-1 flex flex-col items-start gap-y-8">
        <h5 className="text-17 font-semibold tracking-[0.17px]">{name}</h5>
        <p className="text-14 tracking-[0.14px]">
          <span className="text-main font-medium mr-6">
            {categories[category]}
          </span>
          <span className="text-gray500">{address}</span>
        </p>
        <div className="flex gap-x-8 text-14 tracking-[0.14px] text-gray600">
          <span className="inline-flex items-center gap-4">
            <HeartIcon />
            <span>{likes.toLocaleString()}</span>
          </span>
          <span className="inline-flex items-center gap-4">
            <StarIcon />
            <span>{rating.toLocaleString()}</span>
          </span>
        </div>
      </div>
      <button
        type="button"
        className="relative"
        onClick={() => onAddPlace(place)}
      >
        <PlusRectIcon />
        <PlusIcon className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2" />
      </button>
    </div>
  );
};

export default PlaceList;

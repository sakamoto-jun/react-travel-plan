import { categories } from "@/constant";
import type { Place } from "@/types";
import clsx from "clsx";

interface Props {
  filterType: Place["category"] | null;
  onChangeFilter: (category: Place["category"]) => void;
}

const filters: Place["category"][] = ["attraction", "restaurant", "cafe"];

const PlaceFilterList = ({ filterType, onChangeFilter }: Props) => {
  return (
    <ul className="flex gap-x-6">
      {filters.map((filter) => {
        const isActive = filterType === filter;

        return (
          <li key={filter}>
            <button
              type="button"
              className={clsx(
                "px-10 py-7 border rounded-3 text-15 tracking-[0.15px] leading-none",
                isActive && "text-main border-main",
                !isActive && "text-gray600 border-gray100"
              )}
              onClick={() => onChangeFilter(filter)}
            >
              {categories[filter]}
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default PlaceFilterList;

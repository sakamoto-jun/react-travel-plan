import Filter from "./Filter";

const filters = [
  {
    key: "all",
    label: "전체",
  },
  {
    key: "domestic",
    label: "국내",
  },
  {
    key: "international",
    label: "해외",
  },
] as const;
type Filter = (typeof filters)[number]["key"];

interface FilterListProps {
  selectedFilter: Filter;
  onChange: (filter: Filter) => void;
}

const FilterList = ({ selectedFilter, onChange }: FilterListProps) => {
  return (
    <div className="flex justify-center gap-x-25">
      {filters.map((filter) => (
        <Filter
          key={filter.key}
          isActive={selectedFilter === filter.key}
          onClick={() => onChange(filter.key)}
        >
          {filter.label}
        </Filter>
      ))}
    </div>
  );
};

export default FilterList;

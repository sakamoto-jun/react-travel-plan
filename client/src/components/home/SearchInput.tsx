import SearchIcon from "@icons/search.svg?react";
import { useState } from "react";

interface SearchInputProps {
  onCompositionEnd: (value: string) => void;
}

const SearchInput = ({ onCompositionEnd }: SearchInputProps) => {
  const [search, setSearch] = useState("");

  return (
    <div className="w-full max-w-[340px] h-40 relative mb-24">
      <input
        className="pl-12 pr-46 w-full h-full bg-bg2 outline-none border border-gray200 rounded-10"
        type="text"
        placeholder="도시, 국가, 지역으로 검색"
        value={search}
        onChange={(e) => setSearch(e.currentTarget.value)}
        onCompositionEnd={(e) => onCompositionEnd(e.currentTarget.value)}
      />
      <SearchIcon className="absolute right-12 top-1/2 -translate-y-1/2" />
    </div>
  );
};

export default SearchInput;

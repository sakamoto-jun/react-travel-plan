import SearchIcon from "@icons/search.svg?react";
import clsx from "clsx";
import {
  useState,
  type ChangeEvent,
  type CompositionEvent,
  type KeyboardEvent,
} from "react";

interface SearchInputProps {
  className?: string;
  placeholder?: string;
  onSearch: (value: string) => void;
}

const SearchInput = ({
  className,
  placeholder = "검색",
  onSearch,
}: SearchInputProps) => {
  const [search, setSearch] = useState("");
  const [isComposing, setIsComposing] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;
    setSearch(value);

    if (value === "") {
      onSearch("");
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (e: CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false);
    onSearch(e.currentTarget.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isComposing) {
      onSearch(search);
    }
  };

  return (
    <div className={clsx("relative w-full", className)}>
      <input
        className="pl-12 pr-46 w-full h-full bg-bg2 outline-none border border-gray200 rounded-10"
        type="text"
        placeholder={placeholder}
        value={search}
        onChange={handleChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onKeyDown={handleKeyDown}
      />
      <SearchIcon className="absolute right-12 top-1/2 -translate-y-1/2" />
    </div>
  );
};

export default SearchInput;

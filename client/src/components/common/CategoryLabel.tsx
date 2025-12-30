import { categories } from "@/constant";
import type { Place } from "@/types";
import clsx from "clsx";
import type { HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLSpanElement> {
  category: Place["category"];
}

const CategoryLabel = ({ category, className }: Props) => {
  return (
    <span className={clsx("text-main font-medium shrink-0", className)}>
      {categories[category]}
    </span>
  );
};

export default CategoryLabel;

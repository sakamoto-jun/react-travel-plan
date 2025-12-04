import type { Place } from "./types";

export const categories: Record<Place["category"], string> = {
  attraction: "명소",
  restaurant: "식당",
  cafe: "카페",
  accommodation: "숙소",
};

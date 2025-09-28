import type { City } from "@/types";

export const getCities = async (): Promise<City[]> => {
  const res = await fetch("/api/cities");

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`도시 데이터 요청 실패: ${res.status} ${message}`);
  }

  return (await res.json()) as City[];
};

export const searchCities = async (searchValue: string): Promise<City[]> => {
  const res = await fetch(`/api/cities/search?query=${searchValue}`);

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`도시 데이터 요청 실패: ${res.status} ${message}`);
  }

  return (await res.json()) as City[];
};

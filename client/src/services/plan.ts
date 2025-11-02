import type { City, Place } from "@/types";

export const getCity = async (cityCode: string): Promise<City> => {
  const res = await fetch(`/api/cities/${cityCode}`);

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`도시 데이터 요청 실패: ${res.status} ${message}`);
  }

  return (await res.json()) as City;
};

export const getPlaces = async (
  cityCode: string,
  query: { category?: Place["category"]; q?: string }
): Promise<Place[]> => {
  const queryString = new URLSearchParams(query).toString();
  const res = await fetch(
    `/api/cities/${cityCode}/places${queryString ? `?${queryString}` : ""}`
  );

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`장소 리스트 요청 실패: ${res.status} ${message}`);
  }

  return (await res.json()) as Place[];
};

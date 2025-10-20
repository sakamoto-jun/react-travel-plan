import type { City } from "@/types";

export const getCity = async (cityCode: string): Promise<City> => {
  const res = await fetch(`/api/cities/${cityCode}`);

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`도시 데이터 요청 실패: ${res.status} ${message}`);
  }

  return (await res.json()) as City;
};

import type { City } from '@/types';

export const getCities = async (
  filter: undefined | 'domestic' | 'international'
): Promise<City[]> => {
  const queryString = new URLSearchParams(filter ? { filter } : undefined).toString();

  const res = await fetch(`/api/cities${queryString ? `?${queryString}` : ''}`);

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`도시 데이터 요청 실패: ${res.status} ${message}`);
  }

  return (await res.json()) as City[];
};

export const searchCities = async (
  searchValue: string,
  filter: undefined | 'domestic' | 'international'
): Promise<City[]> => {
  const queries = new URLSearchParams(searchValue ? { query: searchValue } : undefined);

  if (filter) {
    queries.append('filter', filter);
  }

  const queryString = queries.toString();

  const res = await fetch(`/api/cities/search${queryString ? `?${queryString}` : ''}`);

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`도시 데이터 요청 실패: ${res.status} ${message}`);
  }

  return (await res.json()) as City[];
};

import { getCity } from '@/services/plan';
import { queryOptions } from '@tanstack/react-query';

export const planQueries = {
  city: (cityCode: string) =>
    queryOptions({
      queryKey: ['city', cityCode],
      queryFn: () => getCity(cityCode),
    }),
};

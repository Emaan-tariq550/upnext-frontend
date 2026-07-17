import { useInfiniteQuery } from '@tanstack/react-query';

export function useInfiniteListQuery(key, fetchFn, limit = 12) {
  return useInfiniteQuery({
    queryKey: key,
    queryFn: ({ pageParam = 1 }) => fetchFn({ page: pageParam, limit }),
    getNextPageParam: (lastPage) => (lastPage.meta?.hasNextPage ? lastPage.meta.page + 1 : undefined),
    initialPageParam: 1,
  });
}
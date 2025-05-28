import { getProducts } from '@/services/product.service';
import type { ProductFilter } from '@/types/product';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';

const PRODUCT_KEY = 'products';
const ProductQueryKeys = {
  getProducts: (params?: ProductFilter) => [PRODUCT_KEY, { ...params }],
  getInfiniteProducts: (params?: Omit<ProductFilter, '_page'>) => [
    PRODUCT_KEY,
    'infinite',
    { ...params },
  ],
};

export const useGetProductsQuery = (params?: ProductFilter) =>
  useQuery({
    queryKey: ProductQueryKeys.getProducts(params),
    queryFn: () => getProducts(params),
  });

export const useInfiniteProductsQuery = (params?: Omit<ProductFilter, '_page'>) =>
  useInfiniteQuery({
    queryKey: ProductQueryKeys.getInfiniteProducts(params),
    queryFn: ({ pageParam = 1 }) =>
      getProducts({ ...params, _page: pageParam, _limit: params?._limit || 20 }),
    getNextPageParam: (lastPage: any[], allPages: any[][]) => {
      // If the last page has fewer items than the limit, we've reached the end
      const limit = params?._limit || 20;
      if (lastPage.length < limit) {
        return undefined;
      }
      return allPages.length + 1;
    },
    initialPageParam: 1,
  });

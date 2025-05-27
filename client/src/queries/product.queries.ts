import { getProducts } from '@/services/product.service';
import type { ProductFilter } from '@/types/product';
import { useQuery } from '@tanstack/react-query';

const PRODUCT_KEY = 'products';
const ProductQueryKeys = {
  getProducts: (params?: ProductFilter) => [PRODUCT_KEY, { ...params }],
};

export const useGetProductsQuery = (params?: ProductFilter) =>
  useQuery({
    queryKey: ProductQueryKeys.getProducts(params),
    queryFn: () => getProducts(params),
  });

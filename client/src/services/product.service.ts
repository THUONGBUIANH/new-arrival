import type { Product, ProductFilter } from '@/types/product';
import { get } from './api';

export const getProducts = async (params?: ProductFilter) => {
  const queryString = new URLSearchParams(params as Record<string, string>).toString();
  return get<Product[]>(`/products?${queryString}`);
};

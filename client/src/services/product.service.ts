import type { Product, ProductFilter } from '@/types/product';
import { get } from './api';

export const getProducts = async (params?: ProductFilter) => {
  // Remove null, undefined, and empty string values from params
  const cleanParams = Object.entries(params || {}).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      acc[key] = value;
    }
    return acc;
  }, {} as Record<string, any>);

  const queryString = new URLSearchParams(cleanParams as Record<string, string>).toString();
  
  return get<Product[]>(`/products?${queryString}`);
};

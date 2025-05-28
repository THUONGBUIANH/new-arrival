import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { ProductFilter } from '@/types/product';

interface FilterContextType {
  filters: ProductFilter;
  updateFilters: (newFilters: Partial<ProductFilter>) => void;
  resetFilters: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

const initialFilters: ProductFilter = {
  _limit: 20,
  _sort: 'createdAt',
  _order: 'desc',
  q: null,
  category: null,
  tier: null,
  theme: null,
};

interface FilterProviderProps {
  children: ReactNode;
}

export const FilterProvider = ({ children }: FilterProviderProps) => {
  const [filters, setFilters] = useState<ProductFilter>(initialFilters);
  const [searchQuery, setSearchQuery] = useState('');

  const updateFilters = useCallback((newFilters: Partial<ProductFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setSearchQuery('');
  }, []);

  return (
    <FilterContext.Provider
      value={{
        filters,
        updateFilters,
        resetFilters,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
};

export const useFilterContext = () => {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error('useFilterContext must be used within a FilterProvider');
  }
  return context;
};

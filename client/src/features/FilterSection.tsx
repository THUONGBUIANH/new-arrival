import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Select from './components/Select';
import {
  PRODUCT_CATEGORIES,
  PRODUCT_SORT_OPTIONS,
  PRODUCT_THEMES,
  PRODUCT_TIERS,
} from '@/constants/product';
import { type PropsWithChildren, useEffect } from 'react';
import { useFilterContext } from '@/contexts/FilterContext';
import { useDebounce } from '@/hooks/useDebounce';
import type { ProductSort, Order } from '@/types/product';

type FilterSectionProps = {} & PropsWithChildren;

const FilterSection = ({ children }: FilterSectionProps) => {
  const { filters, updateFilters, resetFilters, searchQuery, setSearchQuery } = useFilterContext();
  
  // Debounce search query to prevent excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Update filters when debounced search query changes
  useEffect(() => {
    // Only update if there's actually a change to prevent duplicate calls
    if (filters.q !== debouncedSearchQuery) {
      updateFilters({ q: debouncedSearchQuery || null });
    }
  }, [debouncedSearchQuery, filters.q, updateFilters]);

  const handleCategoryChange = (category: string) => {
    updateFilters({
      category: category === 'All' ? null : category,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const handleTierChange = (value: string) => {
    updateFilters({ tier: value || null });
  };

  const handleThemeChange = (value: string) => {
    updateFilters({ theme: value || null });
  };

  const handleSortChange = (value: string) => {
    if (value) {
      const [sort, order] = value.split('-') as [ProductSort, Order];
      updateFilters({ _sort: sort, _order: order });
    } else {
      updateFilters({ _sort: null, _order: null });
    }
  };

  const currentSortValue =
    filters._sort && filters._order ? `${filters._sort}-${filters._order}` : '';

  return (
    <div className="w-full bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar - Filters */}
          <div className="lg:w-64 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchQuery !== debouncedSearchQuery && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {/* Sort Options */}
            <div className="space-y-2">
              <label htmlFor="sort-select" className="text-sm font-medium text-gray-700">Sort By</label>
              <Select 
                id="sort-select"
                placeholder="Select sorting" 
                options={PRODUCT_SORT_OPTIONS}
                value={currentSortValue}
                onValueChange={handleSortChange}
              />
            </div>

            {/* Tier */}
            <div className="space-y-2">
              <label htmlFor="tier-select" className="text-sm font-medium text-gray-700">Tier</label>
              <Select 
                id="tier-select"
                placeholder="Select tier" 
                options={PRODUCT_TIERS}
                value={filters.tier || ''}
                onValueChange={handleTierChange}
              />
            </div>

            {/* Theme */}
            <div className="space-y-2">
              <label htmlFor="theme-select" className="text-sm font-medium text-gray-700">Theme</label>
              <Select 
                id="theme-select"
                placeholder="Select theme" 
                options={PRODUCT_THEMES}
                value={filters.theme || ''}
                onValueChange={handleThemeChange}
              />
            </div>

            {/* Reset Filter */}
            <Button variant="outline" className="w-full border-gray-300" onClick={resetFilters}>
              Reset Filter
            </Button>
          </div>

          {/* Right side - Category filters and Products */}
          <div className="flex-1">
            {/* Category Filter Buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              {PRODUCT_CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={
                    (category === 'All' && !filters.category) || category === filters.category
                      ? 'default'
                      : 'outline'
                  }
                  size="sm"
                  className={
                    (category === 'All' && !filters.category) || category === filters.category
                      ? ''
                      : 'border-gray-300 text-gray-600'
                  }
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterSection;

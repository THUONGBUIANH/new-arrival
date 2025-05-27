import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Select from './components/Select';
import {
  PRODUCT_CATEGORIES,
  PRODUCT_PRICE_RANGES,
  PRODUCT_THEMES,
  PRODUCT_TIERS,
} from '@/constants/product';
import { type PropsWithChildren } from 'react';

type FilterSectionProps = {} & PropsWithChildren;

const FilterSection = ({ children }: FilterSectionProps) => {
  return (
    <div className="w-full bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar - Filters */}
          <div className="lg:w-64 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search" className="pl-10 border-gray-300" />
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Price Range</label>
              <div className="h-2 bg-gray-200 rounded">
                <div className="h-2 bg-gray-400 rounded w-1/2"></div>
              </div>
            </div>

            {/* Tier */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tier</label>
              <Select placeholder="Select tier" options={PRODUCT_TIERS} />
            </div>

            {/* Theme */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Theme</label>
              <Select placeholder="Select them" options={PRODUCT_THEMES} />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Price</label>
              <Select placeholder="Select price range" options={PRODUCT_PRICE_RANGES} />
            </div>

            {/* Reset Filter */}
            <Button variant="outline" className="w-full border-gray-300">
              Reset Filter
            </Button>
          </div>

          {/* Right side - Category filters */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-6">
              {PRODUCT_CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={category === 'All' ? 'default' : 'outline'}
                  size="sm"
                  className={category === 'All' ? '' : 'border-gray-300 text-gray-600'}
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

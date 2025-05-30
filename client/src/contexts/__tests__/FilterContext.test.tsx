import { renderHook, act } from '@testing-library/react';
import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { FilterProvider, useFilterContext } from '@/contexts/FilterContext';
import type { ProductFilter } from '@/types/product';

// Test component to verify context integration
const TestComponent = () => {
  const { filters, updateFilters, resetFilters, searchQuery, setSearchQuery } = useFilterContext();

  return (
    <div>
      <div data-testid="current-filters">{JSON.stringify(filters)}</div>
      <div data-testid="current-search">{searchQuery}</div>
      <button 
        data-testid="update-category" 
        onClick={() => updateFilters({ category: 'Art' })}
      >
        Update Category
      </button>
      <button 
        data-testid="reset-filters" 
        onClick={resetFilters}
      >
        Reset Filters
      </button>
      <button 
        data-testid="set-search" 
        onClick={() => setSearchQuery('test query')}
      >
        Set Search
      </button>
    </div>
  );
};

// Wrapper component for testing
const createWrapper = () => {
  return ({ children }: { children: ReactNode }) => (
    <FilterProvider>{children}</FilterProvider>
  );
};

describe('FilterContext', () => {
  describe('FilterProvider', () => {
    describe('Initial State', () => {
      it('provides initial filters state', () => {
        const { result } = renderHook(() => useFilterContext(), {
          wrapper: createWrapper(),
        });

        expect(result.current.filters).toEqual({
          _limit: 20,
          _sort: 'createdAt',
          _order: 'desc',
          q: null,
          category: null,
          tier: null,
          theme: null,
        });
      });

      it('provides initial search query as empty string', () => {
        const { result } = renderHook(() => useFilterContext(), {
          wrapper: createWrapper(),
        });

        expect(result.current.searchQuery).toBe('');
      });

      it('provides all required context methods', () => {
        const { result } = renderHook(() => useFilterContext(), {
          wrapper: createWrapper(),
        });

        expect(typeof result.current.updateFilters).toBe('function');
        expect(typeof result.current.resetFilters).toBe('function');
        expect(typeof result.current.setSearchQuery).toBe('function');
      });
    });

    describe('updateFilters Function', () => {
      it('updates a single filter property', () => {
        const { result } = renderHook(() => useFilterContext(), {
          wrapper: createWrapper(),
        });

        act(() => {
          result.current.updateFilters({ category: 'Music' });
        });

        expect(result.current.filters.category).toBe('Music');
        expect(result.current.filters._limit).toBe(20); // Other properties unchanged
      });

      it('updates multiple filter properties at once', () => {
        const { result } = renderHook(() => useFilterContext(), {
          wrapper: createWrapper(),
        });

        act(() => {
          result.current.updateFilters({ 
            category: 'Art', 
            tier: 'Premium',
            _sort: 'price' 
          });
        });

        expect(result.current.filters.category).toBe('Art');
        expect(result.current.filters.tier).toBe('Premium');
        expect(result.current.filters._sort).toBe('price');
        expect(result.current.filters._order).toBe('desc'); // Unchanged
      });

      it('merges new filters with existing ones', () => {
        const { result } = renderHook(() => useFilterContext(), {
          wrapper: createWrapper(),
        });

        // First update
        act(() => {
          result.current.updateFilters({ category: 'Music' });
        });

        // Second update
        act(() => {
          result.current.updateFilters({ tier: 'Basic' });
        });

        expect(result.current.filters.category).toBe('Music');
        expect(result.current.filters.tier).toBe('Basic');
        expect(result.current.filters._limit).toBe(20);
      });

      it('overwrites existing filter values', () => {
        const { result } = renderHook(() => useFilterContext(), {
          wrapper: createWrapper(),
        });

        // Set initial value
        act(() => {
          result.current.updateFilters({ category: 'Music' });
        });

        // Overwrite with new value
        act(() => {
          result.current.updateFilters({ category: 'Art' });
        });

        expect(result.current.filters.category).toBe('Art');
      });

      it('handles null values correctly', () => {
        const { result } = renderHook(() => useFilterContext(), {
          wrapper: createWrapper(),
        });

        // Set a value first
        act(() => {
          result.current.updateFilters({ category: 'Music' });
        });

        // Reset to null
        act(() => {
          result.current.updateFilters({ category: null });
        });

        expect(result.current.filters.category).toBe(null);
      });

      it('handles empty object updates', () => {
        const { result } = renderHook(() => useFilterContext(), {
          wrapper: createWrapper(),
        });

        const initialFilters = { ...result.current.filters };

        act(() => {
          result.current.updateFilters({});
        });

        expect(result.current.filters).toEqual(initialFilters);
      });
    });

    describe('resetFilters Function', () => {
      it('resets filters to initial state', () => {
        const { result } = renderHook(() => useFilterContext(), {
          wrapper: createWrapper(),
        });

        // Modify filters
        act(() => {
          result.current.updateFilters({ 
            category: 'Art', 
            tier: 'Premium',
            q: 'search term' 
          });
        });

        // Reset
        act(() => {
          result.current.resetFilters();
        });

        expect(result.current.filters).toEqual({
          _limit: 20,
          _sort: 'createdAt',
          _order: 'desc',
          q: null,
          category: null,
          tier: null,
          theme: null,
        });
      });

      it('resets search query to empty string', () => {
        const { result } = renderHook(() => useFilterContext(), {
          wrapper: createWrapper(),
        });

        // Set search query
        act(() => {
          result.current.setSearchQuery('test search');
        });

        // Reset
        act(() => {
          result.current.resetFilters();
        });

        expect(result.current.searchQuery).toBe('');
      });

      it('can be called multiple times safely', () => {
        const { result } = renderHook(() => useFilterContext(), {
          wrapper: createWrapper(),
        });

        // Modify state
        act(() => {
          result.current.updateFilters({ category: 'Music' });
          result.current.setSearchQuery('test');
        });

        // Reset multiple times
        act(() => {
          result.current.resetFilters();
          result.current.resetFilters();
          result.current.resetFilters();
        });

        expect(result.current.filters.category).toBe(null);
        expect(result.current.searchQuery).toBe('');
      });
    });

    describe('Search Query Management', () => {
      it('updates search query', () => {
        const { result } = renderHook(() => useFilterContext(), {
          wrapper: createWrapper(),
        });

        act(() => {
          result.current.setSearchQuery('new search term');
        });

        expect(result.current.searchQuery).toBe('new search term');
      });

      it('handles empty search query', () => {
        const { result } = renderHook(() => useFilterContext(), {
          wrapper: createWrapper(),
        });

        act(() => {
          result.current.setSearchQuery('');
        });

        expect(result.current.searchQuery).toBe('');
      });

      it('handles special characters in search query', () => {
        const { result } = renderHook(() => useFilterContext(), {
          wrapper: createWrapper(),
        });

        const specialQuery = 'test @#$%^&*()_+{}|:"<>?';

        act(() => {
          result.current.setSearchQuery(specialQuery);
        });

        expect(result.current.searchQuery).toBe(specialQuery);
      });

      it('overwrites previous search query', () => {
        const { result } = renderHook(() => useFilterContext(), {
          wrapper: createWrapper(),
        });

        act(() => {
          result.current.setSearchQuery('first query');
        });

        act(() => {
          result.current.setSearchQuery('second query');
        });

        expect(result.current.searchQuery).toBe('second query');
      });

      it('does not affect filters when updating search query', () => {
        const { result } = renderHook(() => useFilterContext(), {
          wrapper: createWrapper(),
        });

        // Set some filters
        act(() => {
          result.current.updateFilters({ category: 'Art', tier: 'Premium' });
        });

        const filtersBeforeSearch = { ...result.current.filters };

        // Update search query
        act(() => {
          result.current.setSearchQuery('test search');
        });

        expect(result.current.filters).toEqual(filtersBeforeSearch);
      });
    });
  });

  describe('useFilterContext Hook', () => {
    describe('Error Handling', () => {
      it('throws error when used outside provider', () => {
        // Capture console.error to prevent test noise
        const originalError = console.error;
        console.error = jest.fn();

        expect(() => {
          renderHook(() => useFilterContext());
        }).toThrow('useFilterContext must be used within a FilterProvider');

        console.error = originalError;
      });

      it('provides context when used within provider', () => {
        const { result } = renderHook(() => useFilterContext(), {
          wrapper: createWrapper(),
        });

        expect(result.current).toBeDefined();
        expect(result.current.filters).toBeDefined();
        expect(result.current.updateFilters).toBeDefined();
        expect(result.current.resetFilters).toBeDefined();
        expect(result.current.searchQuery).toBeDefined();
        expect(result.current.setSearchQuery).toBeDefined();
      });
    });

    describe('Context Value Stability', () => {
      it('updateFilters function reference remains stable', () => {
        const { result, rerender } = renderHook(() => useFilterContext(), {
          wrapper: createWrapper(),
        });

        const firstUpdateFilters = result.current.updateFilters;

        // Trigger re-render
        rerender();

        expect(result.current.updateFilters).toBe(firstUpdateFilters);
      });

      it('resetFilters function reference remains stable', () => {
        const { result, rerender } = renderHook(() => useFilterContext(), {
          wrapper: createWrapper(),
        });

        const firstResetFilters = result.current.resetFilters;

        // Trigger re-render
        rerender();

        expect(result.current.resetFilters).toBe(firstResetFilters);
      });
    });
  });

  describe('Component Integration', () => {
    it('works correctly with React components', () => {
      render(
        <FilterProvider>
          <TestComponent />
        </FilterProvider>
      );

      expect(screen.getByTestId('current-search')).toHaveTextContent('');
      
      // Check initial filters
      const filtersElement = screen.getByTestId('current-filters');
      const initialFilters = JSON.parse(filtersElement.textContent || '{}');
      expect(initialFilters.category).toBe(null);
      expect(initialFilters._limit).toBe(20);
    });

    it('updates filters through component interactions', async () => {
      render(
        <FilterProvider>
          <TestComponent />
        </FilterProvider>
      );

      // Click update category button
      const updateButton = screen.getByTestId('update-category');
      
      await act(async () => {
        updateButton.click();
      });

      // Check that filters were updated
      const filtersElement = screen.getByTestId('current-filters');
      const updatedFilters = JSON.parse(filtersElement.textContent || '{}');
      expect(updatedFilters.category).toBe('Art');
    });

    it('resets filters through component interactions', async () => {
      render(
        <FilterProvider>
          <TestComponent />
        </FilterProvider>
      );

      // Update category first
      await act(async () => {
        screen.getByTestId('update-category').click();
      });
      
      await act(async () => {
        screen.getByTestId('set-search').click();
      });

      // Reset
      await act(async () => {
        screen.getByTestId('reset-filters').click();
      });

      // Check reset state
      const filtersElement = screen.getByTestId('current-filters');
      const resetFilters = JSON.parse(filtersElement.textContent || '{}');
      expect(resetFilters.category).toBe(null);
      expect(screen.getByTestId('current-search')).toHaveTextContent('');
    });

    it('updates search query through component interactions', async () => {
      render(
        <FilterProvider>
          <TestComponent />
        </FilterProvider>
      );

      // Set search query
      await act(async () => {
        screen.getByTestId('set-search').click();
      });

      expect(screen.getByTestId('current-search')).toHaveTextContent('test query');
    });
  });

  describe('Type Safety', () => {
    it('accepts valid ProductFilter properties', () => {
      const { result } = renderHook(() => useFilterContext(), {
        wrapper: createWrapper(),
      });

      const validUpdate: Partial<ProductFilter> = {
        category: 'Music',
        tier: 'Premium',
        theme: 'Abstract',
        q: 'search term',
        _sort: 'price',
        _order: 'asc',
        _limit: 50,
        _page: 2,
      };

      act(() => {
        result.current.updateFilters(validUpdate);
      });

      expect(result.current.filters.category).toBe('Music');
      expect(result.current.filters.tier).toBe('Premium');
      expect(result.current.filters.theme).toBe('Abstract');
      expect(result.current.filters.q).toBe('search term');
      expect(result.current.filters._sort).toBe('price');
      expect(result.current.filters._order).toBe('asc');
      expect(result.current.filters._limit).toBe(50);
      expect(result.current.filters._page).toBe(2);
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid successive updates', () => {
      const { result } = renderHook(() => useFilterContext(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.updateFilters({ category: 'Art' });
        result.current.updateFilters({ tier: 'Premium' });
        result.current.updateFilters({ theme: 'Modern' });
        result.current.setSearchQuery('rapid updates');
      });

      expect(result.current.filters.category).toBe('Art');
      expect(result.current.filters.tier).toBe('Premium');
      expect(result.current.filters.theme).toBe('Modern');
      expect(result.current.searchQuery).toBe('rapid updates');
    });

    it('maintains state consistency after multiple operations', () => {
      const { result } = renderHook(() => useFilterContext(), {
        wrapper: createWrapper(),
      });

      // Perform various operations
      act(() => {
        result.current.updateFilters({ category: 'Music', tier: 'Basic' });
        result.current.setSearchQuery('test');
        result.current.updateFilters({ theme: 'Abstract' });
        result.current.resetFilters();
        result.current.updateFilters({ category: 'Art' });
      });

      expect(result.current.filters.category).toBe('Art');
      expect(result.current.filters.tier).toBe(null);
      expect(result.current.filters.theme).toBe(null);
      expect(result.current.searchQuery).toBe('');
    });

    it('handles undefined values in partial updates', () => {
      const { result } = renderHook(() => useFilterContext(), {
        wrapper: createWrapper(),
      });

      act(() => {
        result.current.updateFilters({ 
          category: 'Music',
          tier: undefined as any // Simulating undefined value
        });
      });

      expect(result.current.filters.category).toBe('Music');
      expect(result.current.filters.tier).toBeUndefined();
    });
  });
}); 
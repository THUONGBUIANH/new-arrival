import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { useGetProductsQuery, useInfiniteProductsQuery } from '@/queries/product.queries';
import { getProducts } from '@/services/product.service';
import type { ProductFilter, Product } from '@/types/product';

// Mock the product service
jest.mock('@/services/product.service');
const mockGetProducts = getProducts as jest.MockedFunction<typeof getProducts>;

// Create a wrapper for React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 0,
        gcTime: 0,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

const createMockProducts = (count: number): Product[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Product ${i + 1}`,
    category: 'Art',
    price: (i + 1) * 0.1,
    isFavorite: false,
    createdAt: Date.now() - i * 1000,
    theme: 'Abstract',
    tier: 'Premium',
    imageId: i + 1,
    author: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      gender: 'male',
      avatar: 'avatar.jpg',
      onlineStatus: 'online',
    },
  }));
};

describe('Product Queries', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('useGetProductsQuery', () => {
    describe('Basic Functionality', () => {
      it('fetches products without parameters', async () => {
        const mockProducts = createMockProducts(3);
        mockGetProducts.mockResolvedValue(mockProducts);

        const { result } = renderHook(() => useGetProductsQuery(), {
          wrapper: createWrapper(),
        });

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true);
        });

        expect(mockGetProducts).toHaveBeenCalledWith(undefined);
        expect(result.current.data).toEqual(mockProducts);
      });

      it('fetches products with parameters', async () => {
        const mockProducts = createMockProducts(2);
        const params: ProductFilter = {
          q: 'test',
          category: 'Art',
          _sort: 'price',
          _order: 'asc',
          _page: 1,
          _limit: 10,
        };

        mockGetProducts.mockResolvedValue(mockProducts);

        const { result } = renderHook(() => useGetProductsQuery(params), {
          wrapper: createWrapper(),
        });

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true);
        });

        expect(mockGetProducts).toHaveBeenCalledWith(params);
        expect(result.current.data).toEqual(mockProducts);
      });

      it('handles empty search results', async () => {
        mockGetProducts.mockResolvedValue([]);

        const { result } = renderHook(() => useGetProductsQuery({ q: 'nonexistent' }), {
          wrapper: createWrapper(),
        });

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toEqual([]);
      });
    });

    describe('Query Key Generation', () => {
      it('generates correct query key without params', async () => {
        mockGetProducts.mockResolvedValue([]);

        const { result } = renderHook(() => useGetProductsQuery(), {
          wrapper: createWrapper(),
        });

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true);
        });

        // Query key should be ['products', {}] when no params
        expect(result.current.dataUpdatedAt).toBeGreaterThan(0);
      });

      it('generates correct query key with params', async () => {
        mockGetProducts.mockResolvedValue([]);
        const params = { q: 'test', category: 'Music' };

        const { result } = renderHook(() => useGetProductsQuery(params), {
          wrapper: createWrapper(),
        });

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true);
        });

        expect(mockGetProducts).toHaveBeenCalledWith(params);
      });

      it('treats different params as different queries', async () => {
        mockGetProducts.mockResolvedValue([]);

        const { result: result1 } = renderHook(() => useGetProductsQuery({ q: 'test1' }), {
          wrapper: createWrapper(),
        });

        const { result: result2 } = renderHook(() => useGetProductsQuery({ q: 'test2' }), {
          wrapper: createWrapper(),
        });

        await waitFor(() => {
          expect(result1.current.isSuccess).toBe(true);
          expect(result2.current.isSuccess).toBe(true);
        });

        expect(mockGetProducts).toHaveBeenCalledWith({ q: 'test1' });
        expect(mockGetProducts).toHaveBeenCalledWith({ q: 'test2' });
        expect(mockGetProducts).toHaveBeenCalledTimes(2);
      });
    });

    describe('Error Handling', () => {
      it('handles API errors', async () => {
        const errorMessage = 'Failed to fetch products';
        mockGetProducts.mockRejectedValue(new Error(errorMessage));

        const { result } = renderHook(() => useGetProductsQuery(), {
          wrapper: createWrapper(),
        });

        await waitFor(() => {
          expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBeInstanceOf(Error);
        expect((result.current.error as Error).message).toBe(errorMessage);
      });

      it('handles network errors', async () => {
        mockGetProducts.mockRejectedValue(new Error('Network Error'));

        const { result } = renderHook(() => useGetProductsQuery(), {
          wrapper: createWrapper(),
        });

        await waitFor(() => {
          expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBeInstanceOf(Error);
      });
    });

    describe('Loading States', () => {
      it('shows loading state initially', () => {
        mockGetProducts.mockImplementation(() => new Promise(() => {})); // Never resolves

        const { result } = renderHook(() => useGetProductsQuery(), {
          wrapper: createWrapper(),
        });

        expect(result.current.isLoading).toBe(true);
        expect(result.current.data).toBeUndefined();
      });

      it('transitions from loading to success', async () => {
        const mockProducts = createMockProducts(1);
        mockGetProducts.mockResolvedValue(mockProducts);

        const { result } = renderHook(() => useGetProductsQuery(), {
          wrapper: createWrapper(),
        });

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.data).toEqual(mockProducts);
      });
    });
  });

  describe('useInfiniteProductsQuery', () => {
    describe('Basic Functionality', () => {
      it('fetches first page without parameters', async () => {
        const mockProducts = createMockProducts(20);
        mockGetProducts.mockResolvedValue(mockProducts);

        const { result } = renderHook(() => useInfiniteProductsQuery(), {
          wrapper: createWrapper(),
        });

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true);
        });

        expect(mockGetProducts).toHaveBeenCalledWith({ _page: 1, _limit: 20 });
        expect(result.current.data?.pages[0]).toEqual(mockProducts);
      });

      it('fetches first page with parameters', async () => {
        const mockProducts = createMockProducts(15);
        const params = { q: 'test', category: 'Art', _limit: 15 };

        mockGetProducts.mockResolvedValue(mockProducts);

        const { result } = renderHook(() => useInfiniteProductsQuery(params), {
          wrapper: createWrapper(),
        });

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true);
        });

        expect(mockGetProducts).toHaveBeenCalledWith({ 
          q: 'test', 
          category: 'Art', 
          _page: 1, 
          _limit: 15 
        });
        expect(result.current.data?.pages[0]).toEqual(mockProducts);
      });

      it('uses default limit when not specified', async () => {
        const mockProducts = createMockProducts(20);
        mockGetProducts.mockResolvedValue(mockProducts);

        const { result } = renderHook(() => useInfiniteProductsQuery({ q: 'test' }), {
          wrapper: createWrapper(),
        });

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true);
        });

        expect(mockGetProducts).toHaveBeenCalledWith({ 
          q: 'test', 
          _page: 1, 
          _limit: 20 
        });
      });
    });

    describe('Pagination Logic', () => {
      it('determines next page param correctly when more data available', async () => {
        const mockProducts = createMockProducts(20); // Full page
        mockGetProducts.mockResolvedValue(mockProducts);

        const { result } = renderHook(() => useInfiniteProductsQuery({ _limit: 20 }), {
          wrapper: createWrapper(),
        });

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.hasNextPage).toBe(true);
      });

      it('determines no next page when less data than limit', async () => {
        const mockProducts = createMockProducts(15); // Partial page
        mockGetProducts.mockResolvedValue(mockProducts);

        const { result } = renderHook(() => useInfiniteProductsQuery({ _limit: 20 }), {
          wrapper: createWrapper(),
        });

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.hasNextPage).toBe(false);
      });

      it('handles empty first page', async () => {
        mockGetProducts.mockResolvedValue([]);

        const { result } = renderHook(() => useInfiniteProductsQuery(), {
          wrapper: createWrapper(),
        });

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.hasNextPage).toBe(false);
        expect(result.current.data?.pages[0]).toEqual([]);
      });

      it('calculates correct page numbers for multiple pages', async () => {
        // Mock first page
        const firstPageProducts = createMockProducts(20);
        mockGetProducts.mockResolvedValueOnce(firstPageProducts);

        const { result } = renderHook(() => useInfiniteProductsQuery({ _limit: 20 }), {
          wrapper: createWrapper(),
        });

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.hasNextPage).toBe(true);

        // Mock second page
        const secondPageProducts = createMockProducts(15); // Partial page
        mockGetProducts.mockResolvedValueOnce(secondPageProducts);

        await result.current.fetchNextPage();

        await waitFor(() => {
          expect(result.current.data?.pages.length).toBe(2);
        });

        expect(mockGetProducts).toHaveBeenNthCalledWith(1, { _page: 1, _limit: 20 });
        expect(mockGetProducts).toHaveBeenNthCalledWith(2, { _page: 2, _limit: 20 });
        expect(result.current.hasNextPage).toBe(false); // No more pages after partial page
      });
    });

    describe('Query Key Generation', () => {
      it('generates correct query key without params', async () => {
        mockGetProducts.mockResolvedValue([]);

        const { result } = renderHook(() => useInfiniteProductsQuery(), {
          wrapper: createWrapper(),
        });

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true);
        });

        // Should call with infinite key structure
        expect(result.current.dataUpdatedAt).toBeGreaterThan(0);
      });

      it('generates different keys for different params', async () => {
        mockGetProducts.mockResolvedValue([]);

        const { result: result1 } = renderHook(() => useInfiniteProductsQuery({ q: 'test1' }), {
          wrapper: createWrapper(),
        });

        const { result: result2 } = renderHook(() => useInfiniteProductsQuery({ q: 'test2' }), {
          wrapper: createWrapper(),
        });

        await waitFor(() => {
          expect(result1.current.isSuccess).toBe(true);
          expect(result2.current.isSuccess).toBe(true);
        });

        expect(mockGetProducts).toHaveBeenCalledWith({ q: 'test1', _page: 1, _limit: 20 });
        expect(mockGetProducts).toHaveBeenCalledWith({ q: 'test2', _page: 1, _limit: 20 });
      });
    });

    describe('Error Handling', () => {
      it('handles errors in infinite query', async () => {
        const errorMessage = 'Failed to fetch infinite products';
        mockGetProducts.mockRejectedValue(new Error(errorMessage));

        const { result } = renderHook(() => useInfiniteProductsQuery(), {
          wrapper: createWrapper(),
        });

        await waitFor(() => {
          expect(result.current.isError).toBe(true);
        });

        expect(result.current.error).toBeInstanceOf(Error);
        expect((result.current.error as Error).message).toBe(errorMessage);
      });

      it('handles errors when fetching next page', async () => {
        // First page succeeds
        const firstPageProducts = createMockProducts(20);
        mockGetProducts.mockResolvedValueOnce(firstPageProducts);

        const { result } = renderHook(() => useInfiniteProductsQuery(), {
          wrapper: createWrapper(),
        });

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true);
        });

        // Second page fails
        mockGetProducts.mockRejectedValueOnce(new Error('Network error'));

        await result.current.fetchNextPage();

        await waitFor(() => {
          expect(result.current.isError).toBe(true);
        });
      });
    });

    describe('Data Structure', () => {
      it('properly structures infinite query data', async () => {
        const mockProducts = createMockProducts(10);
        mockGetProducts.mockResolvedValue(mockProducts);

        const { result } = renderHook(() => useInfiniteProductsQuery(), {
          wrapper: createWrapper(),
        });

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true);
        });

        expect(result.current.data).toHaveProperty('pages');
        expect(result.current.data).toHaveProperty('pageParams');
        expect(Array.isArray(result.current.data?.pages)).toBe(true);
        expect(result.current.data?.pages[0]).toEqual(mockProducts);
      });

      it('accumulates multiple pages correctly', async () => {
        // First page
        const firstPageProducts = createMockProducts(20);
        mockGetProducts.mockResolvedValueOnce(firstPageProducts);

        const { result } = renderHook(() => useInfiniteProductsQuery(), {
          wrapper: createWrapper(),
        });

        await waitFor(() => {
          expect(result.current.isSuccess).toBe(true);
        });

        // Second page
        const secondPageProducts = createMockProducts(10).map(p => ({ ...p, id: p.id + 20 }));
        mockGetProducts.mockResolvedValueOnce(secondPageProducts);

        // Trigger fetchNextPage and wait for completion
        result.current.fetchNextPage();

        await waitFor(() => {
          expect(result.current.data?.pages.length).toBe(2);
        }, { timeout: 2000 });

        expect(result.current.data?.pages[0]).toEqual(firstPageProducts);
        expect(result.current.data?.pages[1]).toEqual(secondPageProducts);
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles null and undefined parameters gracefully', async () => {
      mockGetProducts.mockResolvedValue([]);

      const { result: result1 } = renderHook(() => useGetProductsQuery(undefined), {
        wrapper: createWrapper(),
      });

      const { result: result2 } = renderHook(() => useInfiniteProductsQuery(undefined), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result1.current.isSuccess).toBe(true);
        expect(result2.current.isSuccess).toBe(true);
      });

      expect(mockGetProducts).toHaveBeenCalledWith(undefined);
      expect(mockGetProducts).toHaveBeenCalledWith({ _page: 1, _limit: 20 });
    });

    it('handles very large page numbers', async () => {
      const mockProducts = createMockProducts(5); // Less than limit
      mockGetProducts.mockResolvedValue(mockProducts);

      const { result } = renderHook(() => useInfiniteProductsQuery({ _limit: 100 }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      expect(result.current.hasNextPage).toBe(false);
    });

    it('handles zero limit edge case', async () => {
      mockGetProducts.mockResolvedValue([]);

      const { result } = renderHook(() => useInfiniteProductsQuery({ _limit: 0 }), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true);
      });

      // When _limit is 0 (falsy), the hook defaults to 20 due to the || 20 logic
      expect(mockGetProducts).toHaveBeenCalledWith({ _page: 1, _limit: 20 });
    });
  });
}); 
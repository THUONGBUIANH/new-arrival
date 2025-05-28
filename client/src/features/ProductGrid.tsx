import { useMemo, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInfiniteProductsQuery } from '@/queries/product.queries';
import { useFilterContext } from '@/contexts/FilterContext';
import type { Product } from '@/types/product';
import VirtualGrid from './components/VirtualGrid';

const ProductGrid = () => {
  const { filters } = useFilterContext();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch,
  } = useInfiniteProductsQuery(filters);

  // Flatten all pages into a single array
  const allProducts = useMemo(() => {
    return data?.pages.flatMap((page: Product[]) => page) || [];
  }, [data]);

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 mb-4">
          Error loading products: {error?.message || 'Unknown error'}
        </div>
        <Button onClick={() => refetch()} variant="default">
          Try Again
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-6 h-6 animate-spin" />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  if (allProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Product Grid - Use virtual list for performance when many products */}
      <VirtualGrid products={allProducts} />
      {/* Load More Button */}
      {hasNextPage && (
        <div className="text-center">
          <Button
            variant="outline"
            className="px-8 border-gray-300"
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Loading...
              </>
            ) : (
              'View More'
            )}
          </Button>
        </div>
      )}

      {/* Results summary */}
      {allProducts.length > 0 && (
        <div className="text-center py-4 text-sm text-gray-500">
          Showing {allProducts.length} products (using virtual scrolling for performance)
        </div>
      )}
    </div>
  );
};

export default ProductGrid;

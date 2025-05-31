import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import ProductGrid from '@/features/ProductGrid';
import { FilterProvider } from '@/contexts/FilterContext';
import type { Product } from '@/types/product';
import { useInfiniteProductsQuery } from '@/queries/product.queries';

// Mock the infinite products query
jest.mock('@/queries/product.queries');
const useInfiniteProductsQueryMock = useInfiniteProductsQuery as jest.MockedFunction<any>;

// Mock the VirtualGrid component
jest.mock('@/features/components/VirtualGrid', () => {
  return function MockVirtualGrid({ products }: { products: Product[] }) {
    return (
      <div data-testid="virtual-grid">
        {products.map((product) => (
          <div key={product.id} data-testid={`product-${product.id}`}>
            {product.title}
          </div>
        ))}
      </div>
    );
  };
});

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}));

// Mock lucide-react icons
jest.mock('lucide-react', () => ({
  Loader2: ({ className }: { className?: string }) => (
    <div data-testid="loader-icon" className={className}>
      Loading...
    </div>
  ),
}));

const createMockProduct = (id: number): Product => ({
  id,
  title: `Product ${id}`,
  category: 'Art',
  price: 1.5,
  isFavorite: false,
  createdAt: Date.now(),
  theme: 'Abstract',
  tier: 'Premium',
  imageId: id,
  author: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    gender: 'male',
    avatar: 'avatar.jpg',
    onlineStatus: 'online',
  },
});

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
    <QueryClientProvider client={queryClient}>
      <FilterProvider>{children}</FilterProvider>
    </QueryClientProvider>
  );
};

describe('ProductGrid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('displays loading state correctly', () => {
        useInfiniteProductsQueryMock.mockReturnValue({
        data: undefined,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        isLoading: true,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<ProductGrid />, { wrapper: createWrapper() });

      expect(screen.getByTestId('loader-icon')).toBeInTheDocument();
      expect(screen.getByText('Loading products...')).toBeInTheDocument();
    });

    it('does not show grid or buttons during loading', () => {
      useInfiniteProductsQueryMock.mockReturnValue({
        data: undefined,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        isLoading: true,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<ProductGrid />, { wrapper: createWrapper() });

      expect(screen.queryByTestId('virtual-grid')).not.toBeInTheDocument();
      expect(screen.queryByText('View More')).not.toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('displays error message with retry button', () => {
      const mockRefetch = jest.fn();
      const errorMessage = 'Failed to load products';

      useInfiniteProductsQueryMock.mockReturnValue({
        data: undefined,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        isLoading: false,
        isError: true,
        error: { message: errorMessage },
        refetch: mockRefetch,
      });

      render(<ProductGrid />, { wrapper: createWrapper() });

      expect(screen.getByText(`Error loading products: ${errorMessage}`)).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('calls refetch when retry button is clicked', () => {
      const mockRefetch = jest.fn();

      useInfiniteProductsQueryMock.mockReturnValue({
        data: undefined,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        isLoading: false,
        isError: true,
        error: { message: 'Error' },
        refetch: mockRefetch,
      });

      render(<ProductGrid />, { wrapper: createWrapper() });

      fireEvent.click(screen.getByText('Try Again'));
      expect(mockRefetch).toHaveBeenCalledTimes(1);
    });

    it('displays fallback error message when error has no message', () => {
      useInfiniteProductsQueryMock.mockReturnValue({
        data: undefined,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        isLoading: false,
        isError: true,
        error: {},
        refetch: jest.fn(),
      });

      render(<ProductGrid />, { wrapper: createWrapper() });

      expect(screen.getByText('Error loading products: Unknown error')).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('displays empty state message when no products', () => {
      useInfiniteProductsQueryMock.mockReturnValue({
        data: { pages: [[]] },
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<ProductGrid />, { wrapper: createWrapper() });

      expect(screen.getByText('No products found matching your criteria.')).toBeInTheDocument();
      expect(screen.queryByTestId('virtual-grid')).not.toBeInTheDocument();
    });

    it('does not show load more button in empty state', () => {
      useInfiniteProductsQueryMock.mockReturnValue({
        data: { pages: [[]] },
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<ProductGrid />, { wrapper: createWrapper() });

      expect(screen.queryByText('View More')).not.toBeInTheDocument();
    });
  });

  describe('Success State with Products', () => {
    it('renders products using VirtualGrid', () => {
      const mockProducts = [createMockProduct(1), createMockProduct(2)];

      useInfiniteProductsQueryMock.mockReturnValue({
        data: { pages: [mockProducts] },
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<ProductGrid />, { wrapper: createWrapper() });

      expect(screen.getByTestId('virtual-grid')).toBeInTheDocument();
      expect(screen.getByTestId('product-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-2')).toBeInTheDocument();
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
    });

    it('displays results summary', () => {
      const mockProducts = [createMockProduct(1), createMockProduct(2), createMockProduct(3)];

      useInfiniteProductsQueryMock.mockReturnValue({
        data: { pages: [mockProducts] },
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<ProductGrid />, { wrapper: createWrapper() });

      expect(screen.getByText('Showing 3 products (using virtual scrolling for performance)')).toBeInTheDocument();
    });

    it('flattens multiple pages correctly', () => {
      const page1Products = [createMockProduct(1), createMockProduct(2)];
      const page2Products = [createMockProduct(3), createMockProduct(4)];

      useInfiniteProductsQueryMock.mockReturnValue({
        data: { pages: [page1Products, page2Products] },
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<ProductGrid />, { wrapper: createWrapper() });

      expect(screen.getByTestId('product-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-2')).toBeInTheDocument();
      expect(screen.getByTestId('product-3')).toBeInTheDocument();
      expect(screen.getByTestId('product-4')).toBeInTheDocument();
      expect(screen.getByText('Showing 4 products (using virtual scrolling for performance)')).toBeInTheDocument();
    });
  });

  describe('Load More Functionality', () => {
    it('shows load more button when hasNextPage is true', () => {
      const mockProducts = [createMockProduct(1), createMockProduct(2)];

      useInfiniteProductsQueryMock.mockReturnValue({
        data: { pages: [mockProducts] },
        fetchNextPage: jest.fn(),
        hasNextPage: true,
        isFetchingNextPage: false,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<ProductGrid />, { wrapper: createWrapper() });

      expect(screen.getByText('View More')).toBeInTheDocument();
    });

    it('does not show load more button when hasNextPage is false', () => {
      const mockProducts = [createMockProduct(1), createMockProduct(2)];

      useInfiniteProductsQueryMock.mockReturnValue({
        data: { pages: [mockProducts] },
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<ProductGrid />, { wrapper: createWrapper() });

      expect(screen.queryByText('View More')).not.toBeInTheDocument();
    });

    it('calls fetchNextPage when load more button is clicked', () => {
      const mockFetchNextPage = jest.fn();
      const mockProducts = [createMockProduct(1)];

      useInfiniteProductsQueryMock.mockReturnValue({
        data: { pages: [mockProducts] },
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: false,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<ProductGrid />, { wrapper: createWrapper() });

      fireEvent.click(screen.getByText('View More'));
      expect(mockFetchNextPage).toHaveBeenCalledTimes(1);
    });

    it('shows loading state in button when fetching next page', () => {
      const mockProducts = [createMockProduct(1)];

      useInfiniteProductsQueryMock.mockReturnValue({
        data: { pages: [mockProducts] },
        fetchNextPage: jest.fn(),
        hasNextPage: true,
        isFetchingNextPage: true,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<ProductGrid />, { wrapper: createWrapper() });

      // Check for the button with loading text specifically
      const button = screen.getByRole('button');
      expect(button).toHaveTextContent('Loading...');
      expect(screen.getAllByTestId('loader-icon')).toHaveLength(1);
    });

    it('disables button when fetching next page', () => {
      const mockProducts = [createMockProduct(1)];

      useInfiniteProductsQueryMock.mockReturnValue({
        data: { pages: [mockProducts] },
        fetchNextPage: jest.fn(),
        hasNextPage: true,
        isFetchingNextPage: true,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<ProductGrid />, { wrapper: createWrapper() });

      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
    });

    it('does not call fetchNextPage when already fetching', () => {
      const mockFetchNextPage = jest.fn();
      const mockProducts = [createMockProduct(1)];

      useInfiniteProductsQueryMock.mockReturnValue({
        data: { pages: [mockProducts] },
        fetchNextPage: mockFetchNextPage,
        hasNextPage: true,
        isFetchingNextPage: true,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<ProductGrid />, { wrapper: createWrapper() });

      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      // Button is disabled, so click should not trigger fetchNextPage
      expect(mockFetchNextPage).not.toHaveBeenCalled();
    });

    it('does not call fetchNextPage when no next page available', () => {
      const mockFetchNextPage = jest.fn();
      const mockProducts = [createMockProduct(1)];

      useInfiniteProductsQueryMock.mockReturnValue({
        data: { pages: [mockProducts] },
        fetchNextPage: mockFetchNextPage,
        hasNextPage: false,
        isFetchingNextPage: false,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<ProductGrid />, { wrapper: createWrapper() });

      // No load more button should be present
      expect(screen.queryByText('View More')).not.toBeInTheDocument();
      expect(mockFetchNextPage).not.toHaveBeenCalled();
    });
  });

  describe('Integration with FilterContext', () => {
    it('passes filters from context to query', () => {
      const mockProducts = [createMockProduct(1)];

      useInfiniteProductsQueryMock.mockReturnValue({
        data: { pages: [mockProducts] },
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<ProductGrid />, { wrapper: createWrapper() });

      // Check that useInfiniteProductsQueryMock was called with filters from context
      expect(useInfiniteProductsQueryMock).toHaveBeenCalledWith({
        _limit: 20,
        _sort: 'createdAt',
        _order: 'desc',
        q: null,
        category: null,
        tier: null,
        theme: null,
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles undefined data gracefully', () => {
      useInfiniteProductsQueryMock.mockReturnValue({
        data: undefined,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<ProductGrid />, { wrapper: createWrapper() });

      expect(screen.getByText('No products found matching your criteria.')).toBeInTheDocument();
    });

    it('handles empty pages array', () => {
      useInfiniteProductsQueryMock.mockReturnValue({
        data: { pages: [] },
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<ProductGrid />, { wrapper: createWrapper() });

      expect(screen.getByText('No products found matching your criteria.')).toBeInTheDocument();
    });

    it('handles null error object', () => {
      useInfiniteProductsQueryMock.mockReturnValue({
        data: undefined,
        fetchNextPage: jest.fn(),
        hasNextPage: false,
        isFetchingNextPage: false,
        isLoading: false,
        isError: true,
        error: null,
        refetch: jest.fn(),
      });

      render(<ProductGrid />, { wrapper: createWrapper() });

      expect(screen.getByText('Error loading products: Unknown error')).toBeInTheDocument();
    });
  });
}); 
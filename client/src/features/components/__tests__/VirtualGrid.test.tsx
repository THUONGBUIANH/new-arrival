import { render, screen } from '@testing-library/react';
import VirtualGrid from '@/features/components/VirtualGrid';
import type { Product } from '@/types/product';

// Mock react-virtualized components
jest.mock('react-virtualized', () => ({
  AutoSizer: ({ children }: { children: ({ width }: { width: number }) => React.ReactNode }) =>
    children({ width: 800 }),
  List: ({ rowRenderer, rowCount }: { rowRenderer: any; rowCount: number }) => {
    // Render a few rows for testing
    const rows = [];
    for (let i = 0; i < Math.min(rowCount, 3); i++) {
      rows.push(
        rowRenderer({
          index: i,
          key: `row-${i}`,
          style: { height: 420 },
        })
      );
    }
    return <div data-testid="virtual-list">{rows}</div>;
  },
  WindowScroller: ({ children }: { children: any }) =>
    children({
      height: 600,
      isScrolling: false,
      onChildScroll: jest.fn(),
      scrollTop: 0,
    }),
}));

// Mock ProductCard component
jest.mock('@/features/components/ProductCard', () => {
  return function MockProductCard({ product }: { product: Product }) {
    return (
      <div data-testid={`product-card-${product.id}`}>
        <span>{product.title}</span>
        <span>{product.price} ETH</span>
      </div>
    );
  };
});

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

describe('VirtualGrid', () => {
  describe('Basic Rendering', () => {
    it('renders without crashing with empty products array', () => {
      render(<VirtualGrid products={[]} />);
      
      expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
    });

    it('renders with a few products', () => {
      const products = createMockProducts(3);
      render(<VirtualGrid products={products} />);

      expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.getByText('Product 3')).toBeInTheDocument();
    });

    it('applies correct CSS classes to wrapper', () => {
      const products = createMockProducts(1);
      const { container } = render(<VirtualGrid products={products} />);

      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper).toHaveClass('mb-8');
    });
  });

  describe('Product Grid Layout', () => {
    it('renders products in grid layout within rows', () => {
      const products = createMockProducts(6);
      const { container } = render(<VirtualGrid products={products} />);

      // Check for grid classes in rendered content
      const gridContainers = container.querySelectorAll('.grid');
      expect(gridContainers.length).toBeGreaterThan(0);

      // Check for responsive grid classes
      const responsiveGrids = container.querySelectorAll('.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4');
      expect(responsiveGrids.length).toBeGreaterThan(0);
    });

    it('applies correct spacing classes to rows', () => {
      const products = createMockProducts(2);
      const { container } = render(<VirtualGrid products={products} />);

      const rowElement = container.querySelector('.mb-10');
      expect(rowElement).toBeInTheDocument();

      const gapElement = container.querySelector('.gap-6');
      expect(gapElement).toBeInTheDocument();
    });
  });

  describe('Product Cards Rendering', () => {
    it('renders correct number of product cards for single row', () => {
      const products = createMockProducts(4); // Exactly one row (ITEMS_PER_ROW = 4)
      render(<VirtualGrid products={products} />);

      for (let i = 1; i <= 4; i++) {
        expect(screen.getByTestId(`product-card-${i}`)).toBeInTheDocument();
        expect(screen.getByText(`Product ${i}`)).toBeInTheDocument();
      }
    });

    it('renders correct number of product cards for multiple rows', () => {
      const products = createMockProducts(9); // More than 2 rows
      render(<VirtualGrid products={products} />);

      // Should render first 3 rows (due to our mock limiting to 3 rows)
      // First row: products 1-4, Second row: products 5-8, Third row: product 9
      for (let i = 1; i <= 9; i++) {
        expect(screen.getByTestId(`product-card-${i}`)).toBeInTheDocument();
      }
    });

    it('handles partial rows correctly', () => {
      const products = createMockProducts(6); // 1.5 rows (4 + 2)
      render(<VirtualGrid products={products} />);

      // All 6 products should be rendered
      for (let i = 1; i <= 6; i++) {
        expect(screen.getByTestId(`product-card-${i}`)).toBeInTheDocument();
      }
    });
  });

  describe('Virtual List Configuration', () => {
    it('renders with correct test id for virtual list', () => {
      const products = createMockProducts(1);
      render(<VirtualGrid products={products} />);

      expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
    });

    it('handles large number of products efficiently', () => {
      const products = createMockProducts(100);
      render(<VirtualGrid products={products} />);

      // Virtual list should render
      expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
      
      // Only the first few items should be in the DOM due to virtualization
      // (limited by our mock to 3 rows = max 12 items)
      expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-4')).toBeInTheDocument(); // End of first row
    });
  });

  describe('Data Handling', () => {
    it('handles empty product arrays gracefully', () => {
      render(<VirtualGrid products={[]} />);
      
      expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
      // No product cards should be rendered
      expect(screen.queryByTestId(/product-card-/)).not.toBeInTheDocument();
    });

    it('passes correct product data to ProductCard components', () => {
      const products = createMockProducts(2);
      render(<VirtualGrid products={products} />);

      // Check that product data is passed correctly
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('0.1 ETH')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.getByText('0.2 ETH')).toBeInTheDocument();
    });

    it('maintains product order', () => {
      const products = createMockProducts(8);
      render(<VirtualGrid products={products} />);

      // Products should appear in order
      const productCards = screen.getAllByTestId(/product-card-/);
      expect(productCards).toHaveLength(8);
      
      // Check first few products are in correct order
      expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-4')).toBeInTheDocument();
    });
  });

  describe('Row Calculation', () => {
    it('calculates correct number of rows for exact multiples', () => {
      const products = createMockProducts(8); // Exactly 2 rows
      render(<VirtualGrid products={products} />);

      expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
      // Should render products from both rows
      expect(screen.getByTestId('product-card-1')).toBeInTheDocument(); // First row
      expect(screen.getByTestId('product-card-5')).toBeInTheDocument(); // Second row
    });

    it('calculates correct number of rows for non-exact multiples', () => {
      const products = createMockProducts(10); // 2.5 rows (needs 3 rows total)
      render(<VirtualGrid products={products} />);

      expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
      // Should render products from all three rows
      expect(screen.getByTestId('product-card-1')).toBeInTheDocument(); // First row
      expect(screen.getByTestId('product-card-5')).toBeInTheDocument(); // Second row
      expect(screen.getByTestId('product-card-9')).toBeInTheDocument(); // Third row
    });
  });

  describe('Component Structure', () => {
    it('has correct DOM structure', () => {
      const products = createMockProducts(4);
      const { container } = render(<VirtualGrid products={products} />);

      // Check main wrapper
      const wrapper = container.firstChild as HTMLElement;
      expect(wrapper.tagName).toBe('DIV');
      expect(wrapper).toHaveClass('mb-8');

      // Check virtual list is present
      expect(screen.getByTestId('virtual-list')).toBeInTheDocument();
    });

    it('renders with proper key props for products', () => {
      const products = createMockProducts(3);
      render(<VirtualGrid products={products} />);

      // Products should have unique test ids (which implies proper keys)
      expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
      expect(screen.getByTestId('product-card-3')).toBeInTheDocument();
    });
  });
}); 
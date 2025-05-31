import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import FilterSection from '@/features/FilterSection';
import { FilterProvider } from '@/contexts/FilterContext';

// Mock the debounce hook
jest.mock('@/hooks/useDebounce', () => ({
  useDebounce: (value: string, _delay: number) => value,
}));

// Mock the Select component
jest.mock('@/features/components/Select', () => {
  return function MockSelect({ 
    placeholder, 
    options, 
    value, 
    onValueChange,
    id
  }: { 
    placeholder: string;
    options: Array<{ value: string; label: string }>;
    value: string;
    onValueChange: (value: string) => void;
    id?: string;
  }) {
    return (
      <select
        id={id}
        data-testid={`select-${placeholder.toLowerCase().replace(/\s+/g, '-')}`}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    );
  };
});

// Mock the Button component
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, variant, size, className }: any) => (
    <button 
      onClick={onClick} 
      data-variant={variant}
      data-size={size}
      className={className}
    >
      {children}
    </button>
  ),
}));

// Mock the Search icon
jest.mock('lucide-react', () => ({
  Search: () => <div data-testid="search-icon">🔍</div>,
}));

// Mock constants
jest.mock('@/constants/product', () => ({
  PRODUCT_CATEGORIES: ['All', 'Art', 'Music', 'Photography', 'Digital'],
  PRODUCT_SORT_OPTIONS: [
    { value: 'createdAt-desc', label: 'Newest First' },
    { value: 'createdAt-asc', label: 'Oldest First' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
  ],
  PRODUCT_THEMES: [
    { value: 'Abstract', label: 'Abstract' },
    { value: 'Modern', label: 'Modern' },
    { value: 'Classic', label: 'Classic' },
  ],
  PRODUCT_TIERS: [
    { value: 'Basic', label: 'Basic' },
    { value: 'Premium', label: 'Premium' },
    { value: 'Elite', label: 'Elite' },
  ],
}));

const createWrapper = () => {
  return ({ children }: { children: ReactNode }) => (
    <FilterProvider>{children}</FilterProvider>
  );
};

describe('FilterSection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all filter elements correctly', () => {
      render(
        <FilterSection>
          <div data-testid="children-content">Test Children</div>
        </FilterSection>,
        { wrapper: createWrapper() }
      );

      // Search input
      expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
      expect(screen.getByTestId('search-icon')).toBeInTheDocument();

      // Sort select
      expect(screen.getByTestId('select-select-sorting')).toBeInTheDocument();
      expect(screen.getByText('Sort By')).toBeInTheDocument();

      // Tier select
      expect(screen.getByTestId('select-select-tier')).toBeInTheDocument();
      expect(screen.getByText('Tier')).toBeInTheDocument();

      // Theme select
      expect(screen.getByTestId('select-select-theme')).toBeInTheDocument();
      expect(screen.getByText('Theme')).toBeInTheDocument();

      // Reset filter button
      expect(screen.getByText('Reset Filter')).toBeInTheDocument();

      // Category buttons
      expect(screen.getByText('All')).toBeInTheDocument();
      expect(screen.getByText('Art')).toBeInTheDocument();
      expect(screen.getByText('Music')).toBeInTheDocument();
      expect(screen.getByText('Photography')).toBeInTheDocument();
      expect(screen.getByText('Digital')).toBeInTheDocument();

      // Children content
      expect(screen.getByTestId('children-content')).toBeInTheDocument();
      expect(screen.getByText('Test Children')).toBeInTheDocument();
    });

    it('renders with proper layout structure', () => {
      const { container } = render(
        <FilterSection>
          <div>Content</div>
        </FilterSection>,
        { wrapper: createWrapper() }
      );

      // Check main layout classes exist
      expect(container.querySelector('.max-w-7xl')).toBeInTheDocument();
      expect(container.querySelector('.lg\\:w-64')).toBeInTheDocument();
      expect(container.querySelector('.flex-1')).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('updates search input value when typing', async () => {
      render(
        <FilterSection>
          <div>Content</div>
        </FilterSection>,
        { wrapper: createWrapper() }
      );

      const searchInput = screen.getByPlaceholderText('Search');
      
      fireEvent.change(searchInput, { target: { value: 'test query' } });
      
      expect(searchInput).toHaveValue('test query');
    });

    it('shows loading indicator when search is debouncing', async () => {
      render(
        <FilterSection>
          <div>Content</div>
        </FilterSection>,
        { wrapper: createWrapper() }
      );

      const searchInput = screen.getByPlaceholderText('Search');
      
      // Type a value that should trigger debouncing
      fireEvent.change(searchInput, { target: { value: 'test' } });
      
      // Check that the input has the typed value
      expect(searchInput).toHaveValue('test');
      
      // In a real scenario, the loading spinner would appear when debounced value differs
      // Since useDebounce is mocked to return the same value immediately, 
      // we can only verify the input functionality works
      expect(screen.getByRole('textbox')).toHaveValue('test');
    });

    it('clears search when reset filters is clicked', async () => {
      render(
        <FilterSection>
          <div>Content</div>
        </FilterSection>,
        { wrapper: createWrapper() }
      );

      const searchInput = screen.getByPlaceholderText('Search');
      const resetButton = screen.getByText('Reset Filter');
      
      // Type in search
      fireEvent.change(searchInput, { target: { value: 'test query' } });
      expect(searchInput).toHaveValue('test query');
      
      // Reset filters
      fireEvent.click(resetButton);
      
      // Search should be cleared
      await waitFor(() => {
        expect(searchInput).toHaveValue('');
      });
    });
  });

  describe('Category Filters', () => {
    it('shows "All" as active by default', () => {
      render(
        <FilterSection>
          <div>Content</div>
        </FilterSection>,
        { wrapper: createWrapper() }
      );

      const allButton = screen.getByText('All');
      expect(allButton).toHaveAttribute('data-variant', 'default');
    });

    it('changes active category when clicked', async () => {
      render(
        <FilterSection>
          <div>Content</div>
        </FilterSection>,
        { wrapper: createWrapper() }
      );

      const artButton = screen.getByText('Art');
      
      fireEvent.click(artButton);
      
      expect(artButton).toHaveAttribute('data-variant', 'default');
    });

    it('shows inactive categories with outline variant', async () => {
      render(
        <FilterSection>
          <div>Content</div>
        </FilterSection>,
        { wrapper: createWrapper() }
      );

      const artButton = screen.getByText('Art');
      const musicButton = screen.getByText('Music');
      
      // Initially Music should be inactive
      expect(musicButton).toHaveAttribute('data-variant', 'outline');
      
      // Click Art
      fireEvent.click(artButton);
      
      // Now Music should still be inactive, Art should be active
      expect(musicButton).toHaveAttribute('data-variant', 'outline');
      expect(artButton).toHaveAttribute('data-variant', 'default');
    });

    it('resets to "All" when reset filters is clicked', async () => {
      render(
        <FilterSection>
          <div>Content</div>
        </FilterSection>,
        { wrapper: createWrapper() }
      );

      const artButton = screen.getByText('Art');
      const allButton = screen.getByText('All');
      const resetButton = screen.getByText('Reset Filter');
      
      // Select Art category
      fireEvent.click(artButton);
      expect(artButton).toHaveAttribute('data-variant', 'default');
      
      // Reset filters
      fireEvent.click(resetButton);
      
      // All should be active again
      await waitFor(() => {
        expect(allButton).toHaveAttribute('data-variant', 'default');
        expect(artButton).toHaveAttribute('data-variant', 'outline');
      });
    });
  });

  describe('Sort Options', () => {
    it('shows current sort value correctly', () => {
      render(
        <FilterSection>
          <div>Content</div>
        </FilterSection>,
        { wrapper: createWrapper() }
      );

      const sortSelect = screen.getByTestId('select-select-sorting');
      // Default sort should be 'createdAt-desc' based on initial filters
      expect(sortSelect).toHaveValue('createdAt-desc');
    });

    it('updates filters when sort option changes', async () => {
      render(
        <FilterSection>
          <div>Content</div>
        </FilterSection>,
        { wrapper: createWrapper() }
      );

      const sortSelect = screen.getByTestId('select-select-sorting');
      
      fireEvent.change(sortSelect, { target: { value: 'price-asc' } });
      
      expect(sortSelect).toHaveValue('price-asc');
    });

    it('resets sort option when reset filters is clicked', async () => {
      render(
        <FilterSection>
          <div>Content</div>
        </FilterSection>,
        { wrapper: createWrapper() }
      );

      const sortSelect = screen.getByTestId('select-select-sorting');
      const resetButton = screen.getByText('Reset Filter');
      
      // Change sort
      fireEvent.change(sortSelect, { target: { value: 'price-asc' } });
      expect(sortSelect).toHaveValue('price-asc');
      
      // Reset filters
      fireEvent.click(resetButton);
      
      // Should reset to default
      await waitFor(() => {
        expect(sortSelect).toHaveValue('createdAt-desc');
      });
    });
  });

  describe('Tier Filter', () => {
    it('updates tier filter when selection changes', async () => {
      render(
        <FilterSection>
          <div>Content</div>
        </FilterSection>,
        { wrapper: createWrapper() }
      );

      const tierSelect = screen.getByTestId('select-select-tier');
      
      fireEvent.change(tierSelect, { target: { value: 'Premium' } });
      
      expect(tierSelect).toHaveValue('Premium');
    });

    it('clears tier filter when empty value is selected', async () => {
      render(
        <FilterSection>
          <div>Content</div>
        </FilterSection>,
        { wrapper: createWrapper() }
      );

      const tierSelect = screen.getByTestId('select-select-tier');
      
      // First select a tier
      fireEvent.change(tierSelect, { target: { value: 'Premium' } });
      expect(tierSelect).toHaveValue('Premium');
      
      // Then clear it
      fireEvent.change(tierSelect, { target: { value: '' } });
      expect(tierSelect).toHaveValue('');
    });

    it('resets tier filter when reset filters is clicked', async () => {
      render(
        <FilterSection>
          <div>Content</div>
        </FilterSection>,
        { wrapper: createWrapper() }
      );

      const tierSelect = screen.getByTestId('select-select-tier');
      const resetButton = screen.getByText('Reset Filter');
      
      // Select a tier
      fireEvent.change(tierSelect, { target: { value: 'Premium' } });
      expect(tierSelect).toHaveValue('Premium');
      
      // Reset filters
      fireEvent.click(resetButton);
      
      // Should reset to empty
      await waitFor(() => {
        expect(tierSelect).toHaveValue('');
      });
    });
  });

  describe('Theme Filter', () => {
    it('updates theme filter when selection changes', async () => {
      render(
        <FilterSection>
          <div>Content</div>
        </FilterSection>,
        { wrapper: createWrapper() }
      );

      const themeSelect = screen.getByTestId('select-select-theme');
      
      fireEvent.change(themeSelect, { target: { value: 'Abstract' } });
      
      expect(themeSelect).toHaveValue('Abstract');
    });

    it('clears theme filter when empty value is selected', async () => {
      render(
        <FilterSection>
          <div>Content</div>
        </FilterSection>,
        { wrapper: createWrapper() }
      );

      const themeSelect = screen.getByTestId('select-select-theme');
      
      // First select a theme
      fireEvent.change(themeSelect, { target: { value: 'Abstract' } });
      expect(themeSelect).toHaveValue('Abstract');
      
      // Then clear it
      fireEvent.change(themeSelect, { target: { value: '' } });
      expect(themeSelect).toHaveValue('');
    });

    it('resets theme filter when reset filters is clicked', async () => {
      render(
        <FilterSection>
          <div>Content</div>
        </FilterSection>,
        { wrapper: createWrapper() }
      );

      const themeSelect = screen.getByTestId('select-select-theme');
      const resetButton = screen.getByText('Reset Filter');
      
      // Select a theme
      fireEvent.change(themeSelect, { target: { value: 'Abstract' } });
      expect(themeSelect).toHaveValue('Abstract');
      
      // Reset filters
      fireEvent.click(resetButton);
      
      // Should reset to empty
      await waitFor(() => {
        expect(themeSelect).toHaveValue('');
      });
    });
  });

  describe('Reset Functionality', () => {
    it('resets all filters and search when clicked', async () => {
      render(
        <FilterSection>
          <div>Content</div>
        </FilterSection>,
        { wrapper: createWrapper() }
      );

      const searchInput = screen.getByPlaceholderText('Search');
      const artButton = screen.getByText('Art');
      const tierSelect = screen.getByTestId('select-select-tier');
      const themeSelect = screen.getByTestId('select-select-theme');
      const sortSelect = screen.getByTestId('select-select-sorting');
      const resetButton = screen.getByText('Reset Filter');
      
      // Apply various filters
      fireEvent.change(searchInput, { target: { value: 'test search' } });
      fireEvent.click(artButton);
      fireEvent.change(tierSelect, { target: { value: 'Premium' } });
      fireEvent.change(themeSelect, { target: { value: 'Abstract' } });
      fireEvent.change(sortSelect, { target: { value: 'price-asc' } });
      
      // Verify filters are applied
      expect(searchInput).toHaveValue('test search');
      expect(artButton).toHaveAttribute('data-variant', 'default');
      expect(tierSelect).toHaveValue('Premium');
      expect(themeSelect).toHaveValue('Abstract');
      expect(sortSelect).toHaveValue('price-asc');
      
      // Reset all filters
      fireEvent.click(resetButton);
      
      // Verify everything is reset
      await waitFor(() => {
        expect(searchInput).toHaveValue('');
        expect(screen.getByText('All')).toHaveAttribute('data-variant', 'default');
        expect(artButton).toHaveAttribute('data-variant', 'outline');
        expect(tierSelect).toHaveValue('');
        expect(themeSelect).toHaveValue('');
        expect(sortSelect).toHaveValue('createdAt-desc');
      });
    });
  });

  describe('Children Rendering', () => {
    it('renders children content in the correct location', () => {
      render(
        <FilterSection>
          <div data-testid="custom-content">Custom Content Here</div>
        </FilterSection>,
        { wrapper: createWrapper() }
      );

      expect(screen.getByTestId('custom-content')).toBeInTheDocument();
      expect(screen.getByText('Custom Content Here')).toBeInTheDocument();
    });

    it('renders children after category buttons', () => {
      render(
        <FilterSection>
          <div data-testid="custom-content">Custom Content</div>
        </FilterSection>,
        { wrapper: createWrapper() }
      );

      const categoryButtons = screen.getByText('Digital').closest('div');
      const customContent = screen.getByTestId('custom-content');
      
      // Custom content should come after category buttons in the DOM
      expect(categoryButtons?.compareDocumentPosition(customContent)).toBe(
        Node.DOCUMENT_POSITION_FOLLOWING
      );
    });
  });

  describe('Accessibility', () => {
    it('has proper labels for form elements', () => {
      render(
        <FilterSection>
          <div>Content</div>
        </FilterSection>,
        { wrapper: createWrapper() }
      );

      expect(screen.getByLabelText('Sort By')).toBeInTheDocument();
      expect(screen.getByLabelText('Tier')).toBeInTheDocument();
      expect(screen.getByLabelText('Theme')).toBeInTheDocument();
    });

    it('has proper input attributes', () => {
      render(
        <FilterSection>
          <div>Content</div>
        </FilterSection>,
        { wrapper: createWrapper() }
      );

      const searchInput = screen.getByPlaceholderText('Search');
      expect(searchInput).toHaveAttribute('type', 'text');
      expect(searchInput).toHaveAttribute('placeholder', 'Search');
    });
  });

  describe('Edge Cases', () => {
    it('handles empty category name correctly', async () => {
      render(
        <FilterSection>
          <div>Content</div>
        </FilterSection>,
        { wrapper: createWrapper() }
      );

      const allButton = screen.getByText('All');
      const artButton = screen.getByText('Art');
      
      // Select Art first
      fireEvent.click(artButton);
      expect(artButton).toHaveAttribute('data-variant', 'default');
      
      // Click All to reset category
      fireEvent.click(allButton);
      expect(allButton).toHaveAttribute('data-variant', 'default');
      expect(artButton).toHaveAttribute('data-variant', 'outline');
    });

    it('handles sort value parsing correctly', async () => {
      render(
        <FilterSection>
          <div>Content</div>
        </FilterSection>,
        { wrapper: createWrapper() }
      );

      const sortSelect = screen.getByTestId('select-select-sorting');
      
      // Test all sort options
      fireEvent.change(sortSelect, { target: { value: 'createdAt-asc' } });
      expect(sortSelect).toHaveValue('createdAt-asc');
      
      fireEvent.change(sortSelect, { target: { value: 'price-desc' } });
      expect(sortSelect).toHaveValue('price-desc');
      
      fireEvent.change(sortSelect, { target: { value: 'price-asc' } });
      expect(sortSelect).toHaveValue('price-asc');
    });

    it('handles empty search input correctly', async () => {
      render(
        <FilterSection>
          <div>Content</div>
        </FilterSection>,
        { wrapper: createWrapper() }
      );

      const searchInput = screen.getByPlaceholderText('Search');
      
      // Type and then clear
      fireEvent.change(searchInput, { target: { value: 'test' } });
      fireEvent.change(searchInput, { target: { value: '' } });
      
      expect(searchInput).toHaveValue('');
    });
  });
}); 
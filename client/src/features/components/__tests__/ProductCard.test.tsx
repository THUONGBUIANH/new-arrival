import { render, screen } from '@testing-library/react';
import ProductCard from '@/features/components/ProductCard';
import type { Product } from '@/types/product';

// Mock the date utility
jest.mock('@/lib/date', () => ({
  formatDate: jest.fn(() => '01/01/2023'),
}));

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  category: 'Art',
  price: 1.5,
  isFavorite: false,
  createdAt: 1640995200000,
  theme: 'Abstract',
  tier: 'Premium',
  imageId: 1,
  author: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    gender: 'male',
    avatar: 'avatar.jpg',
    onlineStatus: 'online',
  },
};

describe('ProductCard', () => {
  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Premium')).toBeInTheDocument();
    expect(screen.getByText('1.50 ETH')).toBeInTheDocument();
    expect(screen.getByText('Art')).toBeInTheDocument();
    expect(screen.getByText('Abstract')).toBeInTheDocument();
    expect(screen.getByText('by John Doe')).toBeInTheDocument();
  });

  it('formats price correctly', () => {
    const productWithDecimalPrice = { ...mockProduct, price: 0.05 };
    render(<ProductCard product={productWithDecimalPrice} />);
    
    expect(screen.getByText('0.05 ETH')).toBeInTheDocument();
  });

  it('renders author name correctly', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('by John Doe')).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    const { container } = render(<ProductCard product={mockProduct} />);
    
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('bg-white', 'border', 'border-gray-200', 'rounded-lg', 'overflow-hidden');
  });
}); 
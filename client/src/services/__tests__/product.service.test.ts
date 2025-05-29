import { getProducts } from '@/services/product.service';
import { get } from '@/services/api';
import type { Product, ProductFilter } from '@/types/product';

// Mock the API module
jest.mock('@/services/api');
const mockedGet = get as jest.MockedFunction<typeof get>;

const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Test Product 1',
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
  },
  {
    id: 2,
    title: 'Test Product 2',
    category: 'Digital',
    price: 2.0,
    isFavorite: true,
    createdAt: 1641081600000,
    theme: 'Modern',
    tier: 'Basic',
    imageId: 2,
    author: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      gender: 'female',
      avatar: 'avatar2.jpg',
      onlineStatus: 'offline',
    },
  },
];

describe('Product Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should fetch products without parameters', async () => {
      mockedGet.mockResolvedValue(mockProducts);

      const result = await getProducts();

      expect(mockedGet).toHaveBeenCalledWith('/products?');
      expect(result).toEqual(mockProducts);
    });

    it('should fetch products with search query', async () => {
      mockedGet.mockResolvedValue(mockProducts);

      const filter: ProductFilter = { q: 'test' };
      const result = await getProducts(filter);

      expect(mockedGet).toHaveBeenCalledWith('/products?q=test');
      expect(result).toEqual(mockProducts);
    });

    it('should fetch products with multiple filter parameters', async () => {
      mockedGet.mockResolvedValue(mockProducts);

      const filter: ProductFilter = {
        q: 'art',
        category: 'Digital',
        tier: 'Premium',
        _sort: 'price',
        _order: 'asc',
        _page: 1,
        _limit: 10,
      };

      const result = await getProducts(filter);

      expect(mockedGet).toHaveBeenCalledWith(
        '/products?q=art&category=Digital&tier=Premium&_sort=price&_order=asc&_page=1&_limit=10'
      );
      expect(result).toEqual(mockProducts);
    });

    it('should filter out null and undefined values', async () => {
      mockedGet.mockResolvedValue(mockProducts);

      const filter: ProductFilter = {
        q: 'test',
        category: null,
        tier: undefined,
        theme: '',
      };

      const result = await getProducts(filter);

      expect(mockedGet).toHaveBeenCalledWith('/products?q=test');
      expect(result).toEqual(mockProducts);
    });

    it('should handle empty filter object', async () => {
      mockedGet.mockResolvedValue(mockProducts);

      const result = await getProducts({});

      expect(mockedGet).toHaveBeenCalledWith('/products?');
      expect(result).toEqual(mockProducts);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Network error';
      mockedGet.mockRejectedValue(new Error(errorMessage));

      await expect(getProducts()).rejects.toThrow(errorMessage);
    });

    it('should handle numeric parameters correctly', async () => {
      mockedGet.mockResolvedValue(mockProducts);

      const filter: ProductFilter = {
        _page: 2,
        _limit: 5,
      };

      const result = await getProducts(filter);

      expect(mockedGet).toHaveBeenCalledWith('/products?_page=2&_limit=5');
      expect(result).toEqual(mockProducts);
    });

    it('should handle special characters in query', async () => {
      mockedGet.mockResolvedValue(mockProducts);

      const filter: ProductFilter = {
        q: 'test & demo',
      };

      const result = await getProducts(filter);

      expect(mockedGet).toHaveBeenCalledWith('/products?q=test+%26+demo');
      expect(result).toEqual(mockProducts);
    });
  });
}); 
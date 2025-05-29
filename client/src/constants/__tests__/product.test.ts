import {
  PRODUCT_CATEGORIES,
  PRODUCT_TIERS,
  PRODUCT_THEMES,
  PRODUCT_SORT_OPTIONS,
} from '@/constants/product';

describe('Product Constants', () => {
  describe('PRODUCT_CATEGORIES', () => {
    it('should contain all expected categories', () => {
      const expectedCategories = [
        'All',
        'Upper Body',
        'Lever',
        'Hat',
        'Shoes',
        'Accessory',
        'Legendary',
        'MyiFic',
        'EpC',
      ];
      
      expect(PRODUCT_CATEGORIES).toEqual(expectedCategories);
    });

    it('should have correct length', () => {
      expect(PRODUCT_CATEGORIES).toHaveLength(9);
    });

    it('should include "All" as first category', () => {
      expect(PRODUCT_CATEGORIES[0]).toBe('All');
    });
  });

  describe('PRODUCT_TIERS', () => {
    it('should contain tier options with correct structure', () => {
      expect(PRODUCT_TIERS).toEqual([
        { value: 'Basic', label: 'Basic' },
        { value: 'Premium', label: 'Premium' },
        { value: 'Deluxe', label: 'Deluxe' },
      ]);
    });

    it('should have correct length', () => {
      expect(PRODUCT_TIERS).toHaveLength(3);
    });

    it('should have value and label properties for each tier', () => {
      PRODUCT_TIERS.forEach(tier => {
        expect(tier).toHaveProperty('value');
        expect(tier).toHaveProperty('label');
        expect(typeof tier.value).toBe('string');
        expect(typeof tier.label).toBe('string');
      });
    });
  });

  describe('PRODUCT_THEMES', () => {
    it('should contain theme options with correct structure', () => {
      expect(PRODUCT_THEMES).toEqual([
        { value: 'Dark', label: 'Dark' },
        { value: 'Light', label: 'Light' },
        { value: 'Halloween', label: 'Halloween' },
        { value: 'Colorful', label: 'Colorful' },
      ]);
    });

    it('should have correct length', () => {
      expect(PRODUCT_THEMES).toHaveLength(4);
    });

    it('should have value and label properties for each theme', () => {
      PRODUCT_THEMES.forEach(theme => {
        expect(theme).toHaveProperty('value');
        expect(theme).toHaveProperty('label');
        expect(typeof theme.value).toBe('string');
        expect(typeof theme.label).toBe('string');
      });
    });
  });

  describe('PRODUCT_SORT_OPTIONS', () => {
    it('should contain sort options with correct structure', () => {
      expect(PRODUCT_SORT_OPTIONS).toEqual([
        { value: 'price-asc', label: 'Price: Low to High' },
        { value: 'price-desc', label: 'Price: High to Low' },
        { value: 'createdAt-asc', label: 'Date: Oldest First' },
        { value: 'createdAt-desc', label: 'Date: Newest First' },
      ]);
    });

    it('should have correct length', () => {
      expect(PRODUCT_SORT_OPTIONS).toHaveLength(4);
    });

    it('should include both price and date sorting options', () => {
      const values = PRODUCT_SORT_OPTIONS.map(option => option.value);
      expect(values).toContain('price-asc');
      expect(values).toContain('price-desc');
      expect(values).toContain('createdAt-asc');
      expect(values).toContain('createdAt-desc');
    });

    it('should have value and label properties for each option', () => {
      PRODUCT_SORT_OPTIONS.forEach(option => {
        expect(option).toHaveProperty('value');
        expect(option).toHaveProperty('label');
        expect(typeof option.value).toBe('string');
        expect(typeof option.label).toBe('string');
      });
    });
  });
}); 
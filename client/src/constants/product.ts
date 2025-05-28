import type { SelectOption } from '@/types/select';

export const PRODUCT_CATEGORIES = [
  'All',
  'Upper Body',
  'Lever',
  'Hat',
  'Shoes',
  'Accessory',
  'Legendary',
  'MyiFic',
  'EpC',
] as const;

export const PRODUCT_TIERS: SelectOption[] = [
  { value: 'basic', label: 'Basic' },
  { value: 'premium', label: 'Premium' },
  { value: 'luxury', label: 'Luxury' },
];

export const PRODUCT_THEMES: SelectOption[] = [
  { value: 'cyberpunk', label: 'Cyberpunk' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'modern', label: 'Modern' },
  { value: 'retro', label: 'Retro' },
  { value: 'minimalist', label: 'Minimalist' },
];

export const PRODUCT_SORT_OPTIONS: SelectOption[] = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'createdAt-asc', label: 'Date: Oldest First' },
  { value: 'createdAt-desc', label: 'Date: Newest First' },
];

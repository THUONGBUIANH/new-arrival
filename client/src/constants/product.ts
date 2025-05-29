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
  { value: 'Basic', label: 'Basic' },
  { value: 'Premium', label: 'Premium' },
  { value: 'Deluxe', label: 'Deluxe' },
];

export const PRODUCT_THEMES: SelectOption[] = [
  { value: 'Dark', label: 'Dark' },
  { value: 'Light', label: 'Light' },
  { value: 'Halloween', label: 'Halloween' },
  { value: 'Colorful', label: 'Colorful' },
];

export const PRODUCT_SORT_OPTIONS: SelectOption[] = [
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'createdAt-asc', label: 'Date: Oldest First' },
  { value: 'createdAt-desc', label: 'Date: Newest First' },
];

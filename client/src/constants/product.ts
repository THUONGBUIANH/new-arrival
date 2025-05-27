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

export const PRODUCT_PRICE_RANGES: SelectOption[] = [
  { value: 'low', label: '0-1 ETH' },
  { value: 'medium', label: '1-5 ETH' },
  { value: 'high', label: '5+ ETH' },
];

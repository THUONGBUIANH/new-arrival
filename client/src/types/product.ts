export interface Author {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  avatar: string;
  onlineStatus: string;
}

export interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  isFavorite: boolean;
  createdAt: number;
  theme: string;
  tier: string;
  imageId: number;
  author: Author;
}

//localhost:5005/products?q=phantom&_sort=price&_order=asc&_page=1&_limit=3

export type ProductSort = 'price' | 'createdAt';
export type Order = 'asc' | 'desc';
export interface ProductFilter {
  q?: string;
  category?: string | null;
  _sort?: ProductSort;
  _order?: Order;
  _page?: number;
  _limit?: number;
}


export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  featured?: boolean;
  rating: number;
  images?: string[];
  viewCount?: number;
  purchaseCount?: number;
  lastUpdated?: string;
  quantity?: number;
}

export interface Transaction {
  id: number;
  productId: number;
  quantity: number;
  total: number;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
}

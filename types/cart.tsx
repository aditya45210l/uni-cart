// src/types/cart.ts (or wherever you keep your types)

export interface CartItem {
  productId: string;
  productUrl?: string;
  productName?: string;
  productImage?: string;
  quantity: number;
  priceUSD: number;
  addedAt: Date;
}

export interface Cart {
  _id: string; // Assuming MongoDB _id
  userId: string;
  items: CartItem[];
  status: 'active' | 'checkout' | 'completed'; // Example statuses
  totalPriceUSD: number;
  createdAt: Date;
  updatedAt: Date;
  // Add other cart properties if they exist
}

export interface ApiResponse<T> {
  cart?: T; // For successful responses
  error?: string; // For error responses
}

export interface AddItemToCartPayload {
  walletAddress: string;
  productId: string;
  productUrl?: string;
  productName?: string;
  productImage?: string;
  quantity: number;
  priceUSD: number;
}
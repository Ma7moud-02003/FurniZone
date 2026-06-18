export interface CartItem {
  id: string;
  productId: string;
  productImageUrl: string;
  productName: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
  totalItems: number;
  totalPrice: number;
  userId: string;
}

export interface Cart {
  id: string;
  items: CartItem[];
}
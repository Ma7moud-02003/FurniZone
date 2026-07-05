export enum OrderStatus {
  Pending = 0,
  Confirmed = 1,
  Shipped = 2,
  Delivered = 3,
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  price: number;
  quantity: number;
  subtotal: number;
}

// Shape of the payment object is not yet defined by the API (currently returns null).
// Replace this with the real payment fields once the backend documents them.
export interface OrderPayment {
  [key: string]: unknown;
}

export interface Order {
  id: string;
  createdAt: string;
  orderItems: OrderItem[];
  payment: OrderPayment | null;
  status: OrderStatus;
  totalPrice: number;
}

export interface OrderFilters {
  status: OrderStatus | null;
  userId: string;
  fromDate: string;
  toDate: string;
  sortBy: string;
  sortDescending: boolean;
  pageNumber: number;
  pageSize: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface UpdateOrderStatusPayload {
  status: OrderStatus;
}
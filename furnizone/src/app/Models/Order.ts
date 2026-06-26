// 1. تفاصيل المنتج داخل الـ Order
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  price: number;
  quantity: number;
  subtotal: number;
}

// 2. تفاصيل عملية الدفع التابعة للـ Order
export interface OrderPayment {
  id: string;
  orderId: string;
  amount: number;
  status: number; // لو الـ status بيرجع كـ enum (مثلاً 0 تعني Pending أو Success)
  createdAt: string;
}

// 3. مجسم الـ Order الواحد
export interface Order {
  id: string;
  createdAt: string;
  orderItems: OrderItem[];
  payment: OrderPayment;
}

// 4. الاستجابة الكاملة من الـ API (MyOrders Response)
export interface MyOrdersResponse {
  success: boolean;
  message?: string; // خليناه اختياري لأنه مش ظاهر في الأوبجكت اللي بعته بس تحسباً لو موجود
  data: Order[];
}
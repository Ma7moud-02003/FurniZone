export interface Product {
  id: string;
  name: string;                // بدلاً من title
  description: string;
  price: number;
  stock: number;               // بدلاً من stockCount أو inStock
  imageUrl: string;            // بدلاً من images: string[] لأنها جاية رابط واحد كـ string
  categoryId: string;          // الـ ID الخاص بالقسم
  categoryName: string;        // اسم القسم (Electronics)
  averageRating: number;       // بدلاً من rating
  reviewCount: number;         // بدلاً من reviewsCount
  createdAt: string;           // تاريخ الإنشاء القادم من الداتا
  reviews: any[];              // مصفوفة المراجعات (حالياً فاضية)
}
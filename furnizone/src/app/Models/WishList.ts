export interface WishlistItem {
  id: string;              // معرف عنصر المفضلة نفسه (المستخدم في الحذف)
  productId: string;       // معرف المنتج الأساسي (المستخدم عند الإضافة للسلة)
  productName: string;     // اسم المنتج
  productPrice: number;    // سعر المنتج
  productImageUrl: string; // رابط صورة المنتج
  addedAt: string;         // تاريخ إضافة المنتج للمفضلة (ISO Date String)
}
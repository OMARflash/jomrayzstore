export interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  productId?: string | null;
  size: string;
  colorName: string;
  colorHex: string;
  stock: number;
  sku?: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
}

export interface Review {
  id: string;
  productId: string;
  authorName: string;
  rating: number;
  comment: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  createdAt: string | Date;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  material?: string | null;
  care?: string | null;
  price: number;
  originalPrice?: number | null;
  isNewDrop: boolean;
  isBestSeller: boolean;
  isPublished: boolean;
  categoryId?: string | null;
  category?: Category | null;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews?: Review[];
  createdAt?: string | Date;
}

export interface CartItem {
  id: string; // unique item key: productId-variantId
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  maxStock: number;
}

export interface ShippingRate {
  id: string;
  governorate: string;
  governorateAr: string;
  rate: number;
  estimatedDays: string;
  isActive: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string | null;
  productName: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
  total: number;
  product?: Product;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerPhone: string;
  governorate: string;
  city: string;
  address: string;
  building?: string | null;
  floor?: string | null;
  apartment?: string | null;
  notes?: string | null;
  paymentMethod: string;
  status: 'RECEIVED' | 'CONFIRMED' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  couponCode?: string | null;
  items: OrderItem[];
  user?: { id?: string; name?: string; email?: string; phone?: string | null } | null;
  createdAt: string | Date;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  phone?: string | null;
}

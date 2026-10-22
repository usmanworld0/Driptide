export type UUID = string;

export enum UserRole {
  CUSTOMER = 'customer',
  STAFF = 'staff',
  ADMIN = 'admin',
}

export enum ProductStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

export enum OrderStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export enum PaymentStatus {
  PENDING = 'pending',
  AUTHORIZED = 'authorized',
  CAPTURED = 'captured',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethodType {
  CREDIT_CARD = 'credit_card',
  COD = 'cod',
  MANUAL = 'manual',
}

export enum FulfillmentStatus {
  UNFULFILLED = 'unfulfilled',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  RETURNED = 'returned',
}

export enum InventoryMovementType {
  RESTOCK = 'restock',
  ORDER_RESERVATION = 'order_reservation',
  ORDER_CANCELLATION = 'order_cancellation',
  MANUAL_ADJUSTMENT = 'manual_adjustment',
  DAMAGE = 'damage',
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
  meta?: Record<string, unknown>;
}

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
}

export interface Address {
  id?: UUID;
  userId?: UUID;
  fullName: string;
  phone: string;
  street1: string;
  street2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  isDefaultShipping?: boolean;
  isDefaultBilling?: boolean;
}

export interface UserProfile {
  id: UUID;
  email: string;
  fullName?: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: UUID;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  parentId?: UUID | null;
  sortOrder: number;
  isActive: boolean;
  productCount?: number;
}

export interface Collection {
  id: UUID;
  title: string;
  slug: string;
  description?: string;
  bannerUrl?: string;
  isActive: boolean;
  featured: boolean;
  sortOrder: number;
}

export interface ProductImage {
  id: UUID;
  productId: UUID;
  url: string;
  altText?: string;
  sortOrder: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: UUID;
  productId: UUID;
  sku: string;
  title: string; // e.g. "Black / M"
  size?: string;  // e.g. "S", "M", "L", "XL"
  color?: string; // e.g. "Washed Black"
  colorHex?: string; // e.g. "#1C1C1C"
  priceMinor: number; // e.g. 12000 for $120.00
  compareAtPriceMinor?: number | null; // e.g. 15000 for $150.00
  stockQuantity: number;
  barcode?: string;
}

export interface Product {
  id: UUID;
  name: string;
  slug: string;
  tagline?: string;
  description: string;
  details?: string[];
  fabricCare?: string[];
  category?: Category;
  categoryId?: UUID;
  status: ProductStatus;
  featured: boolean;
  isNewArrival: boolean;
  basePriceMinor: number;
  compareAtPriceMinor?: number | null;
  images: ProductImage[];
  variants: ProductVariant[];
  totalStock: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: UUID;
  cartId: UUID;
  variantId: UUID;
  product: Product;
  variant: ProductVariant;
  quantity: number;
  unitPriceMinor: number;
  totalPriceMinor: number;
}

export interface Cart {
  id: UUID;
  userId?: UUID | null;
  sessionId?: string | null;
  items: CartItem[];
  itemCount: number;
  subtotalMinor: number;
  shippingMinor: number;
  discountMinor: number;
  estimatedTaxMinor: number;
  totalMinor: number;
  couponCode?: string | null;
}

export interface WishlistItem {
  id: UUID;
  userId: UUID;
  productId: UUID;
  product: Product;
  createdAt: string;
}

export interface OrderItem {
  id: UUID;
  orderId: UUID;
  productId: UUID;
  variantId: UUID;
  productName: string;
  variantTitle: string;
  sku: string;
  unitPriceMinor: number;
  quantity: number;
  totalPriceMinor: number;
  imageUrl?: string;
}

export interface Order {
  id: UUID;
  orderNumber: string;
  userId?: UUID | null;
  guestEmail?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  shippingAddress: Address;
  billingAddress?: Address;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: FulfillmentStatus;
  currency: string;
  subtotalMinor: number;
  shippingMinor: number;
  taxMinor: number;
  discountMinor: number;
  totalMinor: number;
  couponCode?: string | null;
  paymentMethod: PaymentMethodType;
  items: OrderItem[];
  trackingNumber?: string | null;
  courier?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryMovement {
  id: UUID;
  variantId: UUID;
  sku: string;
  type: InventoryMovementType;
  quantityDelta: number;
  previousQuantity: number;
  newQuantity: number;
  reason?: string;
  orderId?: UUID | null;
  performedBy?: UUID | null;
  createdAt: string;
}

export interface Coupon {
  id: UUID;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // percentage (e.g. 15 for 15%) or fixed minor cents (e.g. 2000 for $20.00)
  minSpendMinor?: number;
  maxDiscountMinor?: number;
  usageLimit?: number;
  usageCount: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export interface AdminAnalyticsMetrics {
  totalRevenueMinor: number;
  totalOrders: number;
  pendingOrdersCount: number;
  shippedOrdersCount: number;
  totalCustomers: number;
  lowStockItemsCount: number;
  recentOrders: Order[];
  topSellingProducts: {
    productId: UUID;
    name: string;
    unitsSold: number;
    revenueMinor: number;
    imageUrl?: string;
  }[];
}

// Request / DTO Types
export interface AddToCartInput {
  variantId: UUID;
  quantity: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}

export interface ApplyCouponInput {
  code: string;
}

export interface CheckoutInput {
  shippingAddress: Address;
  billingAddressSameAsShipping?: boolean;
  billingAddress?: Address;
  guestEmail?: string;
  paymentMethod: PaymentMethodType;
  couponCode?: string;
  notes?: string;
}

export interface CreateProductInput {
  name: string;
  slug?: string;
  tagline?: string;
  description: string;
  details?: string[];
  fabricCare?: string[];
  categoryId?: UUID;
  status: ProductStatus;
  featured?: boolean;
  isNewArrival?: boolean;
  basePriceMinor: number;
  compareAtPriceMinor?: number;
  images: {
    url: string;
    altText?: string;
    sortOrder: number;
    isPrimary?: boolean;
  }[];
  variants: {
    sku: string;
    title: string;
    size?: string;
    color?: string;
    colorHex?: string;
    priceMinor: number;
    compareAtPriceMinor?: number;
    stockQuantity: number;
  }[];
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  id: UUID;
}

export interface AdjustInventoryInput {
  variantId: UUID;
  quantityDelta: number;
  type: InventoryMovementType;
  reason?: string;
}

export interface UpdateOrderStatusInput {
  status: OrderStatus;
  notes?: string;
}

export interface FulfillOrderInput {
  courier: string;
  trackingNumber: string;
}

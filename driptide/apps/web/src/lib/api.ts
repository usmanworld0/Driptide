import {
  Product,
  Category,
  Cart,
  Order,
  CheckoutInput,
  AdminAnalyticsMetrics,
  OrderStatus,
  AdjustInventoryInput,
  UpdateProductInput,
} from '@driptide/contracts';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

async function fetcher<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(url, {
    ...options,
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    let errMsg = `Request failed: ${res.statusText}`;
    try {
      const errJson = await res.json();
      errMsg = errJson.error || errJson.message || errMsg;
    } catch {}
    throw new Error(errMsg);
  }

  const json = await res.json();
  return json.data;
}

export const api = {
  // Public Catalog
  async getProducts(params?: {
    category?: string;
    search?: string;
    sort?: string;
    featured?: boolean;
    newArrival?: boolean;
  }): Promise<Product[]> {
    const query = new URLSearchParams();
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    if (params?.sort) query.set('sort', params.sort);
    if (params?.featured !== undefined) query.set('featured', String(params.featured));
    if (params?.newArrival !== undefined) query.set('newArrival', String(params.newArrival));

    const qs = query.toString();
    return fetcher<Product[]>(`/catalog/products${qs ? `?${qs}` : ''}`);
  },

  async getProductBySlug(slug: string): Promise<Product> {
    return fetcher<Product>(`/catalog/products/${slug}`);
  },

  async getCategories(): Promise<Category[]> {
    return fetcher<Category[]>('/catalog/categories');
  },

  // Shopping Bag
  async getCart(sessionId: string): Promise<Cart> {
    return fetcher<Cart>('/cart', {
      headers: { 'x-session-id': sessionId },
    });
  },

  async addToCart(variantId: string, quantity: number, sessionId: string): Promise<Cart> {
    return fetcher<Cart>('/cart/items', {
      method: 'POST',
      headers: { 'x-session-id': sessionId },
      body: JSON.stringify({ variantId, quantity }),
    });
  },

  async updateCartItem(itemId: string, quantity: number, sessionId: string): Promise<Cart> {
    return fetcher<Cart>(`/cart/items/${itemId}`, {
      method: 'PUT',
      headers: { 'x-session-id': sessionId },
      body: JSON.stringify({ quantity }),
    });
  },

  async removeFromCart(itemId: string, sessionId: string): Promise<Cart> {
    return fetcher<Cart>(`/cart/items/${itemId}`, {
      method: 'DELETE',
      headers: { 'x-session-id': sessionId },
    });
  },

  async applyCoupon(code: string, sessionId: string): Promise<Cart> {
    return fetcher<Cart>('/cart/coupon', {
      method: 'POST',
      headers: { 'x-session-id': sessionId },
      body: JSON.stringify({ code }),
    });
  },

  async removeCoupon(sessionId: string): Promise<Cart> {
    return fetcher<Cart>('/cart/coupon', {
      method: 'DELETE',
      headers: { 'x-session-id': sessionId },
    });
  },

  // Checkout & Orders
  async checkout(input: CheckoutInput, sessionId: string): Promise<Order> {
    return fetcher<Order>('/orders/checkout', {
      method: 'POST',
      headers: { 'x-session-id': sessionId },
      body: JSON.stringify(input),
    });
  },

  async getOrder(orderId: string): Promise<Order> {
    return fetcher<Order>(`/orders/${orderId}`);
  },

  // Admin Operations
  async getAdminMetrics(token: string = 'admin-dev-token'): Promise<AdminAnalyticsMetrics> {
    return fetcher<AdminAnalyticsMetrics>('/admin/metrics', {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async getAdminOrders(status?: OrderStatus, token: string = 'admin-dev-token'): Promise<Order[]> {
    const qs = status ? `?status=${status}` : '';
    return fetcher<Order[]>(`/admin/orders${qs}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },

  async fulfillOrder(
    orderId: string,
    courier: string,
    trackingNumber: string,
    token: string = 'admin-dev-token',
  ): Promise<Order> {
    return fetcher<Order>(`/admin/orders/${orderId}/fulfill`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ courier, trackingNumber }),
    });
  },

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    notes?: string,
    token: string = 'admin-dev-token',
  ): Promise<Order> {
    return fetcher<Order>(`/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status, notes }),
    });
  },

  async adjustInventory(
    input: AdjustInventoryInput,
    token: string = 'admin-dev-token',
  ) {
    return fetcher('/admin/inventory/adjust', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(input),
    });
  },

  async updateProduct(
    id: string,
    input: Partial<UpdateProductInput>,
    token: string = 'admin-dev-token',
  ): Promise<Product> {
    return fetcher<Product>(`/admin/products/${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(input),
    });
  },
};

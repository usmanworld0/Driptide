import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import {
  AdminAnalyticsMetrics,
  Order,
  OrderStatus,
  FulfillmentStatus,
  Product,
  ProductStatus,
  CreateProductInput,
  UpdateProductInput,
  AdjustInventoryInput,
  InventoryMovementType,
  InventoryMovement,
} from '@driptide/contracts';

@Injectable()
export class AdminService {
  constructor(private readonly db: SupabaseService) {}

  async getMetrics(): Promise<AdminAnalyticsMetrics> {
    const orders = this.db.orders;
    const totalOrders = orders.length;

    const totalRevenueMinor = orders
      .filter((o) => o.status !== OrderStatus.CANCELLED && o.status !== OrderStatus.REFUNDED)
      .reduce((sum, o) => sum + o.totalMinor, 0);

    const pendingOrdersCount = orders.filter(
      (o) => o.status === OrderStatus.PENDING || o.status === OrderStatus.PROCESSING,
    ).length;

    const shippedOrdersCount = orders.filter(
      (o) => o.status === OrderStatus.SHIPPED || o.status === OrderStatus.DELIVERED,
    ).length;

    // Distinct customer count
    const customerEmails = new Set(orders.map((o) => o.customerEmail));
    const totalCustomers = customerEmails.size;

    // Low stock items (stock <= 15)
    let lowStockCount = 0;
    for (const prod of this.db.products) {
      for (const variant of prod.variants) {
        if (variant.stockQuantity <= 15) {
          lowStockCount++;
        }
      }
    }

    // Top selling products aggregation
    const productSalesMap = new Map<string, { name: string; unitsSold: number; revenueMinor: number; imageUrl?: string }>();
    for (const order of orders) {
      if (order.status !== OrderStatus.CANCELLED) {
        for (const item of order.items) {
          const curr = productSalesMap.get(item.productId) || {
            name: item.productName,
            unitsSold: 0,
            revenueMinor: 0,
            imageUrl: item.imageUrl,
          };
          curr.unitsSold += item.quantity;
          curr.revenueMinor += item.totalPriceMinor;
          productSalesMap.set(item.productId, curr);
        }
      }
    }

    const topSelling = Array.from(productSalesMap.entries())
      .map(([productId, stats]) => ({
        productId,
        ...stats,
      }))
      .sort((a, b) => b.unitsSold - a.unitsSold)
      .slice(0, 5);

    return {
      totalRevenueMinor,
      totalOrders,
      pendingOrdersCount,
      shippedOrdersCount,
      totalCustomers,
      lowStockItemsCount: lowStockCount,
      recentOrders: orders.slice(0, 8),
      topSellingProducts: topSelling,
    };
  }

  async getAllOrders(statusFilter?: OrderStatus): Promise<Order[]> {
    if (statusFilter) {
      return this.db.orders.filter((o) => o.status === statusFilter);
    }
    return this.db.orders;
  }

  async fulfillOrder(
    orderId: string,
    courier: string,
    trackingNumber: string,
  ): Promise<Order> {
    const order = this.db.orders.find((o) => o.id === orderId);
    if (!order) {
      throw new NotFoundException(`Order '${orderId}' not found`);
    }

    order.fulfillmentStatus = FulfillmentStatus.SHIPPED;
    order.status = OrderStatus.SHIPPED;
    order.courier = courier;
    order.trackingNumber = trackingNumber;
    order.updatedAt = new Date().toISOString();

    return order;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus, notes?: string): Promise<Order> {
    const order = this.db.orders.find((o) => o.id === orderId);
    if (!order) {
      throw new NotFoundException(`Order '${orderId}' not found`);
    }

    order.status = status;
    if (status === OrderStatus.DELIVERED) {
      order.fulfillmentStatus = FulfillmentStatus.DELIVERED;
    }
    if (notes) {
      order.notes = notes;
    }
    order.updatedAt = new Date().toISOString();

    return order;
  }

  async getAllProducts(): Promise<Product[]> {
    return this.db.products;
  }

  async createProduct(input: CreateProductInput): Promise<Product> {
    const id = `prod-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const slug =
      input.slug ||
      input.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const variants = input.variants.map((v, i) => ({
      id: `var-${Date.now()}-${i}`,
      productId: id,
      sku: v.sku,
      title: v.title,
      size: v.size,
      color: v.color,
      colorHex: v.colorHex || '#000000',
      priceMinor: v.priceMinor,
      compareAtPriceMinor: v.compareAtPriceMinor,
      stockQuantity: v.stockQuantity || 0,
    }));

    const images = input.images.map((img, i) => ({
      id: `img-${Date.now()}-${i}`,
      productId: id,
      url: img.url,
      altText: img.altText || input.name,
      sortOrder: img.sortOrder || i + 1,
      isPrimary: img.isPrimary ?? i === 0,
    }));

    const totalStock = variants.reduce((acc, v) => acc + v.stockQuantity, 0);

    const newProduct: Product = {
      id,
      name: input.name,
      slug,
      tagline: input.tagline,
      description: input.description,
      details: input.details || [],
      fabricCare: input.fabricCare || [],
      categoryId: input.categoryId,
      status: input.status || ProductStatus.PUBLISHED,
      featured: input.featured || false,
      isNewArrival: input.isNewArrival || false,
      basePriceMinor: input.basePriceMinor,
      compareAtPriceMinor: input.compareAtPriceMinor,
      images,
      variants,
      totalStock,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.db.products.unshift(newProduct);
    return newProduct;
  }

  async updateProduct(id: string, input: Partial<UpdateProductInput>): Promise<Product> {
    const product = this.db.products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Product '${id}' not found`);
    }

    if (input.name) product.name = input.name;
    if (input.tagline !== undefined) product.tagline = input.tagline;
    if (input.description) product.description = input.description;
    if (input.status) product.status = input.status;
    if (input.featured !== undefined) product.featured = input.featured;
    if (input.isNewArrival !== undefined) product.isNewArrival = input.isNewArrival;
    if (input.basePriceMinor !== undefined) product.basePriceMinor = input.basePriceMinor;
    if (input.compareAtPriceMinor !== undefined) product.compareAtPriceMinor = input.compareAtPriceMinor;

    product.updatedAt = new Date().toISOString();
    return product;
  }

  async adjustInventory(input: AdjustInventoryInput, actorId?: string): Promise<InventoryMovement> {
    let targetVariant: any;
    let targetProduct: Product | undefined;

    for (const prod of this.db.products) {
      const v = prod.variants.find((item) => item.id === input.variantId);
      if (v) {
        targetVariant = v;
        targetProduct = prod;
        break;
      }
    }

    if (!targetVariant || !targetProduct) {
      throw new NotFoundException('Variant not found');
    }

    const prev = targetVariant.stockQuantity;
    const newStock = prev + input.quantityDelta;

    if (newStock < 0) {
      throw new BadRequestException('Cannot reduce stock below zero');
    }

    targetVariant.stockQuantity = newStock;
    targetProduct.totalStock = targetProduct.variants.reduce((acc, v) => acc + v.stockQuantity, 0);

    const movement: InventoryMovement = {
      id: `mov-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      variantId: targetVariant.id,
      sku: targetVariant.sku,
      type: input.type || InventoryMovementType.MANUAL_ADJUSTMENT,
      quantityDelta: input.quantityDelta,
      previousQuantity: prev,
      newQuantity: newStock,
      reason: input.reason || 'Admin manual adjustment',
      performedBy: actorId,
      createdAt: new Date().toISOString(),
    };

    this.db.inventoryMovements.push(movement);
    return movement;
  }

  async getInventoryMovements(): Promise<InventoryMovement[]> {
    return this.db.inventoryMovements.slice(-50).reverse();
  }
}

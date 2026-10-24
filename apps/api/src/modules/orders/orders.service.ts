import {
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import { CartService } from '../cart/cart.service';
import { EmailService } from '../email/email.service';
import {
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  FulfillmentStatus,
  CheckoutInput,
  UserProfile,
  PaymentMethodType,
} from '@driptide/contracts';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);

  constructor(
    private readonly db: SupabaseService,
    private readonly cartService: CartService,
    private readonly emailService: EmailService,
  ) {}

  async checkout(
    cartKey: string,
    input: CheckoutInput,
    user?: UserProfile,
  ): Promise<Order> {
    const cart = await this.cartService.getCart(cartKey, user?.id);

    if (cart.items.length === 0) {
      throw new BadRequestException('Cannot checkout with an empty shopping bag');
    }

    if (!input.shippingAddress || !input.shippingAddress.fullName || !input.shippingAddress.street1) {
      throw new BadRequestException('A valid shipping address is required');
    }

    // Step 1: Validate stock & compute authoritative order items snapshot
    const orderItems: OrderItem[] = [];
    const stockDeductionList: { variantId: string; quantity: number }[] = [];

    const orderId = `ord-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const orderNumber = `DT-${Math.floor(10000 + Math.random() * 90000)}`;

    for (const item of cart.items) {
      // Find authoritative variant and product
      let authoritativePrice = item.unitPriceMinor;
      let variantTitle = item.variant.title;
      let sku = item.variant.sku;
      let productName = item.product.name;
      let imgUrl = item.product.images[0]?.url;

      for (const prod of this.db.products) {
        const v = prod.variants.find((variant) => variant.id === item.variantId);
        if (v) {
          authoritativePrice = v.priceMinor;
          variantTitle = v.title;
          sku = v.sku;
          productName = prod.name;
          imgUrl = prod.images[0]?.url;
          break;
        }
      }

      orderItems.push({
        id: `oi-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        orderId,
        productId: item.product.id,
        variantId: item.variantId,
        productName,
        variantTitle,
        sku,
        unitPriceMinor: authoritativePrice,
        quantity: item.quantity,
        totalPriceMinor: authoritativePrice * item.quantity,
        imageUrl: imgUrl,
      });

      stockDeductionList.push({
        variantId: item.variantId,
        quantity: item.quantity,
      });
    }

    // Step 2: Atomic Inventory Deduction
    try {
      await this.db.reserveAndDeductInventory(orderId, stockDeductionList);
    } catch (err: any) {
      this.logger.error(`Checkout failed inventory deduction: ${err.message}`);
      throw new BadRequestException(err.message || 'Inventory reservation failed');
    }

    // Step 3: Create authoritative Order entity
    const order: Order = {
      id: orderId,
      orderNumber,
      userId: user?.id || null,
      guestEmail: user ? null : input.guestEmail || null,
      customerName: input.shippingAddress.fullName,
      customerEmail: user?.email || input.guestEmail || 'customer@driptide.com',
      customerPhone: input.shippingAddress.phone,
      shippingAddress: input.shippingAddress,
      billingAddress: input.billingAddressSameAsShipping ? input.shippingAddress : input.billingAddress,
      status: OrderStatus.PROCESSING,
      paymentStatus:
        input.paymentMethod === PaymentMethodType.COD
          ? PaymentStatus.PENDING
          : PaymentStatus.CAPTURED,
      fulfillmentStatus: FulfillmentStatus.PROCESSING,
      currency: 'USD',
      subtotalMinor: cart.subtotalMinor,
      shippingMinor: cart.shippingMinor,
      taxMinor: cart.estimatedTaxMinor,
      discountMinor: cart.discountMinor,
      totalMinor: cart.totalMinor,
      couponCode: cart.couponCode || null,
      paymentMethod: input.paymentMethod || PaymentMethodType.CREDIT_CARD,
      items: orderItems,
      notes: input.notes || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save order
    this.db.orders.unshift(order);

    // Persist to Supabase when live credentials are configured
    this.db.saveOrderToDb(order).catch((err: Error) => {
      this.logger.error(`Supabase order persist failed for ${order.orderNumber}: ${err.message}`);
    });

    // Send order confirmation email (non-blocking — failure never stops the order)
    this.emailService.sendOrderConfirmation(order).catch((err: Error) => {
      this.logger.error(`Email dispatch failed for ${order.orderNumber}: ${err.message}`);
    });

    // Clear cart
    await this.cartService.clearCart(cartKey);

    return order;
  }

  async getOrderById(orderId: string, user?: UserProfile): Promise<Order> {
    const order = this.db.orders.find(
      (o) => o.id === orderId || o.orderNumber.toUpperCase() === orderId.toUpperCase(),
    );
    if (!order) {
      throw new NotFoundException(`Order '${orderId}' not found`);
    }

    // If user is not admin, verify ownership
    if (user && user.role !== 'admin' && order.userId && order.userId !== user.id) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async getCustomerOrders(userId: string): Promise<Order[]> {
    return this.db.orders.filter((o) => o.userId === userId);
  }

  async cancelOrder(orderId: string, user?: UserProfile, reason?: string): Promise<Order> {
    const order = await this.getOrderById(orderId, user);

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Order is already cancelled');
    }

    if (order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED) {
      throw new BadRequestException('Shipped orders cannot be cancelled directly. Initiate a return instead.');
    }

    order.status = OrderStatus.CANCELLED;
    order.notes = reason ? `Cancelled: ${reason}` : 'Cancelled by customer';
    order.updatedAt = new Date().toISOString();

    // Release and restore inventory atomically
    await this.db.releaseInventoryOnCancellation(
      order.id,
      order.items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
    );

    return order;
  }
}

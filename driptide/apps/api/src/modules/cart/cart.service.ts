import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { SupabaseService } from '../database/supabase.service';
import { Cart, CartItem, ProductVariant, Product } from '@driptide/contracts';

@Injectable()
export class CartService {
  constructor(private readonly db: SupabaseService) {}

  private getOrCreateCart(cartKey: string, userId?: string): Cart {
    let cart = this.db.carts.get(cartKey);
    if (!cart) {
      cart = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        userId: userId || null,
        sessionId: userId ? null : cartKey,
        items: [],
        itemCount: 0,
        subtotalMinor: 0,
        shippingMinor: 0,
        discountMinor: 0,
        estimatedTaxMinor: 0,
        totalMinor: 0,
        couponCode: null,
      };
      this.db.carts.set(cartKey, cart);
    }
    return cart;
  }

  private recalculateCart(cart: Cart) {
    let subtotal = 0;
    let count = 0;

    for (const item of cart.items) {
      item.totalPriceMinor = item.unitPriceMinor * item.quantity;
      subtotal += item.totalPriceMinor;
      count += item.quantity;
    }

    cart.itemCount = count;
    cart.subtotalMinor = subtotal;

    // Apply coupon discount if present
    let discount = 0;
    if (cart.couponCode) {
      const coupon = this.db.coupons.find(
        (c) => c.code.toUpperCase() === cart.couponCode?.toUpperCase() && c.isActive,
      );
      if (coupon) {
        if (!coupon.minSpendMinor || subtotal >= coupon.minSpendMinor) {
          if (coupon.discountType === 'percentage') {
            discount = Math.round((subtotal * coupon.discountValue) / 100);
            if (coupon.maxDiscountMinor && discount > coupon.maxDiscountMinor) {
              discount = coupon.maxDiscountMinor;
            }
          } else {
            discount = coupon.discountValue;
          }
        }
      } else {
        cart.couponCode = null;
      }
    }
    cart.discountMinor = Math.min(discount, subtotal);

    // Shipping rules: Free over $150 (15000 cents), else $15 (1500 cents)
    const afterDiscount = subtotal - cart.discountMinor;
    if (afterDiscount >= 15000 || count === 0) {
      cart.shippingMinor = 0;
    } else {
      cart.shippingMinor = 1500;
    }

    // Estimated tax (approx 8%)
    cart.estimatedTaxMinor = count === 0 ? 0 : Math.round(afterDiscount * 0.08);

    cart.totalMinor = afterDiscount + cart.shippingMinor + cart.estimatedTaxMinor;
  }

  async getCart(cartKey: string, userId?: string): Promise<Cart> {
    const cart = this.getOrCreateCart(cartKey, userId);
    this.recalculateCart(cart);
    return cart;
  }

  async addItem(
    cartKey: string,
    variantId: string,
    quantity: number,
    userId?: string,
  ): Promise<Cart> {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be greater than zero');
    }

    let foundProduct: Product | undefined;
    let foundVariant: ProductVariant | undefined;

    for (const prod of this.db.products) {
      const v = prod.variants.find((variant) => variant.id === variantId);
      if (v) {
        foundProduct = prod;
        foundVariant = v;
        break;
      }
    }

    if (!foundProduct || !foundVariant) {
      throw new NotFoundException(`Product variant not found`);
    }

    const cart = this.getOrCreateCart(cartKey, userId);
    const existingItem = cart.items.find((item) => item.variantId === variantId);

    const targetQuantity = (existingItem ? existingItem.quantity : 0) + quantity;
    if (targetQuantity > foundVariant.stockQuantity) {
      throw new BadRequestException(
        `Only ${foundVariant.stockQuantity} items in stock for this variant.`,
      );
    }

    if (existingItem) {
      existingItem.quantity = targetQuantity;
      existingItem.totalPriceMinor = existingItem.unitPriceMinor * existingItem.quantity;
    } else {
      const newItem: CartItem = {
        id: `citem-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        cartId: cart.id,
        variantId: foundVariant.id,
        product: foundProduct,
        variant: foundVariant,
        quantity,
        unitPriceMinor: foundVariant.priceMinor,
        totalPriceMinor: foundVariant.priceMinor * quantity,
      };
      cart.items.push(newItem);
    }

    this.recalculateCart(cart);
    return cart;
  }

  async updateQuantity(
    cartKey: string,
    itemId: string,
    quantity: number,
    userId?: string,
  ): Promise<Cart> {
    const cart = this.getOrCreateCart(cartKey, userId);
    const itemIndex = cart.items.findIndex((i) => i.id === itemId);

    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      const item = cart.items[itemIndex];
      if (quantity > item.variant.stockQuantity) {
        throw new BadRequestException(
          `Only ${item.variant.stockQuantity} items available in stock.`,
        );
      }
      item.quantity = quantity;
      item.totalPriceMinor = item.unitPriceMinor * quantity;
    }

    this.recalculateCart(cart);
    return cart;
  }

  async removeItem(cartKey: string, itemId: string, userId?: string): Promise<Cart> {
    const cart = this.getOrCreateCart(cartKey, userId);
    cart.items = cart.items.filter((i) => i.id !== itemId);
    this.recalculateCart(cart);
    return cart;
  }

  async applyCoupon(cartKey: string, code: string, userId?: string): Promise<Cart> {
    const cart = this.getOrCreateCart(cartKey, userId);
    const coupon = this.db.coupons.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive,
    );

    if (!coupon) {
      throw new BadRequestException('Invalid or expired coupon code');
    }

    cart.couponCode = coupon.code;
    this.recalculateCart(cart);
    return cart;
  }

  async removeCoupon(cartKey: string, userId?: string): Promise<Cart> {
    const cart = this.getOrCreateCart(cartKey, userId);
    cart.couponCode = null;
    this.recalculateCart(cart);
    return cart;
  }

  async clearCart(cartKey: string) {
    const cart = this.db.carts.get(cartKey);
    if (cart) {
      cart.items = [];
      cart.couponCode = null;
      this.recalculateCart(cart);
    }
  }
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Plus, Minus, Trash2, ArrowRight, Tag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatMoney } from '@/lib/utils';
import { getReferenceProductImage } from '@/lib/product-image';

export function CartDrawer() {
  const {
    cart,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    applyCoupon,
    removeCoupon,
    isLoading,
  } = useCart();
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const items = cart?.items || [];
  const subtotal = cart?.subtotalMinor || 0;
  const freeShippingThreshold = 15000; // $150
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));
  const amountRemaining = Math.max(0, freeShippingThreshold - subtotal);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;
    try {
      await applyCoupon(couponInput.trim());
      setCouponInput('');
    } catch (err: any) {
      setCouponError(err.message || 'Invalid coupon code');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#111111] text-black dark:text-white shadow-2xl flex flex-col justify-between">
          {/* Drawer Header */}
          <div className="p-6 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold tracking-[0.2em] uppercase">
                Shopping Bag ({cart?.itemCount || 0})
              </h2>
              <button
                onClick={closeCart}
                className="p-2 text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                aria-label="Close bag"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Free shipping progress bar */}
            <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800/60">
              <div className="flex justify-between text-xs tracking-wider uppercase mb-1.5 font-medium">
                {amountRemaining > 0 ? (
                  <span>
                    Add <strong className="font-bold">{formatMoney(amountRemaining)}</strong> for free
                    express shipping
                  </span>
                ) : (
                  <span className="text-emerald-500 font-bold">
                    ✓ You have unlocked free express delivery
                  </span>
                )}
                <span>{progressPercent}%</span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-black dark:bg-white h-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Items Content List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-12 h-12 mx-auto text-neutral-300 dark:text-neutral-700 flex items-center justify-center border border-dashed border-neutral-300 dark:border-neutral-700 rounded-full">
                  ✕
                </div>
                <p className="text-sm tracking-widest uppercase font-medium text-neutral-500">
                  Your bag is currently empty
                </p>
                <Link
                  href="/shop"
                  onClick={closeCart}
                  className="inline-block mt-4 px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-xs font-bold tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
                >
                  Explore New Arrivals
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex space-x-4 pb-6 border-b border-neutral-100 dark:border-neutral-800"
                >
                  {/* Item Image */}
                  <div className="w-20 h-26 flex-shrink-0 bg-neutral-100 dark:bg-neutral-900 relative overflow-hidden">
                    <img
                      src={getReferenceProductImage(item.product, item.product.images[0]?.url)}
                      alt={item.product.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <Link
                          href={`/product/${item.product.slug}`}
                          onClick={closeCart}
                          className="text-xs font-bold tracking-wider uppercase hover:underline line-clamp-1"
                        >
                          {item.product.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-neutral-400 hover:text-red-500 transition-colors ml-2"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-[11px] text-neutral-500 tracking-wider uppercase mt-1">
                        {item.variant.title}
                      </div>
                      <div className="text-xs font-semibold mt-1">
                        {formatMoney(item.unitPriceMinor)}
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex items-center space-x-3 mt-3">
                      <div className="flex items-center border border-neutral-200 dark:border-neutral-700">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-3 text-xs font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <span className="text-xs text-neutral-400 font-mono">
                        {formatMoney(item.totalPriceMinor)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-neutral-200 dark:border-neutral-800 space-y-4 bg-neutral-50 dark:bg-neutral-900/50">
              {/* Coupon Form */}
              {cart?.couponCode ? (
                <div className="flex items-center justify-between bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3 py-2 text-xs">
                  <div className="flex items-center text-emerald-700 dark:text-emerald-400 font-semibold tracking-wider uppercase">
                    <Tag className="w-3.5 h-3.5 mr-1.5" />
                    Code applied: {cart.couponCode} (-{formatMoney(cart.discountMinor)})
                  </div>
                  <button
                    onClick={() => removeCoupon()}
                    className="text-neutral-400 hover:text-black dark:hover:text-white text-xs underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter promo code (e.g. DRIP15)"
                    className="flex-1 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs tracking-wider uppercase focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-4 bg-neutral-800 hover:bg-black text-white text-xs font-bold tracking-wider uppercase"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs tracking-wider uppercase text-neutral-600 dark:text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-black dark:text-white font-medium">
                    {formatMoney(cart?.subtotalMinor || 0)}
                  </span>
                </div>
                {cart?.discountMinor ? (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Discount</span>
                    <span>-{formatMoney(cart.discountMinor)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span>
                    {cart?.shippingMinor === 0 ? 'FREE' : formatMoney(cart?.shippingMinor || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-black dark:text-white pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <span>Estimated Total</span>
                  <span>{formatMoney(cart?.totalMinor || 0)}</span>
                </div>
              </div>

              {/* Checkout Action */}
              <Link
                href="/checkout"
                onClick={closeCart}
                className="w-full py-4 bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-bold tracking-[0.2em] uppercase hover:opacity-90 transition-opacity"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

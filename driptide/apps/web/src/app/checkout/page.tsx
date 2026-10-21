'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { formatMoney } from '@/lib/utils';
import { getReferenceProductImage } from '@/lib/product-image';
import { api } from '@/lib/api';
import { PaymentMethodType } from '@driptide/contracts';
import { Lock, ArrowRight, ShieldCheck, Tag, CreditCard, Banknote } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, applyCoupon, removeCoupon, refreshCart } = useCart();

  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    street1: '',
    street2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    notes: '',
    paymentMethod: PaymentMethodType.CREDIT_CARD,
    cardNumber: '4242 •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '•••',
  });

  const [couponCode, setCouponCode] = useState('');
  const [couponMsg, setCouponMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const items = cart?.items || [];

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <h1 className="text-xl font-bold uppercase tracking-widest">Your Bag is Empty</h1>
        <p className="text-xs text-neutral-500 uppercase tracking-wider">
          Please add items to your shopping bag before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="inline-block px-8 py-3 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-widest hover:opacity-90"
        >
          Explore Shop
        </Link>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    try {
      await applyCoupon(couponCode.trim());
      setCouponMsg('Coupon applied successfully');
      setCouponCode('');
    } catch (err: any) {
      setCouponMsg(err.message || 'Invalid coupon code');
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.email || !formData.fullName || !formData.street1 || !formData.city || !formData.postalCode) {
      setErrorMessage('Please complete all required shipping fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const sessionId = localStorage.getItem('driptide_session_id') || 'guest-session';
      const order = await api.checkout(
        {
          shippingAddress: {
            fullName: formData.fullName,
            phone: formData.phone || '+1 555-019-2831',
            street1: formData.street1,
            street2: formData.street2,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country,
          },
          guestEmail: formData.email,
          paymentMethod: formData.paymentMethod,
          notes: formData.notes,
        },
        sessionId,
      );

      await refreshCart();
      router.push(`/order-confirmed/${order.id}`);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to process order. Please verify your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      <div className="flex items-center space-x-2 text-xs font-bold tracking-[0.2em] uppercase text-neutral-400 mb-6">
        <Lock className="w-3.5 h-3.5 text-emerald-500" />
        <span>Secure 256-Bit Encrypted Checkout</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Form: Customer & Shipping Details */}
        <div className="lg:col-span-7 space-y-10">
          <form onSubmit={handleSubmitOrder} className="space-y-8">
            {/* Contact Section */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-black dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2">
                1. Customer Contact
              </h2>
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="alexander@example.com"
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-4 py-2.5 text-xs text-black dark:text-white focus:outline-none focus:border-black tracking-wider"
                />
                <span className="text-[10px] text-neutral-400 mt-1 block">
                  Order confirmations and live courier dispatch tracking will be sent here.
                </span>
              </div>
            </div>

            {/* Delivery Address Section */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-black dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2">
                2. Shipping Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="Marcus Vance"
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-4 py-2.5 text-xs text-black dark:text-white focus:outline-none focus:border-black tracking-wider"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 019-2831"
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-4 py-2.5 text-xs text-black dark:text-white focus:outline-none focus:border-black tracking-wider"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="street1"
                  value={formData.street1}
                  onChange={handleInputChange}
                  required
                  placeholder="452 Broadway, Floor 4"
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-4 py-2.5 text-xs text-black dark:text-white focus:outline-none focus:border-black tracking-wider"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    placeholder="New York"
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-4 py-2.5 text-xs text-black dark:text-white focus:outline-none focus:border-black tracking-wider"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1">
                    State / Region
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="NY"
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-4 py-2.5 text-xs text-black dark:text-white focus:outline-none focus:border-black tracking-wider"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    required
                    placeholder="10013"
                    className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-4 py-2.5 text-xs text-black dark:text-white focus:outline-none focus:border-black tracking-wider"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method Section */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-black dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2">
                3. Payment Method
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: PaymentMethodType.CREDIT_CARD })}
                  className={`p-4 border text-left flex flex-col justify-between transition-colors ${
                    formData.paymentMethod === PaymentMethodType.CREDIT_CARD
                      ? 'border-black dark:border-white bg-neutral-50 dark:bg-neutral-900'
                      : 'border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mb-2 text-black dark:text-white" />
                  <span className="text-xs font-bold uppercase tracking-wider">Credit Card</span>
                  <span className="text-[10px] text-neutral-400">Visa, Mastercard, Amex</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: PaymentMethodType.COD })}
                  className={`p-4 border text-left flex flex-col justify-between transition-colors ${
                    formData.paymentMethod === PaymentMethodType.COD
                      ? 'border-black dark:border-white bg-neutral-50 dark:bg-neutral-900'
                      : 'border-neutral-200 dark:border-neutral-800'
                  }`}
                >
                  <Banknote className="w-5 h-5 mb-2 text-black dark:text-white" />
                  <span className="text-xs font-bold uppercase tracking-wider">Cash on Delivery</span>
                  <span className="text-[10px] text-neutral-400">Pay upon courier arrival</span>
                </button>
              </div>

              {formData.paymentMethod === PaymentMethodType.CREDIT_CARD && (
                <div className="p-4 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 space-y-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      disabled
                      value={formData.cardNumber}
                      className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs font-mono text-neutral-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
                        Expiry
                      </label>
                      <input
                        type="text"
                        disabled
                        value={formData.cardExp}
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs font-mono text-neutral-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1">
                        Security CVC
                      </label>
                      <input
                        type="text"
                        disabled
                        value={formData.cardCvc}
                        className="w-full bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs font-mono text-neutral-500"
                      />
                    </div>
                  </div>
                  <span className="text-[10px] text-neutral-400 block pt-1">
                    ⚡ Integrated secure payment simulation environment (Mock Gateway ready for live Stripe keys)
                  </span>
                </div>
              )}
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs tracking-wider">
                {errorMessage}
              </div>
            )}

            {/* Place Order CTA */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-black dark:bg-white text-white dark:text-black text-xs font-bold tracking-[0.25em] uppercase hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <span>Authorizing & Deducting Inventory...</span>
              ) : (
                <>
                  <span>Place Order • {formatMoney(cart?.totalMinor || 0)}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Order Summary & Coupon */}
        <div className="lg:col-span-5 bg-neutral-50 dark:bg-neutral-900/40 p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 self-start space-y-6">
          <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-black dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-3">
            Bag Summary ({cart?.itemCount})
          </h3>

          {/* Items Preview */}
          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex space-x-3 text-xs">
                <div className="w-14 h-18 bg-neutral-200 dark:bg-neutral-800 flex-shrink-0 overflow-hidden">
                  <img
                    src={getReferenceProductImage(item.product, item.product.images[0]?.url)}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold tracking-wider uppercase line-clamp-1">
                      {item.product.name}
                    </h4>
                    <span className="text-[10px] text-neutral-400 uppercase">
                      {item.variant.title} (x{item.quantity})
                    </span>
                  </div>
                  <span className="font-semibold">{formatMoney(item.totalPriceMinor)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Promo Code Input */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800">
            {cart?.couponCode ? (
              <div className="flex justify-between items-center bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 px-3 py-2 text-xs">
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold tracking-wider uppercase flex items-center">
                  <Tag className="w-3.5 h-3.5 mr-1.5" />
                  Code {cart.couponCode} applied
                </span>
                <button
                  type="button"
                  onClick={() => removeCoupon()}
                  className="text-neutral-400 hover:text-black dark:hover:text-white underline text-[11px]"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="flex">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Promo Code (e.g. DRIP15)"
                  className="flex-1 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs tracking-wider uppercase focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 bg-neutral-800 hover:bg-black text-white text-xs font-bold uppercase tracking-wider"
                >
                  Apply
                </button>
              </form>
            )}
            {couponMsg && (
              <span className="text-[10px] text-neutral-500 mt-1 block tracking-wider uppercase">
                {couponMsg}
              </span>
            )}
          </div>

          {/* Breakdown */}
          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2 text-xs tracking-wider uppercase text-neutral-600 dark:text-neutral-400">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-black dark:text-white">
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
              <span>Delivery</span>
              <span>
                {cart?.shippingMinor === 0 ? 'FREE' : formatMoney(cart?.shippingMinor || 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Estimated Sales Tax</span>
              <span>{formatMoney(cart?.estimatedTaxMinor || 0)}</span>
            </div>
            <div className="flex justify-between text-sm font-black text-black dark:text-white pt-3 border-t border-neutral-200 dark:border-neutral-800">
              <span>Total Payable</span>
              <span>{formatMoney(cart?.totalMinor || 0)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

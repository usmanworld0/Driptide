'use client';

import React, { useEffect, useState, use, Suspense } from 'react';
import Link from 'next/link';
import { Order } from '@driptide/contracts';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/utils';
import { CheckCircle2, Package, Truck, ArrowRight } from 'lucide-react';

function OrderConfirmedContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        const data = await api.getOrder(id);
        setOrder(data);
      } catch (err) {
        console.error('Failed to load order:', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-black dark:border-white border-t-transparent" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-24 text-center space-y-4">
        <h1 className="text-xl font-bold uppercase tracking-widest">Order Not Found</h1>
        <Link href="/shop" className="underline text-xs uppercase tracking-wider">
          Return to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="store-info-page store-info-page--confirmation max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-20 space-y-10">
      {/* Success Banner */}
      <div className="text-center space-y-3 pb-8 border-b border-neutral-200 dark:border-neutral-800">
        <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <span className="text-xs font-bold tracking-[0.25em] uppercase text-emerald-600 dark:text-emerald-400 block">
          Order Confirmed & Paid
        </span>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
          Thank you, {order.customerName}
        </h1>
        <p className="text-xs text-neutral-500 uppercase tracking-wider">
          Order reference: <strong className="text-black dark:text-white font-mono">{order.orderNumber}</strong>
        </p>
      </div>

      {/* Fulfillment Status Steps */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 text-xs uppercase tracking-wider">
        <div className="flex items-center space-x-3">
          <Package className="w-5 h-5 text-emerald-500 flex-shrink-0" />
          <div>
            <span className="font-bold block text-black dark:text-white">Status: {order.status}</span>
            <span className="text-[10px] text-neutral-400">Being tailored & packed</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <Truck className="w-5 h-5 text-neutral-400 flex-shrink-0" />
          <div>
            <span className="font-bold block text-black dark:text-white">
              {order.trackingNumber ? `${order.courier}: ${order.trackingNumber}` : 'Courier Dispatch Pending'}
            </span>
            <span className="text-[10px] text-neutral-400">2-4 business days express</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 rounded-full border border-neutral-400 flex items-center justify-center text-[10px] font-bold">
            ✉
          </div>
          <div>
            <span className="font-bold block text-black dark:text-white">Dispatch Notification</span>
            <span className="text-[10px] text-neutral-400 truncate max-w-[180px] block">{order.customerEmail}</span>
          </div>
        </div>
      </div>

      {/* Itemized Snapshot */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-black dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-2">
          Purchased Silhouettes
        </h3>
        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 flex justify-between items-center text-xs">
              <div className="flex items-center space-x-4">
                {item.imageUrl && (
                  <div className="w-14 h-18 bg-neutral-100 dark:bg-neutral-900 flex-shrink-0 overflow-hidden">
                    <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover" />
                  </div>
                )}
                <div>
                  <h4 className="font-bold uppercase tracking-wider">{item.productName}</h4>
                  <span className="text-[10px] text-neutral-400 uppercase">
                    {item.variantTitle} • SKU: {item.sku} (Qty: {item.quantity})
                  </span>
                </div>
              </div>
              <span className="font-semibold">{formatMoney(item.totalPriceMinor)}</span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-1.5 text-xs uppercase tracking-wider text-neutral-500">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatMoney(order.subtotalMinor)}</span>
          </div>
          {order.discountMinor > 0 && (
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
              <span>Coupon Discount ({order.couponCode})</span>
              <span>-{formatMoney(order.discountMinor)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{order.shippingMinor === 0 ? 'FREE' : formatMoney(order.shippingMinor)}</span>
          </div>
          <div className="flex justify-between">
            <span>Taxes</span>
            <span>{formatMoney(order.taxMinor)}</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-black dark:text-white pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <span>Total Charged</span>
            <span>{formatMoney(order.totalMinor)}</span>
          </div>
        </div>
      </div>

      {/* Return to shop */}
      <div className="pt-6 text-center">
        <Link
          href="/shop"
          className="inline-flex items-center px-8 py-4 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-[0.2em] hover:opacity-90"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}

export default function OrderConfirmedPage(props: { params: Promise<{ id: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="py-32 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-black dark:border-white border-t-transparent" />
        </div>
      }
    >
      <OrderConfirmedContent {...props} />
    </Suspense>
  );
}

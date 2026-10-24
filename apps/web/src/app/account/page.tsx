'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/utils';
import { Order, OrderStatus } from '@driptide/contracts';
import { User, Package, MapPin, ExternalLink, ArrowRight } from 'lucide-react';

export default function AccountPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAccount() {
      try {
        setLoading(true);
        // Load recent orders as customer view
        const data = await api.getAdminOrders(); // View orders
        setOrders(data);
      } catch (err) {
        console.error('Failed to load customer orders:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAccount();
  }, []);

  return (
    <div className="store-info-page store-info-page--account max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      {/* Profile Header */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 pb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-400 uppercase">
            Client Portal
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight mt-1">
            My Account
          </h1>
          <p className="text-xs text-neutral-500 uppercase tracking-wider mt-1">
            Welcome back • customer@driptide.com
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href="/shop"
            className="px-6 py-2.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider hover:opacity-90"
          >
            Explore Shop
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Orders History */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-black dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-3 flex items-center">
            <Package className="w-4 h-4 mr-2" />
            Order History ({orders.length})
          </h2>

          {loading ? (
            <div className="py-16 text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-black dark:border-white border-t-transparent" />
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center space-y-3 bg-neutral-50 dark:bg-neutral-900/40 p-8 border border-neutral-200 dark:border-neutral-800">
              <p className="text-xs uppercase tracking-widest text-neutral-500">
                You haven't placed any orders yet.
              </p>
              <Link
                href="/shop"
                className="inline-block text-xs font-bold uppercase underline tracking-wider"
              >
                Start Shopping →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                    <div>
                      <span className="text-xs font-mono font-bold text-black dark:text-white">
                        {order.orderNumber}
                      </span>
                      <span className="text-[10px] text-neutral-400 uppercase ml-3">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${
                          order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                        }`}
                      >
                        {order.status}
                      </span>
                      <Link
                        href={`/order-confirmed/${order.id}`}
                        className="text-xs font-bold uppercase underline flex items-center hover:opacity-75"
                      >
                        Details
                        <ExternalLink className="w-3 h-3 ml-1" />
                      </Link>
                    </div>
                  </div>

                  {/* Order items preview */}
                  <div className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
                    {order.items.map((item) => (
                      <div key={item.id} className="py-2 flex justify-between items-center text-xs">
                        <span className="font-semibold uppercase tracking-wider">
                          {item.productName} ({item.variantTitle}) × {item.quantity}
                        </span>
                        <span className="font-mono text-neutral-500">
                          {formatMoney(item.totalPriceMinor)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Summary & Courier */}
                  <div className="flex flex-wrap items-center justify-between pt-2 text-xs uppercase tracking-wider">
                    <div className="text-neutral-500 text-[11px]">
                      {order.trackingNumber ? (
                        <span className="text-black dark:text-white font-bold">
                          Tracking: {order.courier} ({order.trackingNumber})
                        </span>
                      ) : (
                        <span>Processing in atelier</span>
                      )}
                    </div>
                    <div className="font-black text-sm text-black dark:text-white">
                      Total: {formatMoney(order.totalMinor)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Customer Details & Addresses */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-black dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-3 flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            Saved Shipping Details
          </h2>
          <div className="bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 p-6 space-y-3 text-xs uppercase tracking-wider">
            <span className="text-[10px] font-bold text-neutral-400 block">Default Destination</span>
            <div className="font-bold text-black dark:text-white">Marcus Vance</div>
            <div className="text-neutral-500 leading-relaxed font-light">
              452 Broadway, Apt 4B <br />
              New York, NY 10013 <br />
              United States
            </div>
            <div className="text-[11px] text-neutral-400 pt-1">+1 (555) 234-5678</div>
          </div>

          <div className="bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 p-6 space-y-2 text-xs uppercase tracking-wider">
            <span className="text-[10px] font-bold text-neutral-400 block">Driptide Membership</span>
            <div className="font-bold text-black dark:text-white">VIP Tier • Atelier Access</div>
            <p className="text-[11px] text-neutral-500 font-light leading-relaxed">
              Complimentary worldwide express shipping on all orders and 24-hour private access to
              archive releases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

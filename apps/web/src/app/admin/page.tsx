'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/utils';
import {
  AdminAnalyticsMetrics,
  Order,
  Product,
  OrderStatus,
  InventoryMovementType,
} from '@driptide/contracts';
import {
  DollarSign,
  Package,
  AlertTriangle,
  Users,
  CheckCircle,
  Truck,
  Plus,
  RefreshCw,
  Search,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<AdminAnalyticsMetrics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'inventory'>('overview');
  const [loading, setLoading] = useState(true);

  // Fulfillment dialog state
  const [fulfillingOrderId, setFulfillingOrderId] = useState<string | null>(null);
  const [courier, setCourier] = useState('DHL Express');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  // Stock adjustment modal state
  const [adjustingVariantId, setAdjustingVariantId] = useState<string | null>(null);
  const [adjustmentDelta, setAdjustmentDelta] = useState(10);
  const [adjustmentReason, setAdjustmentReason] = useState('Factory Restock');

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [m, ords, prods] = await Promise.all([
        api.getAdminMetrics(),
        api.getAdminOrders(),
        api.getProducts(),
      ]);
      setMetrics(m);
      setOrders(ords);
      setProducts(prods);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleFulfillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fulfillingOrderId || !trackingNumber.trim()) return;
    try {
      await api.fulfillOrder(fulfillingOrderId, courier, trackingNumber.trim());
      setActionSuccess(`Order fulfilled with ${courier} tracking #${trackingNumber}`);
      setFulfillingOrderId(null);
      setTrackingNumber('');
      await loadAdminData();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Fulfillment update failed');
    }
  };

  const handleStockAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustingVariantId) return;
    try {
      await api.adjustInventory({
        variantId: adjustingVariantId,
        quantityDelta: Number(adjustmentDelta),
        type: InventoryMovementType.RESTOCK,
        reason: adjustmentReason,
      });
      setActionSuccess('Inventory adjusted and movement logged.');
      setAdjustingVariantId(null);
      await loadAdminData();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Inventory adjustment failed');
    }
  };

  if (loading && !metrics) {
    return (
      <div className="py-32 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-black dark:border-white border-t-transparent" />
        <p className="text-xs uppercase tracking-widest text-neutral-400 mt-4">
          Loading Admin Operations Center...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-neutral-200 dark:border-neutral-800 gap-4">
        <div>
          <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-400 uppercase">
            Internal Operations Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mt-1">
            Driptide Command Center
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={loadAdminData}
            className="p-2 border border-neutral-300 dark:border-neutral-700 hover:border-black text-neutral-600 dark:text-neutral-400 rounded transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <div className="flex border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 p-1 text-xs font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-1.5 transition-colors ${
                activeTab === 'overview'
                  ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              Metrics
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-1.5 transition-colors ${
                activeTab === 'orders'
                  ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-1.5 transition-colors ${
                activeTab === 'inventory'
                  ? 'bg-white dark:bg-black text-black dark:text-white shadow-xs'
                  : 'text-neutral-500 hover:text-black dark:hover:text-white'
              }`}
            >
              Inventory
            </button>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-bold tracking-wider uppercase">
          ✓ {actionSuccess}
        </div>
      )}

      {/* Overview Metrics Cards */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
              <div className="flex justify-between items-center text-neutral-400 text-xs font-bold tracking-widest uppercase">
                <span>Total Revenue</span>
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black">
                {formatMoney(metrics?.totalRevenueMinor || 0)}
              </div>
              <span className="text-[10px] text-emerald-500 font-semibold tracking-wider">
                Authoritative settled sales
              </span>
            </div>

            <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
              <div className="flex justify-between items-center text-neutral-400 text-xs font-bold tracking-widest uppercase">
                <span>Orders Processed</span>
                <Package className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black">{metrics?.totalOrders || 0}</div>
              <span className="text-[10px] text-neutral-500 tracking-wider">
                {metrics?.pendingOrdersCount} pending fulfillment
              </span>
            </div>

            <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
              <div className="flex justify-between items-center text-neutral-400 text-xs font-bold tracking-widest uppercase">
                <span>Low Stock Alerts</span>
                <AlertTriangle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {metrics?.lowStockItemsCount || 0}
              </div>
              <span className="text-[10px] text-neutral-500 tracking-wider">
                Variants below 15 units
              </span>
            </div>

            <div className="p-6 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-2">
              <div className="flex justify-between items-center text-neutral-400 text-xs font-bold tracking-widest uppercase">
                <span>Customers</span>
                <Users className="w-4 h-4" />
              </div>
              <div className="text-2xl font-black">{metrics?.totalCustomers || 0}</div>
              <span className="text-[10px] text-neutral-500 tracking-wider">
                Active customer profiles
              </span>
            </div>
          </div>

          {/* Top Selling Products & Recent Orders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Selling Silhouettes */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-black dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-3">
                Top Performing Silhouettes
              </h3>
              <div className="space-y-4">
                {metrics?.topSellingProducts.map((p) => (
                  <div key={p.productId} className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      {p.imageUrl && (
                        <div className="w-10 h-14 bg-neutral-200 dark:bg-neutral-800 overflow-hidden flex-shrink-0">
                          <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold uppercase tracking-wider">{p.name}</h4>
                        <span className="text-[10px] text-neutral-400">{p.unitsSold} units dispatched</span>
                      </div>
                    </div>
                    <span className="font-bold">{formatMoney(p.revenueMinor)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions & System Status */}
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
              <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-black dark:text-white border-b border-neutral-200 dark:border-neutral-800 pb-3">
                Infrastructure & Environment
              </h3>
              <div className="space-y-3 text-xs tracking-wider uppercase text-neutral-500">
                <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-800">
                  <span>NestJS API Engine</span>
                  <span className="text-emerald-500 font-bold">ONLINE (v1)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-800">
                  <span>Atomic Stock Protection</span>
                  <span className="text-emerald-500 font-bold">ACTIVE (SERIALIZED)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-neutral-100 dark:border-neutral-800">
                  <span>Supabase Database</span>
                  <span className="text-black dark:text-white font-bold">CONFIGURED</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span>Active Currency</span>
                  <span className="text-black dark:text-white font-bold">USD ($)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs uppercase tracking-wider">
              <thead className="bg-neutral-50 dark:bg-neutral-800 font-bold border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="p-4">Order #</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Tracking</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                    <td className="p-4 font-mono font-bold text-black dark:text-white">
                      {o.orderNumber}
                    </td>
                    <td className="p-4">
                      <span className="font-bold block">{o.customerName}</span>
                      <span className="text-[10px] text-neutral-400 lowercase">{o.customerEmail}</span>
                    </td>
                    <td className="p-4 text-neutral-500">{o.items.length} items</td>
                    <td className="p-4 font-bold">{formatMoney(o.totalMinor)}</td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 text-[10px] font-bold rounded ${
                          o.status === OrderStatus.SHIPPED || o.status === OrderStatus.DELIVERED
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400'
                            : o.status === OrderStatus.PROCESSING
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400'
                            : 'bg-neutral-200 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-400 font-mono text-[11px]">
                      {o.trackingNumber ? `${o.courier} ${o.trackingNumber}` : '—'}
                    </td>
                    <td className="p-4 text-right">
                      {o.status !== OrderStatus.SHIPPED && o.status !== OrderStatus.DELIVERED && (
                        <button
                          onClick={() => setFulfillingOrderId(o.id)}
                          className="px-3 py-1.5 bg-black dark:bg-white text-white dark:text-black font-bold text-[10px] uppercase hover:opacity-80"
                        >
                          Fulfill & Track
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inventory Tab */}
      {activeTab === 'inventory' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs uppercase tracking-wider">
              <thead className="bg-neutral-50 dark:bg-neutral-800 font-bold border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="p-4">Silhouette</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Size & Color</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock In Hand</th>
                  <th className="p-4 text-right">Adjust Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                {products.flatMap((prod) =>
                  prod.variants.map((v) => (
                    <tr key={v.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                      <td className="p-4 font-bold text-black dark:text-white">
                        {prod.name}
                      </td>
                      <td className="p-4 font-mono text-neutral-400">{v.sku}</td>
                      <td className="p-4">{v.title}</td>
                      <td className="p-4 font-semibold">{formatMoney(v.priceMinor)}</td>
                      <td className="p-4">
                        <span
                          className={`font-bold ${
                            v.stockQuantity <= 10 ? 'text-amber-600 font-black' : ''
                          }`}
                        >
                          {v.stockQuantity} units
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setAdjustingVariantId(v.id)}
                          className="px-3 py-1 border border-neutral-300 dark:border-neutral-700 text-[10px] font-bold hover:border-black"
                        >
                          + Restock
                        </button>
                      </td>
                    </tr>
                  )),
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fulfill Order Modal */}
      {fulfillingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 max-w-md w-full p-6 space-y-4">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase">
              Fulfill Order & Assign Courier
            </h3>
            <form onSubmit={handleFulfillSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1">
                  Courier Service
                </label>
                <select
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs font-bold uppercase tracking-wider"
                >
                  <option value="DHL Express">DHL Express Priority</option>
                  <option value="FedEx International">FedEx International</option>
                  <option value="UPS Worldwide Saver">UPS Worldwide Saver</option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1">
                  Tracking Number *
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  required
                  placeholder="e.g. DHL-982310924"
                  className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs font-mono uppercase"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider"
                >
                  Confirm Shipment
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillingOrderId(null)}
                  className="px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 text-xs font-bold uppercase"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Inventory Modal */}
      {adjustingVariantId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 max-w-md w-full p-6 space-y-4">
            <h3 className="text-xs font-bold tracking-[0.2em] uppercase">
              Auditable Stock Adjustment
            </h3>
            <form onSubmit={handleStockAdjustSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1">
                  Quantity To Add / Adjust (+/-)
                </label>
                <input
                  type="number"
                  value={adjustmentDelta}
                  onChange={(e) => setAdjustmentDelta(Number(e.target.value))}
                  required
                  className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs font-bold"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1">
                  Audit Reason
                </label>
                <input
                  type="text"
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  required
                  className="w-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs"
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider"
                >
                  Record Adjustment
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustingVariantId(null)}
                  className="px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 text-xs font-bold uppercase"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

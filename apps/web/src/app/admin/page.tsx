'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/utils';
import {
  AdminAnalyticsMetrics,
  Order,
  Product,
  Category,
  Coupon,
  OrderStatus,
  InventoryMovementType,
  ProductStatus,
  CreateProductInput,
} from '@driptide/contracts';
import {
  Home,
  Package,
  Layers,
  FileText,
  Tag,
  Warehouse,
  Settings,
  ExternalLink,
  Search,
  Check,
  Clock,
  AlertTriangle,
  Users,
  ChevronDown,
  Truck,
  RefreshCw,
  X,
  Plus,
  ShoppingBag,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Percent,
  DollarSign,
  ArrowRight,
  Sparkles,
  Flame,
  CheckCircle2,
} from 'lucide-react';

type AdminTab =
  | 'overview'
  | 'products'
  | 'categories'
  | 'orders'
  | 'discounts'
  | 'inventory'
  | 'settings';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<AdminAnalyticsMetrics | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [activeNav, setActiveNav] = useState<AdminTab>('overview');
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [productGenderFilter, setProductGenderFilter] = useState<string>('all');
  const [productCategoryFilter, setProductCategoryFilter] = useState<string>('all');

  // Feedback notifications
  const [actionSuccess, setActionSuccess] = useState('');

  // 1. Fulfillment Modal State
  const [fulfillingOrderId, setFulfillingOrderId] = useState<string | null>(null);
  const [courier, setCourier] = useState('DHL Express Worldwide');
  const [trackingNumber, setTrackingNumber] = useState('');

  // 2. Stock Adjustment Modal State
  const [adjustingVariantId, setAdjustingVariantId] = useState<string | null>(null);
  const [adjustmentDelta, setAdjustmentDelta] = useState(15);
  const [adjustmentReason, setAdjustmentReason] = useState('Factory Restock');

  // 3. New Product Modal State
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProductName, setNewProductName] = useState('');
  const [newProductTagline, setNewProductTagline] = useState('');
  const [newProductDesc, setNewProductDesc] = useState('');
  const [newProductGender, setNewProductGender] = useState<'men' | 'women' | 'juniors' | 'unisex'>('men');
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newProductSubCategory, setNewProductSubCategory] = useState('');
  const [newProductBasePrice, setNewProductBasePrice] = useState('79');
  const [newProductComparePrice, setNewProductComparePrice] = useState('110');
  const [newProductImageUrl, setNewProductImageUrl] = useState('');
  const [newProductIsNewDrop, setNewProductIsNewDrop] = useState(true);
  const [newProductIsFeatured, setNewProductIsFeatured] = useState(false);
  const [newProductStockXS, setNewProductStockXS] = useState(20);
  const [newProductStockS, setNewProductStockS] = useState(35);
  const [newProductStockM, setNewProductStockM] = useState(50);
  const [newProductStockL, setNewProductStockL] = useState(40);
  const [newProductStockXL, setNewProductStockXL] = useState(25);
  const [newProductColorName, setNewProductColorName] = useState('Washed Charcoal');
  const [newProductColorHex, setNewProductColorHex] = useState('#2A2B2E');

  // 4. New Coupon Modal State
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'fixed'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState('20');
  const [newCouponMinSpend, setNewCouponMinSpend] = useState('50');
  const [newCouponMaxDiscount, setNewCouponMaxDiscount] = useState('50');
  const [newCouponLimit, setNewCouponLimit] = useState('500');

  // 5. New Category Modal State
  const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatGender, setNewCatGender] = useState('men');

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [m, ords, prods, cats] = await Promise.all([
        api.getAdminMetrics().catch(() => null),
        api.getAdminOrders().catch(() => []),
        api.getAdminProducts().catch(() => []),
        api.getCategories().catch(() => []),
      ]);

      if (m) setMetrics(m);
      if (ords) setOrders(ords);
      if (prods) setProducts(prods);
      if (cats) setCategories(cats);

      // Fetch or initialize coupons
      try {
        const cpList = await api.getAdminCoupons();
        setCoupons(cpList);
      } catch {
        // Fallback default fashion coupons
        setCoupons([
          {
            id: 'cp-drip15',
            code: 'DRIP15',
            discountType: 'percentage',
            discountValue: 15,
            minSpendMinor: 5000,
            maxDiscountMinor: 5000,
            usageLimit: 1000,
            usageCount: 142,
            isActive: true,
          },
          {
            id: 'cp-season20',
            code: 'SEASON20',
            discountType: 'percentage',
            discountValue: 20,
            minSpendMinor: 10000,
            maxDiscountMinor: 8000,
            usageLimit: 500,
            usageCount: 89,
            isActive: true,
          },
          {
            id: 'cp-vip30',
            code: 'VIPDROP30',
            discountType: 'fixed',
            discountValue: 3000,
            minSpendMinor: 15000,
            maxDiscountMinor: 3000,
            usageLimit: 250,
            usageCount: 64,
            isActive: true,
          },
        ]);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Handlers
  const handleFulfillSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fulfillingOrderId || !trackingNumber.trim()) return;
    try {
      await api.fulfillOrder(fulfillingOrderId, courier, trackingNumber.trim());
      setActionSuccess(`Order fulfilled via ${courier} (Tracking #${trackingNumber})`);
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
      setActionSuccess('Stock movement logged & variant inventory updated.');
      setAdjustingVariantId(null);
      await loadAdminData();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Inventory adjustment failed');
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const baseMinor = Math.round(parseFloat(newProductBasePrice || '0') * 100);
    const compMinor = newProductComparePrice ? Math.round(parseFloat(newProductComparePrice) * 100) : undefined;
    const slug = newProductName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const productPayload: CreateProductInput = {
      name: newProductName.trim(),
      slug,
      tagline: newProductTagline.trim() || `${newProductGender.toUpperCase()} FW 2026`,
      description: newProductDesc.trim() || 'Modern architectural silhouette with relaxed drop shoulder fit and premium heavyweight fabric.',
      categoryId: newProductCategory || categories[0]?.id || 'cat-1',
      status: ProductStatus.PUBLISHED,
      featured: newProductIsFeatured,
      isNewArrival: newProductIsNewDrop,
      basePriceMinor: baseMinor,
      compareAtPriceMinor: compMinor,
      images: [
        {
          url:
            newProductImageUrl.trim() ||
            'https://outfitters.com.pk/cdn/shop/files/Men_Web_0cb72726-eac6-417c-a086-d902db00cc28.jpg?v=1792147448&width=700',
          sortOrder: 1,
          isPrimary: true,
        },
      ],
      variants: [
        { sku: `${slug.toUpperCase()}-XS`, title: `XS / ${newProductColorName}`, size: 'XS', color: newProductColorName, colorHex: newProductColorHex, priceMinor: baseMinor, stockQuantity: newProductStockXS },
        { sku: `${slug.toUpperCase()}-S`, title: `S / ${newProductColorName}`, size: 'S', color: newProductColorName, colorHex: newProductColorHex, priceMinor: baseMinor, stockQuantity: newProductStockS },
        { sku: `${slug.toUpperCase()}-M`, title: `M / ${newProductColorName}`, size: 'M', color: newProductColorName, colorHex: newProductColorHex, priceMinor: baseMinor, stockQuantity: newProductStockM },
        { sku: `${slug.toUpperCase()}-L`, title: `L / ${newProductColorName}`, size: 'L', color: newProductColorName, colorHex: newProductColorHex, priceMinor: baseMinor, stockQuantity: newProductStockL },
        { sku: `${slug.toUpperCase()}-XL`, title: `XL / ${newProductColorName}`, size: 'XL', color: newProductColorName, colorHex: newProductColorHex, priceMinor: baseMinor, stockQuantity: newProductStockXL },
      ],
    };

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, {
          name: newProductName.trim(),
          basePriceMinor: baseMinor,
          compareAtPriceMinor: compMinor,
          isNewArrival: newProductIsNewDrop,
          featured: newProductIsFeatured,
        });
        setActionSuccess(`Silhouette "${newProductName}" updated successfully.`);
      } else {
        await api.createProduct(productPayload);
        setActionSuccess(`New silhouette "${newProductName}" added to ${newProductGender.toUpperCase()} catalog.`);
      }

      setShowAddProductModal(false);
      setEditingProduct(null);
      resetProductForm();
      await loadAdminData();
      setTimeout(() => setActionSuccess(''), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to save product');
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    const val = parseFloat(newCouponValue);
    const minSpend = Math.round(parseFloat(newCouponMinSpend || '0') * 100);
    const maxDiscount = newCouponMaxDiscount ? Math.round(parseFloat(newCouponMaxDiscount) * 100) : undefined;

    const newCp: Coupon = {
      id: `cp-${Date.now()}`,
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      discountValue: newCouponType === 'percentage' ? val : Math.round(val * 100),
      minSpendMinor: minSpend,
      maxDiscountMinor: maxDiscount,
      usageLimit: parseInt(newCouponLimit || '1000', 10),
      usageCount: 0,
      isActive: true,
    };

    try {
      await api.createCoupon(newCp);
    } catch {
      // Local fallback
      setCoupons((prev) => [newCp, ...prev]);
    }

    setActionSuccess(`Promo code "${newCouponCode.toUpperCase()}" published.`);
    setShowAddCouponModal(false);
    setNewCouponCode('');
    await loadAdminData();
    setTimeout(() => setActionSuccess(''), 4000);
  };

  const handleToggleCoupon = async (id: string) => {
    try {
      await api.toggleCoupon(id);
    } catch {
      setCoupons((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)),
      );
    }
    setActionSuccess('Discount code status toggled.');
    setTimeout(() => setActionSuccess(''), 3000);
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const cat: Category = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      slug: newCatSlug.trim() || newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newCatDesc.trim() || `${newCatGender.toUpperCase()} fashion collection`,
      imageUrl: 'https://outfitters.com.pk/cdn/shop/files/T_shirts_6314b1fd-2230-4dcb-8281-a2187f998bcc.jpg?v=1790321039&width=700',
      sortOrder: categories.length + 1,
      isActive: true,
    };
    setCategories((prev) => [...prev, cat]);
    setActionSuccess(`Category "${newCatName}" created for ${newCatGender.toUpperCase()}.`);
    setShowAddCategoryModal(false);
    setNewCatName('');
    setNewCatSlug('');
    setNewCatDesc('');
    setTimeout(() => setActionSuccess(''), 4000);
  };

  const resetProductForm = () => {
    setNewProductName('');
    setNewProductTagline('');
    setNewProductDesc('');
    setNewProductBasePrice('79');
    setNewProductComparePrice('110');
    setNewProductImageUrl('');
    setNewProductIsNewDrop(true);
    setNewProductIsFeatured(false);
  };

  const openEditProduct = (p: Product) => {
    setEditingProduct(p);
    setNewProductName(p.name);
    setNewProductTagline(p.tagline || '');
    setNewProductDesc(p.description);
    setNewProductBasePrice((p.basePriceMinor / 100).toString());
    setNewProductComparePrice(p.compareAtPriceMinor ? (p.compareAtPriceMinor / 100).toString() : '');
    setNewProductImageUrl(p.images[0]?.url || '');
    setNewProductIsNewDrop(p.isNewArrival);
    setNewProductIsFeatured(p.featured);
    setShowAddProductModal(true);
  };

  // Filtered views
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.slug.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        productCategoryFilter === 'all' || prod.category?.slug === productCategoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, productCategoryFilter]);

  const readyToShipCount = useMemo(() => {
    return orders.filter(
      (o) => o.status === OrderStatus.PENDING || o.status === OrderStatus.PROCESSING,
    ).length;
  }, [orders]);

  if (loading && !metrics) {
    return (
      <div className="admin-page min-h-screen bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin mb-4" />
        <p className="text-xs font-bold tracking-[0.25em] uppercase text-neutral-400">
          Initializing Driptide Command Center…
        </p>
      </div>
    );
  }

  return (
    <div className="admin-page min-h-screen bg-[#F8F9FA] text-[#111111] flex flex-col lg:flex-row p-3 sm:p-5 lg:p-6 gap-5 lg:gap-6 font-sans antialiased">
      {/* 1. Left Vertical Matte Black Pill Navigation */}
      <aside className="w-full lg:w-20 bg-[#0A0A0A] rounded-3xl lg:rounded-[36px] p-3 sm:p-4 flex lg:flex-col items-center justify-between text-white shadow-2xl border border-neutral-800 flex-shrink-0 z-20">
        <div className="flex lg:flex-col items-center gap-6 lg:gap-7 w-full">
          {/* Brand Crest */}
          <Link
            href="/"
            className="w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/15 rounded-2xl flex items-center justify-center font-black text-2xl tracking-tighter text-white transition-all shadow-inner"
            title="Driptide Live Storefront"
          >
            D
          </Link>

          {/* Navigation Icons Stack */}
          <nav className="flex lg:flex-col items-center gap-2 sm:gap-2.5 w-full justify-around lg:justify-start">
            <button
              onClick={() => setActiveNav('overview')}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                activeNav === 'overview'
                  ? 'bg-white text-black shadow-lg shadow-white/10 scale-105'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
              title="Overview Dashboard"
            >
              <Home className="w-5 h-5 stroke-[2.2]" />
            </button>

            <button
              onClick={() => setActiveNav('products')}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                activeNav === 'products'
                  ? 'bg-white text-black shadow-lg shadow-white/10 scale-105'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
              title="Silhouettes & Products"
            >
              <Package className="w-5 h-5 stroke-[2.2]" />
            </button>

            <button
              onClick={() => setActiveNav('categories')}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                activeNav === 'categories'
                  ? 'bg-white text-black shadow-lg shadow-white/10 scale-105'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
              title="Categories & Departments"
            >
              <Layers className="w-5 h-5 stroke-[2.2]" />
            </button>

            <button
              onClick={() => setActiveNav('orders')}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer relative ${
                activeNav === 'orders'
                  ? 'bg-white text-black shadow-lg shadow-white/10 scale-105'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
              title="Orders & Logistics"
            >
              <FileText className="w-5 h-5 stroke-[2.2]" />
              {readyToShipCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full" />
              )}
            </button>

            <button
              onClick={() => setActiveNav('discounts')}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                activeNav === 'discounts'
                  ? 'bg-white text-black shadow-lg shadow-white/10 scale-105'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
              title="Discounts & Coupons"
            >
              <Tag className="w-5 h-5 stroke-[2.2]" />
            </button>

            <button
              onClick={() => setActiveNav('inventory')}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                activeNav === 'inventory'
                  ? 'bg-white text-black shadow-lg shadow-white/10 scale-105'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
              title="Warehouse Inventory"
            >
              <Warehouse className="w-5 h-5 stroke-[2.2]" />
            </button>

            <button
              onClick={() => setActiveNav('settings')}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-all cursor-pointer ${
                activeNav === 'settings'
                  ? 'bg-white text-black shadow-lg shadow-white/10 scale-105'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
              title="Settings & System"
            >
              <Settings className="w-5 h-5 stroke-[2.2]" />
            </button>
          </nav>
        </div>

        {/* Storefront return icon */}
        <div className="hidden lg:flex flex-col items-center">
          <Link
            href="/shop"
            className="w-11 h-11 rounded-2xl bg-white/5 hover:bg-white/15 text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            title="Open Storefront"
          >
            <ExternalLink className="w-5 h-5 stroke-[2]" />
          </Link>
        </div>
      </aside>

      {/* 2. Main Executive Operations Center */}
      <main className="flex-1 flex flex-col gap-5 sm:gap-6 min-w-0">
        {/* Top Header Row */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-black border border-neutral-700 shadow-sm flex items-center justify-center text-white font-black text-sm tracking-wider">
              <span>DT</span>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-neutral-400 tracking-wider uppercase">
                Executive Portal
              </p>
              <h1 className="text-xl sm:text-2xl font-black text-[#111111] tracking-tight uppercase leading-none mt-0.5">
                {activeNav === 'overview' && 'Command Center'}
                {activeNav === 'products' && 'Silhouettes & Catalog'}
                {activeNav === 'categories' && 'Categories & Departments'}
                {activeNav === 'orders' && 'Orders & Logistics'}
                {activeNav === 'discounts' && 'Promotions & Coupons'}
                {activeNav === 'inventory' && 'Warehouse & Stock Allocation'}
                {activeNav === 'settings' && 'Platform Infrastructure'}
              </h1>
            </div>
          </div>

          {/* Quick Search & Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog, orders, SKUs…"
                className="w-full bg-white text-[#111] placeholder-neutral-400 text-xs pl-5 pr-11 py-3 rounded-full shadow-xs border border-neutral-200 focus:border-black focus:outline-none transition-all"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            {/* Quick Add Product button */}
            <button
              onClick={() => {
                resetProductForm();
                setEditingProduct(null);
                setShowAddProductModal(true);
              }}
              className="h-11 px-4 bg-black hover:bg-neutral-800 text-white rounded-full flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add Silhouette</span>
            </button>

            <button
              onClick={loadAdminData}
              className="w-11 h-11 bg-white hover:bg-neutral-50 rounded-full flex items-center justify-center text-[#111] border border-neutral-200 shadow-xs flex-shrink-0 transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4 text-neutral-600" />
            </button>
          </div>
        </header>

        {/* Action toast */}
        {actionSuccess && (
          <div className="p-3.5 bg-black text-white text-xs font-semibold tracking-wider rounded-2xl flex items-center justify-between shadow-lg border border-neutral-800">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button onClick={() => setActionSuccess('')} className="text-neutral-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* 3. Executive KPI Cards Row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <div className="bg-white rounded-3xl p-5 shadow-xs border border-neutral-200/70 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-black flex items-center justify-center flex-shrink-0 font-bold border border-neutral-200">
              <DollarSign className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider truncate">
                Gross Sales
              </p>
              <h2 className="text-2xl font-black text-[#111] tracking-tight mt-0.5">
                {formatMoney(metrics?.totalRevenueMinor || 0)}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-xs border border-neutral-200/70 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-black flex items-center justify-center flex-shrink-0 font-bold border border-neutral-200">
              <Clock className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider truncate">
                Orders Pending
              </p>
              <h2 className="text-2xl font-black text-[#111] tracking-tight mt-0.5">
                {readyToShipCount}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-xs border border-neutral-200/70 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-black flex items-center justify-center flex-shrink-0 font-bold border border-neutral-200">
              <AlertTriangle className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider truncate">
                Low Stock Alerts
              </p>
              <h2 className="text-2xl font-black text-[#111] tracking-tight mt-0.5">
                {metrics?.lowStockItemsCount ?? 0}
              </h2>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-xs border border-neutral-200/70 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 text-black flex items-center justify-center flex-shrink-0 font-bold border border-neutral-200">
              <Users className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider truncate">
                Customer Base
              </p>
              <h2 className="text-2xl font-black text-[#111] tracking-tight mt-0.5">
                {metrics?.totalCustomers ?? 0}
              </h2>
            </div>
          </div>
        </section>

        {/* 4. Tab 1: Overview Dashboard */}
        {activeNav === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
            {/* Center Panel: Order Stats */}
            <section className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-neutral-200/70 flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-neutral-100">
                <div>
                  <h3 className="text-base font-black text-[#111] uppercase tracking-wider">
                    Order Status Pipeline
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium">
                    {readyToShipCount} orders requiring logistics dispatch
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-[#F8F9FA] text-xs font-bold uppercase tracking-wider text-[#111] px-3.5 py-2 rounded-full border border-neutral-200 focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-100 pb-3">
                      <th className="pb-3">Silhouette</th>
                      <th className="pb-3">Qty / Value</th>
                      <th className="pb-3">Fulfillment</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredOrders.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-12 text-center text-neutral-400 font-medium">
                          No orders matching this filter.
                        </td>
                      </tr>
                    ) : (
                      filteredOrders.slice(0, 6).map((order) => {
                        const firstItem = order.items[0];
                        return (
                          <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                            <td className="py-3.5 pr-4">
                              <div className="flex items-center gap-3">
                                {firstItem?.imageUrl ? (
                                  <div className="w-10 h-12 rounded-xl bg-neutral-100 overflow-hidden flex-shrink-0 border border-neutral-200">
                                    <img
                                      src={firstItem.imageUrl}
                                      alt={firstItem.productName}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-10 h-12 rounded-xl bg-neutral-100 flex items-center justify-center font-bold text-xs text-neutral-400 border border-neutral-200">
                                    #
                                  </div>
                                )}
                                <div className="min-w-0">
                                  <p className="font-bold text-[#111] truncate max-w-[160px]">
                                    {firstItem?.productName || order.orderNumber}
                                  </p>
                                  <p className="text-[10px] text-neutral-400 font-mono">
                                    {order.orderNumber}
                                  </p>
                                </div>
                              </div>
                            </td>

                            <td className="py-3.5 pr-4">
                              <span className="font-bold text-[#111] block">
                                {order.items.reduce((acc, i) => acc + i.quantity, 0)} items
                              </span>
                              <span className="text-[10px] text-neutral-500 font-semibold">
                                {formatMoney(order.totalMinor)}
                              </span>
                            </td>

                            <td className="py-3.5 pr-4">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                  order.status === OrderStatus.DELIVERED || order.status === OrderStatus.SHIPPED
                                    ? 'bg-neutral-100 text-black border-neutral-300'
                                    : order.status === OrderStatus.PROCESSING
                                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                                    : 'bg-neutral-50 text-neutral-600 border-neutral-200'
                                }`}
                              >
                                {order.status}
                              </span>
                            </td>

                            <td className="py-3.5 pr-4">
                              <p className="font-semibold text-[#111] truncate max-w-[130px]">
                                {order.customerName}
                              </p>
                              <p className="text-[10px] text-neutral-400 truncate max-w-[130px]">
                                {order.customerEmail}
                              </p>
                            </td>

                            <td className="py-3.5 text-right">
                              {order.status !== OrderStatus.SHIPPED && order.status !== OrderStatus.DELIVERED ? (
                                <button
                                  onClick={() => setFulfillingOrderId(order.id)}
                                  className="px-3.5 py-1.5 bg-black hover:bg-neutral-800 text-white font-bold text-[10px] uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                                >
                                  Dispatch
                                </button>
                              ) : (
                                <span className="text-[10px] text-neutral-500 font-mono">
                                  {order.trackingNumber ? `AWB: ${order.trackingNumber.slice(-6)}` : 'Shipped'}
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pt-2 text-center border-t border-neutral-100">
                <button
                  onClick={() => setActiveNav('orders')}
                  className="text-xs font-bold text-black hover:underline uppercase tracking-wider"
                >
                  View Full Orders Pipeline ({orders.length}) →
                </button>
              </div>
            </section>

            {/* Right Sidebar: 2x2 Stats & Top Categories */}
            <div className="lg:col-span-4 flex flex-col gap-5">
              {/* 2x2 Metric Matrix */}
              <div className="bg-white rounded-3xl p-6 shadow-xs border border-neutral-200/70">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-4">
                  Financial & Velocity Pulse
                </h3>
                <div className="grid grid-cols-2 divide-x divide-y divide-neutral-100 -m-3">
                  <div className="p-3 text-center">
                    <p className="text-[10px] text-neutral-400 font-bold uppercase">Settled</p>
                    <p className="text-lg font-black text-[#111] mt-0.5">
                      {formatMoney(metrics?.totalRevenueMinor || 0)}
                    </p>
                  </div>
                  <div className="p-3 text-center">
                    <p className="text-[10px] text-neutral-400 font-bold uppercase">All Orders</p>
                    <p className="text-lg font-black text-[#111] mt-0.5">{metrics?.totalOrders || 0}</p>
                  </div>
                  <div className="p-3 text-center">
                    <p className="text-[10px] text-neutral-400 font-bold uppercase">Active SKUs</p>
                    <p className="text-lg font-black text-[#111] mt-0.5">
                      {products.reduce((acc, p) => acc + p.variants.length, 0)}
                    </p>
                  </div>
                  <div className="p-3 text-center">
                    <p className="text-[10px] text-neutral-400 font-bold uppercase">Total Pieces</p>
                    <p className="text-lg font-black text-[#111] mt-0.5">
                      {products.reduce((acc, p) => acc + p.totalStock, 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Best Selling Silhouettes */}
              <div className="bg-white rounded-3xl p-6 shadow-xs border border-neutral-200/70 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#111]">
                    Top Silhouettes by Volume
                  </h3>
                  <Flame className="w-4 h-4 text-neutral-600" />
                </div>

                <div className="space-y-4 pt-1">
                  {metrics?.topSellingProducts && metrics.topSellingProducts.length > 0 ? (
                    metrics.topSellingProducts.slice(0, 5).map((prod) => {
                      const maxUnits = Math.max(
                        ...metrics.topSellingProducts.map((p) => p.unitsSold),
                        1,
                      );
                      const barPercent = Math.min(100, Math.round((prod.unitsSold / maxUnits) * 100));

                      return (
                        <div key={prod.productId} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold text-[#111]">
                            <span className="truncate max-w-[170px]">{prod.name}</span>
                            <span className="text-neutral-500 font-bold">{prod.unitsSold} units</span>
                          </div>
                          <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-black transition-all duration-500"
                              style={{ width: `${barPercent}%` }}
                            />
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-neutral-400 py-4 text-center">
                      Sales data accumulating.
                    </p>
                  )}
                </div>
              </div>

              {/* Promo code traction widget */}
              <div className="bg-white rounded-3xl p-6 shadow-xs border border-neutral-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[#111]">
                    Active Promotions
                  </h3>
                  <button
                    onClick={() => setActiveNav('discounts')}
                    className="text-[10px] font-bold text-black hover:underline uppercase"
                  >
                    Manage
                  </button>
                </div>
                <div className="space-y-2">
                  {coupons.slice(0, 3).map((cp) => (
                    <div
                      key={cp.id}
                      className="flex items-center justify-between p-2.5 bg-neutral-50 rounded-2xl border border-neutral-100 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Tag className="w-3.5 h-3.5 text-neutral-600" />
                        <span className="font-mono font-bold tracking-wider">{cp.code}</span>
                      </div>
                      <span className="font-bold text-neutral-700">
                        {cp.discountType === 'percentage'
                          ? `${cp.discountValue}% OFF`
                          : `$${(cp.discountValue / 100).toFixed(0)} OFF`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. Tab 2: Products & Silhouettes Management */}
        {activeNav === 'products' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-neutral-200/70 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-black text-[#111] uppercase tracking-wider">
                  Clothing Silhouettes & Catalog
                </h3>
                <p className="text-xs text-neutral-500">
                  Manage department, categories, pricing, markdowns, and inventory
                </p>
              </div>

              {/* Department / Category Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-[#F8F9FA] text-xs font-bold uppercase tracking-wider text-[#111] px-3.5 py-2 rounded-full border border-neutral-200 focus:outline-none cursor-pointer"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => {
                    resetProductForm();
                    setEditingProduct(null);
                    setShowAddProductModal(true);
                  }}
                  className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> New Silhouette
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-100 pb-3">
                    <th className="pb-3">Silhouette</th>
                    <th className="pb-3">Department</th>
                    <th className="pb-3">Selling Price</th>
                    <th className="pb-3">Original (Compare)</th>
                    <th className="pb-3">Discount</th>
                    <th className="pb-3">Stock Units</th>
                    <th className="pb-3">Badges</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredProducts.map((prod) => {
                    const hasDiscount =
                      prod.compareAtPriceMinor && prod.compareAtPriceMinor > prod.basePriceMinor;
                    const discountPercent = hasDiscount
                      ? Math.round(
                          ((prod.compareAtPriceMinor! - prod.basePriceMinor) /
                            prod.compareAtPriceMinor!) *
                            100,
                        )
                      : 0;

                    return (
                      <tr key={prod.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="py-3.5 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-14 rounded-xl bg-neutral-100 overflow-hidden flex-shrink-0 border border-neutral-200">
                              <img
                                src={prod.images[0]?.url || 'https://via.placeholder.com/300'}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-[#111] truncate max-w-[180px]">
                                {prod.name}
                              </p>
                              <p className="text-[10px] text-neutral-400">
                                {prod.category?.name || 'Uncategorized'}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 pr-4">
                          <span className="px-2.5 py-1 bg-neutral-100 text-neutral-800 font-bold text-[10px] uppercase rounded-full tracking-wider">
                            {prod.tagline?.includes('MEN') ? 'Men' : prod.tagline?.includes('WOMEN') ? 'Women' : 'Unisex'}
                          </span>
                        </td>

                        <td className="py-3.5 pr-4 font-black text-[#111]">
                          {formatMoney(prod.basePriceMinor)}
                        </td>

                        <td className="py-3.5 pr-4 text-neutral-400 line-through">
                          {prod.compareAtPriceMinor ? formatMoney(prod.compareAtPriceMinor) : '—'}
                        </td>

                        <td className="py-3.5 pr-4">
                          {hasDiscount ? (
                            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full border border-emerald-200">
                              Save {discountPercent}%
                            </span>
                          ) : (
                            <span className="text-[10px] text-neutral-400">Regular</span>
                          )}
                        </td>

                        <td className="py-3.5 pr-4">
                          <span
                            className={`font-bold ${
                              prod.totalStock <= 15 ? 'text-amber-600 font-black' : 'text-[#111]'
                            }`}
                          >
                            {prod.totalStock} units
                          </span>
                        </td>

                        <td className="py-3.5 pr-4">
                          <div className="flex gap-1.5 flex-wrap">
                            {prod.isNewArrival && (
                              <span className="px-2 py-0.5 bg-black text-white text-[9px] font-bold uppercase rounded-full">
                                Drop
                              </span>
                            )}
                            {prod.featured && (
                              <span className="px-2 py-0.5 bg-neutral-200 text-black text-[9px] font-bold uppercase rounded-full">
                                ★ Hero
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => openEditProduct(prod)}
                            className="p-1.5 hover:bg-neutral-200 rounded-lg text-neutral-700 transition-colors cursor-pointer"
                            title="Edit Silhouette"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. Tab 3: Categories & Sub-Categories */}
        {activeNav === 'categories' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-neutral-200/70 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-black text-[#111] uppercase tracking-wider">
                  Category Architecture & Departments
                </h3>
                <p className="text-xs text-neutral-500">
                  Organize fashion lines across Men, Women, Juniors, and specialized collections
                </p>
              </div>

              <button
                onClick={() => setShowAddCategoryModal(true)}
                className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const count = products.filter((p) => p.category?.slug === cat.slug).length;
                return (
                  <div
                    key={cat.id}
                    className="p-5 bg-neutral-50 rounded-2xl border border-neutral-200/80 space-y-3"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          Department Collection
                        </span>
                        <h4 className="text-base font-black text-[#111] mt-0.5">{cat.name}</h4>
                      </div>
                      <span className="px-2.5 py-1 bg-white border border-neutral-200 font-bold text-[10px] rounded-full">
                        {count} Silhouettes
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 font-light">
                      {cat.description || 'Premium curated fashion category'}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-neutral-200/60 text-xs">
                      <span className="font-mono text-neutral-400 text-[10px]">/{cat.slug}</span>
                      <Link
                        href={`/category/${cat.slug}`}
                        className="text-black font-bold hover:underline flex items-center gap-1 text-[11px]"
                      >
                        Storefront Page <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 7. Tab 4: Orders & Logistics Management */}
        {activeNav === 'orders' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-neutral-200/70 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-black text-[#111] uppercase tracking-wider">
                  Order Dispatch & Tracking
                </h3>
                <p className="text-xs text-neutral-500">
                  Verify customer orders, assign air waybills, and update shipping lifecycle
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {['all', 'pending', 'processing', 'shipped', 'delivered'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      statusFilter === st
                        ? 'bg-black text-white shadow-xs'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-100 pb-3">
                    <th className="pb-3">Order Number</th>
                    <th className="pb-3">Customer Details</th>
                    <th className="pb-3">Items Ordered</th>
                    <th className="pb-3">Gross Total</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Logistics Tracking</th>
                    <th className="pb-3 text-right">Dispatch</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredOrders.map((o) => (
                    <tr key={o.id} className="hover:bg-neutral-50">
                      <td className="py-4 font-mono font-bold text-[#111]">{o.orderNumber}</td>
                      <td className="py-4">
                        <span className="font-bold text-[#111] block">{o.customerName}</span>
                        <span className="text-[10px] text-neutral-400 lowercase">{o.customerEmail}</span>
                      </td>
                      <td className="py-4 text-neutral-600">
                        {o.items.length} item{o.items.length > 1 ? 's' : ''} (
                        {o.items.map((i) => i.productName).join(', ').slice(0, 32)}
                        {o.items.length > 1 ? '…' : ''})
                      </td>
                      <td className="py-4 font-black text-[#111]">{formatMoney(o.totalMinor)}</td>
                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                            o.status === OrderStatus.SHIPPED || o.status === OrderStatus.DELIVERED
                              ? 'bg-neutral-100 text-black border-neutral-300'
                              : o.status === OrderStatus.PROCESSING
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-neutral-50 text-neutral-600 border-neutral-200'
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="py-4 font-mono text-[11px] text-neutral-500">
                        {o.trackingNumber ? `${o.courier} · ${o.trackingNumber}` : '—'}
                      </td>
                      <td className="py-4 text-right">
                        {o.status !== OrderStatus.SHIPPED && o.status !== OrderStatus.DELIVERED ? (
                          <button
                            onClick={() => setFulfillingOrderId(o.id)}
                            className="px-3.5 py-1.5 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                          >
                            Assign AWB
                          </button>
                        ) : (
                          <span className="text-xs text-emerald-600 font-bold">✓ Dispatched</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 8. Tab 5: Discounts & Promo Codes */}
        {activeNav === 'discounts' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-neutral-200/70 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-black text-[#111] uppercase tracking-wider">
                  Discount & Promotional Codes
                </h3>
                <p className="text-xs text-neutral-500">
                  Configure percentage and fixed price promotional markdowns for drops and newsletters
                </p>
              </div>

              <button
                onClick={() => setShowAddCouponModal(true)}
                className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Create Promo Code
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-100 pb-3">
                    <th className="pb-3">Coupon Code</th>
                    <th className="pb-3">Discount Type</th>
                    <th className="pb-3">Value</th>
                    <th className="pb-3">Minimum Order Spend</th>
                    <th className="pb-3">Max Cap</th>
                    <th className="pb-3">Usage Traction</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right">Toggle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {coupons.map((cp) => (
                    <tr key={cp.id} className="hover:bg-neutral-50">
                      <td className="py-4 font-mono font-bold text-sm tracking-wider text-black">
                        {cp.code}
                      </td>
                      <td className="py-4 capitalize font-semibold text-neutral-700">
                        {cp.discountType === 'percentage' ? 'Percentage %' : 'Fixed Amount $'}
                      </td>
                      <td className="py-4 font-black text-black">
                        {cp.discountType === 'percentage'
                          ? `${cp.discountValue}% OFF`
                          : formatMoney(cp.discountValue)}
                      </td>
                      <td className="py-4 text-neutral-600">
                        {cp.minSpendMinor ? formatMoney(cp.minSpendMinor) : 'None'}
                      </td>
                      <td className="py-4 text-neutral-600">
                        {cp.maxDiscountMinor ? formatMoney(cp.maxDiscountMinor) : 'Uncapped'}
                      </td>
                      <td className="py-4">
                        <span className="font-bold text-[#111]">{cp.usageCount}</span>
                        <span className="text-neutral-400"> / {cp.usageLimit || '∞'} uses</span>
                      </td>
                      <td className="py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            cp.isActive
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-neutral-100 text-neutral-500'
                          }`}
                        >
                          {cp.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>
                      <td className="py-4 text-right">
                        <button
                          onClick={() => handleToggleCoupon(cp.id)}
                          className="px-3 py-1 border border-neutral-300 hover:border-black font-bold text-[10px] uppercase rounded-lg transition-colors cursor-pointer"
                        >
                          {cp.isActive ? 'Deactivate' : 'Enable'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 9. Tab 6: Warehouse & Stock Logistics */}
        {activeNav === 'inventory' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xs border border-neutral-200/70 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
              <div>
                <h3 className="text-base font-black text-[#111] uppercase tracking-wider">
                  Variant Inventory & Restocking
                </h3>
                <p className="text-xs text-neutral-500">
                  Individual SKU stock counts across all sizes, colors, and cuts
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-100 pb-3">
                    <th className="pb-3">Silhouette</th>
                    <th className="pb-3">SKU</th>
                    <th className="pb-3">Size & Color Variant</th>
                    <th className="pb-3">Retail Price</th>
                    <th className="pb-3">In-Stock Pieces</th>
                    <th className="pb-3 text-right">Restock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {products.flatMap((prod) =>
                    prod.variants.map((v) => (
                      <tr key={v.id} className="hover:bg-neutral-50">
                        <td className="py-3.5 font-bold text-[#111]">{prod.name}</td>
                        <td className="py-3.5 font-mono text-neutral-400">{v.sku}</td>
                        <td className="py-3.5 text-neutral-700 font-medium">{v.title}</td>
                        <td className="py-3.5 font-black text-[#111]">{formatMoney(v.priceMinor)}</td>
                        <td className="py-3.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              v.stockQuantity <= 10
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-neutral-100 text-neutral-800'
                            }`}
                          >
                            {v.stockQuantity} units
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => setAdjustingVariantId(v.id)}
                            className="px-3 py-1 bg-black hover:bg-neutral-800 text-white font-bold text-xs rounded-lg transition-colors cursor-pointer"
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

        {/* 10. Tab 7: Settings & Infrastructure */}
        {activeNav === 'settings' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-neutral-200/70 space-y-4">
              <h3 className="text-base font-black text-[#111] uppercase tracking-wider">
                Platform Architecture
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">API Gateway</span>
                  <span className="font-bold text-black">NestJS REST API v1 (Online)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">Storefront Engine</span>
                  <span className="font-bold text-black">Next.js 16 with Turbopack</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">Database Layer</span>
                  <span className="font-bold text-black">Supabase PostgreSQL</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-neutral-500">Inventory Protection</span>
                  <span className="font-bold text-black">Serialized Atomic Transactions</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-xs border border-neutral-200/70 space-y-4">
              <h3 className="text-base font-black text-[#111] uppercase tracking-wider">
                Store Policies & Thresholds
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">Settlement Currency</span>
                  <span className="font-bold text-black">USD ($) · Cent Minor</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">Free Express Delivery</span>
                  <span className="font-bold text-black">Orders over $150.00</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                  <span className="text-neutral-500">Primary Logistics Courier</span>
                  <span className="font-bold text-black">DHL Express Worldwide</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-neutral-500">Return Window</span>
                  <span className="font-bold text-black">30 Days Complimentary</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: Create or Edit Silhouette Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-neutral-200 space-y-5 my-8">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Catalog Architecture
                </span>
                <h3 className="text-base font-black text-[#111] uppercase tracking-wider mt-0.5">
                  {editingProduct ? 'Edit Silhouette & Pricing' : 'Add New Clothing Silhouette'}
                </h3>
              </div>
              <button
                onClick={() => setShowAddProductModal(false)}
                className="text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-500 font-bold uppercase tracking-wider mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Heavyweight Boxy Hoodie"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    className="w-full bg-[#F8F9FA] border border-neutral-200 rounded-xl px-3.5 py-2.5 font-medium text-[#111] focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-neutral-500 font-bold uppercase tracking-wider mb-1">
                    Department / Gender *
                  </label>
                  <select
                    value={newProductGender}
                    onChange={(e) => setNewProductGender(e.target.value as any)}
                    className="w-full bg-[#F8F9FA] border border-neutral-200 rounded-xl px-3.5 py-2.5 font-bold uppercase text-[#111] focus:outline-none focus:border-black cursor-pointer"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="juniors">Juniors</option>
                    <option value="unisex">Unisex</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-500 font-bold uppercase tracking-wider mb-1">
                    Primary Category *
                  </label>
                  <select
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    className="w-full bg-[#F8F9FA] border border-neutral-200 rounded-xl px-3.5 py-2.5 font-semibold text-[#111] focus:outline-none focus:border-black cursor-pointer"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-500 font-bold uppercase tracking-wider mb-1">
                    Sub-Category / Cut
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Drop Shoulder, Cargo, Wide Leg"
                    value={newProductSubCategory}
                    onChange={(e) => setNewProductSubCategory(e.target.value)}
                    className="w-full bg-[#F8F9FA] border border-neutral-200 rounded-xl px-3.5 py-2.5 font-medium text-[#111] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Pricing & Markdown Engine */}
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
                <span className="text-[10px] font-black uppercase tracking-wider text-black block">
                  Pricing & Markdown Engine
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-500 font-bold mb-1">
                      Selling Price (USD $) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="79.00"
                      value={newProductBasePrice}
                      onChange={(e) => setNewProductBasePrice(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 font-black text-sm text-[#111] focus:outline-none focus:border-black"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-500 font-bold mb-1">
                      Compare-at Original Price (USD $)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="110.00"
                      value={newProductComparePrice}
                      onChange={(e) => setNewProductComparePrice(e.target.value)}
                      className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 font-black text-sm text-[#111] focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                {parseFloat(newProductComparePrice) > parseFloat(newProductBasePrice) && (
                  <p className="text-[11px] font-bold text-emerald-700">
                    ✓ Marked down: Customers will see "Save{' '}
                    {Math.round(
                      ((parseFloat(newProductComparePrice) - parseFloat(newProductBasePrice)) /
                        parseFloat(newProductComparePrice)) *
                        100,
                    )}
                    %"
                  </p>
                )}
              </div>

              <div>
                <label className="block text-neutral-500 font-bold uppercase tracking-wider mb-1">
                  Product Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newProductImageUrl}
                  onChange={(e) => setNewProductImageUrl(e.target.value)}
                  className="w-full bg-[#F8F9FA] border border-neutral-200 rounded-xl px-3.5 py-2.5 font-medium text-[#111] focus:outline-none focus:border-black"
                />
              </div>

              {/* Merchandising Toggles */}
              <div className="flex flex-wrap gap-6 py-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProductIsNewDrop}
                    onChange={(e) => setNewProductIsNewDrop(e.target.checked)}
                    className="w-4 h-4 accent-black"
                  />
                  <span className="font-bold text-[#111]">★ Flag as "New Season Drop"</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProductIsFeatured}
                    onChange={(e) => setNewProductIsFeatured(e.target.checked)}
                    className="w-4 h-4 accent-black"
                  />
                  <span className="font-bold text-[#111]">Feature on Homepage Hero</span>
                </label>
              </div>

              {/* Variant Stock Allocations */}
              {!editingProduct && (
                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-black block">
                    Size Matrix & Variant Allocation
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    <div>
                      <span className="block text-[10px] font-bold text-neutral-400">XS Stock</span>
                      <input
                        type="number"
                        min="0"
                        value={newProductStockXS}
                        onChange={(e) => setNewProductStockXS(parseInt(e.target.value || '0', 10))}
                        className="w-full bg-white border border-neutral-200 rounded-lg p-2 font-bold text-center"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-neutral-400">S Stock</span>
                      <input
                        type="number"
                        min="0"
                        value={newProductStockS}
                        onChange={(e) => setNewProductStockS(parseInt(e.target.value || '0', 10))}
                        className="w-full bg-white border border-neutral-200 rounded-lg p-2 font-bold text-center"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-neutral-400">M Stock</span>
                      <input
                        type="number"
                        min="0"
                        value={newProductStockM}
                        onChange={(e) => setNewProductStockM(parseInt(e.target.value || '0', 10))}
                        className="w-full bg-white border border-neutral-200 rounded-lg p-2 font-bold text-center"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-neutral-400">L Stock</span>
                      <input
                        type="number"
                        min="0"
                        value={newProductStockL}
                        onChange={(e) => setNewProductStockL(parseInt(e.target.value || '0', 10))}
                        className="w-full bg-white border border-neutral-200 rounded-lg p-2 font-bold text-center"
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-neutral-400">XL Stock</span>
                      <input
                        type="number"
                        min="0"
                        value={newProductStockXL}
                        onChange={(e) => setNewProductStockXL(parseInt(e.target.value || '0', 10))}
                        className="w-full bg-white border border-neutral-200 rounded-lg p-2 font-bold text-center"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="flex-1 py-3 bg-neutral-100 hover:bg-neutral-200 text-black font-bold uppercase rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-black hover:bg-neutral-800 text-white font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-md"
                >
                  {editingProduct ? 'Save Modifications' : 'Publish Silhouette'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Create Promo Code Modal */}
      {showAddCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-neutral-200 space-y-5">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Promotions Engine
                </span>
                <h4 className="text-sm font-black text-[#111] uppercase tracking-wider mt-0.5">
                  Launch Promo / Discount Code
                </h4>
              </div>
              <button
                onClick={() => setShowAddCouponModal(false)}
                className="text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-500 font-bold uppercase tracking-wider mb-1">
                  Coupon Code (e.g. SUMMER25) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="DRIP20"
                  value={newCouponCode}
                  onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                  className="w-full bg-[#F8F9FA] border border-neutral-200 rounded-xl px-3.5 py-2.5 font-mono font-bold text-sm text-[#111] focus:outline-none focus:border-black uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-500 font-bold uppercase tracking-wider mb-1">
                    Discount Type
                  </label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value as any)}
                    className="w-full bg-[#F8F9FA] border border-neutral-200 rounded-xl px-3 py-2.5 font-bold text-[#111] focus:outline-none focus:border-black cursor-pointer"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-500 font-bold uppercase tracking-wider mb-1">
                    Value ({newCouponType === 'percentage' ? '%' : '$'}) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(e.target.value)}
                    className="w-full bg-[#F8F9FA] border border-neutral-200 rounded-xl px-3 py-2.5 font-bold text-[#111] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-500 font-bold uppercase tracking-wider mb-1">
                    Min Order ($)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="50"
                    value={newCouponMinSpend}
                    onChange={(e) => setNewCouponMinSpend(e.target.value)}
                    className="w-full bg-[#F8F9FA] border border-neutral-200 rounded-xl px-3 py-2.5 font-bold text-[#111] focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-neutral-500 font-bold uppercase tracking-wider mb-1">
                    Usage Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="500"
                    value={newCouponLimit}
                    onChange={(e) => setNewCouponLimit(e.target.value)}
                    className="w-full bg-[#F8F9FA] border border-neutral-200 rounded-xl px-3 py-2.5 font-bold text-[#111] focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowAddCouponModal(false)}
                  className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-black font-bold uppercase rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-black hover:bg-neutral-800 text-white font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-md"
                >
                  Publish Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Create Category Modal */}
      {showAddCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-neutral-200 space-y-5">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Taxonomy Manager
                </span>
                <h4 className="text-sm font-black text-[#111] uppercase tracking-wider mt-0.5">
                  Create Fashion Category
                </h4>
              </div>
              <button
                onClick={() => setShowAddCategoryModal(false)}
                className="text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-500 font-bold uppercase tracking-wider mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Leather & Outerwear"
                  value={newCatName}
                  onChange={(e) => {
                    setNewCatName(e.target.value);
                    if (!newCatSlug) {
                      setNewCatSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                    }
                  }}
                  className="w-full bg-[#F8F9FA] border border-neutral-200 rounded-xl px-3.5 py-2.5 font-bold text-[#111] focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-neutral-500 font-bold uppercase tracking-wider mb-1">
                  Department
                </label>
                <select
                  value={newCatGender}
                  onChange={(e) => setNewCatGender(e.target.value)}
                  className="w-full bg-[#F8F9FA] border border-neutral-200 rounded-xl px-3.5 py-2.5 font-bold uppercase text-[#111] focus:outline-none focus:border-black cursor-pointer"
                >
                  <option value="men">Men</option>
                  <option value="women">Women</option>
                  <option value="juniors">Juniors</option>
                  <option value="all">All Departments</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-500 font-bold uppercase tracking-wider mb-1">
                  URL Slug
                </label>
                <input
                  type="text"
                  placeholder="outerwear"
                  value={newCatSlug}
                  onChange={(e) => setNewCatSlug(e.target.value)}
                  className="w-full bg-[#F8F9FA] border border-neutral-200 rounded-xl px-3.5 py-2.5 font-mono text-[#111] focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowAddCategoryModal(false)}
                  className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-black font-bold uppercase rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-black hover:bg-neutral-800 text-white font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-md"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: Fulfill Order Modal */}
      {fulfillingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-neutral-200 space-y-5">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Logistics Dispatch
                </span>
                <h4 className="text-sm font-black text-[#111] uppercase tracking-wider mt-0.5">
                  Assign Carrier & Tracking AWB
                </h4>
              </div>
              <button
                onClick={() => setFulfillingOrderId(null)}
                className="text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFulfillSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-500 font-bold uppercase tracking-wider mb-1">
                  Logistics Provider
                </label>
                <select
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  className="w-full bg-[#F8F9FA] border border-neutral-200 rounded-xl px-3.5 py-2.5 font-bold text-[#111] focus:outline-none focus:border-black"
                >
                  <option value="DHL Express Worldwide">DHL Express Worldwide</option>
                  <option value="FedEx Global">FedEx Global</option>
                  <option value="UPS Worldwide">UPS Worldwide</option>
                  <option value="TCS Courier Express">TCS Courier Express</option>
                </select>
              </div>

              <div>
                <label className="block text-neutral-500 font-bold uppercase tracking-wider mb-1">
                  Tracking Code / Air Waybill *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DHL-984210492"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  className="w-full bg-[#F8F9FA] border border-neutral-200 rounded-xl px-3.5 py-2.5 font-mono font-bold text-[#111] focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setFulfillingOrderId(null)}
                  className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-black font-bold uppercase rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-black hover:bg-neutral-800 text-white font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-md"
                >
                  Confirm Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Adjust Stock Modal */}
      {adjustingVariantId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full shadow-2xl border border-neutral-200 space-y-5">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                  Inventory Allocation
                </span>
                <h4 className="text-sm font-black text-[#111] uppercase tracking-wider mt-0.5">
                  Restock Variant SKU
                </h4>
              </div>
              <button
                onClick={() => setAdjustingVariantId(null)}
                className="text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStockAdjustSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-500 font-bold uppercase tracking-wider mb-1">
                  Units to Add to Stock
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustmentDelta}
                  onChange={(e) => setAdjustmentDelta(Number(e.target.value))}
                  className="w-full bg-[#F8F9FA] border border-neutral-200 rounded-xl px-3.5 py-2.5 font-bold text-sm text-[#111] focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-neutral-500 font-bold uppercase tracking-wider mb-1">
                  Restock Reason
                </label>
                <select
                  value={adjustmentReason}
                  onChange={(e) => setAdjustmentReason(e.target.value)}
                  className="w-full bg-[#F8F9FA] border border-neutral-200 rounded-xl px-3.5 py-2.5 font-semibold text-[#111] focus:outline-none focus:border-black"
                >
                  <option value="Factory Production Restock">Factory Production Restock</option>
                  <option value="Warehouse Inventory Transfer">Warehouse Inventory Transfer</option>
                  <option value="Customer Return Restock">Customer Return Restock</option>
                  <option value="Audit Inventory Correction">Audit Inventory Correction</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setAdjustingVariantId(null)}
                  className="flex-1 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-black font-bold uppercase rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-black hover:bg-neutral-800 text-white font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer shadow-md"
                >
                  Update Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useEffect, useState, use, Suspense } from 'react';
import Link from 'next/link';
import { Product, ProductVariant } from '@driptide/contracts';
import { api } from '@/lib/api';
import { formatMoney } from '@/lib/utils';
import { getReferenceProductImage } from '@/lib/product-image';
import { useCart } from '@/context/CartContext';
import { ProductGrid } from '@/components/product/ProductGrid';
import {
  ShoppingBag,
  Check,
  Truck,
  RotateCcw,
  Shield,
  ChevronDown,
  Ruler,
  X,
} from 'lucide-react';

function ProductDetailContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('details');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const data = await api.getProductBySlug(slug);
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }

        // Fetch related products
        const all = await api.getProducts({ category: data.category?.slug });
        setRelatedProducts(all.filter((p) => p.id !== data.id).slice(0, 4));
      } catch (err) {
        console.error('Failed to load product:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-black dark:border-white border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="py-32 text-center max-w-md mx-auto space-y-4">
        <h1 className="text-xl font-bold uppercase tracking-widest">Product Not Found</h1>
        <p className="text-sm text-neutral-500">The requested silhouette does not exist in our catalog.</p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-widest"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const images = product.images.length > 0
    ? product.images.map((image) => ({ ...image, url: getReferenceProductImage(product, image.url) }))
    : [{ id: '1', productId: product.id, url: getReferenceProductImage(product), sortOrder: 1, isPrimary: true }];

  const currentImage = images[selectedImageIndex]?.url || images[0].url;

  const handleAddToBag = async () => {
    if (!selectedVariant) return;
    setIsAdding(true);
    try {
      await addToCart(selectedVariant.id, 1);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 2000);
    } finally {
      setIsAdding(false);
    }
  };

  const toggleAccordion = (name: string) => {
    setOpenAccordion(openAccordion === name ? null : name);
  };

  const hasDiscount =
    product.compareAtPriceMinor &&
    product.compareAtPriceMinor > product.basePriceMinor;

  return (
    <div className="product-detail-page max-w-[1480px] mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-9 space-y-16">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs tracking-wider uppercase text-neutral-400">
        <Link href="/" className="hover:text-black dark:hover:text-white">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-black dark:hover:text-white">
          Shop
        </Link>
        <span>/</span>
        {product.category && (
          <>
            <Link
              href={`/category/${product.category.slug}`}
              className="hover:text-black dark:hover:text-white"
            >
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-black dark:text-white font-semibold truncate max-w-xs">
          {product.name}
        </span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14">
        {/* Left Column: Image Gallery */}
        <div className="product-detail-gallery lg:col-span-7">
          {images.map((img, idx) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelectedImageIndex(idx)}
              aria-label={`View ${product.name} image ${idx + 1}`}
              aria-pressed={selectedImageIndex === idx}
            >
              <img src={selectedImageIndex === idx ? currentImage : img.url} alt={img.altText || `${product.name} view ${idx + 1}`} loading={idx > 1 ? 'lazy' : 'eager'} />
            </button>
          ))}
        </div>

        {/* Right Column: Sticky Product Info */}
        <div className="product-detail-info lg:col-span-5 space-y-6 lg:sticky lg:top-28 lg:self-start">
          {/* Header & Badges */}
          <div>
            <div className="flex items-center space-x-2 text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-1">
              {product.isNewArrival && (
                <span className="text-black dark:text-white font-black">★ NEW DROP</span>
              )}
              {selectedVariant && (
                <span>SKU: {selectedVariant.sku}</span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight uppercase text-black dark:text-white">
              {product.name}
            </h1>
            {product.tagline && (
              <p className="text-xs sm:text-sm text-neutral-500 font-light mt-1">
                {product.tagline}
              </p>
            )}
          </div>

          {/* Pricing */}
          <div className="flex items-baseline space-x-3 text-lg font-bold">
            <span className="text-black dark:text-white">
              {formatMoney(selectedVariant?.priceMinor || product.basePriceMinor)}
            </span>
            {hasDiscount && (
              <span className="text-neutral-400 line-through text-sm font-normal">
                {formatMoney(product.compareAtPriceMinor!)}
              </span>
            )}
            {selectedVariant && selectedVariant.stockQuantity <= 10 && selectedVariant.stockQuantity > 0 && (
              <span className="text-xs text-amber-500 font-medium tracking-wider uppercase ml-2">
                Only {selectedVariant.stockQuantity} left
              </span>
            )}
          </div>

          {/* Color & Size Selectors */}
          <div className="space-y-4 pt-2 border-t border-neutral-200 dark:border-neutral-800">
            {/* Color preview */}
            {selectedVariant?.color && (
              <div>
                <div className="flex justify-between text-xs tracking-wider uppercase font-medium mb-2">
                  <span className="text-neutral-500">Color:</span>
                  <span className="text-black dark:text-white font-bold">
                    {selectedVariant.color}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-6 h-6 rounded-full border border-neutral-400 shadow-inner"
                    style={{ backgroundColor: selectedVariant.colorHex || '#111111' }}
                  />
                </div>
              </div>
            )}

            {/* Sizes */}
            <div>
              <div className="flex justify-between items-center text-xs tracking-wider uppercase font-medium mb-2">
                <span className="text-neutral-500">Select Size:</span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white flex items-center underline decoration-neutral-400"
                >
                  <Ruler className="w-3.5 h-3.5 mr-1" />
                  Size Guide
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {product.variants.map((v) => {
                  const isSelected = selectedVariant?.id === v.id;
                  const isOutOfStock = v.stockQuantity <= 0;
                  return (
                    <button
                      key={v.id}
                      onClick={() => !isOutOfStock && setSelectedVariant(v)}
                      disabled={isOutOfStock}
                      className={`py-3 text-xs font-bold uppercase tracking-wider border transition-all ${
                        isSelected
                          ? 'border-black dark:border-white bg-black dark:bg-white text-white dark:text-black'
                          : isOutOfStock
                          ? 'border-neutral-200 dark:border-neutral-800 text-neutral-300 dark:text-neutral-700 cursor-not-allowed line-through'
                          : 'border-neutral-200 dark:border-neutral-700 hover:border-black text-neutral-800 dark:text-neutral-200'
                      }`}
                    >
                      {v.size || v.title}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Add to Bag Action */}
          <div className="pt-2">
            <button
              onClick={handleAddToBag}
              disabled={isAdding || !selectedVariant || selectedVariant.stockQuantity <= 0}
              className="w-full py-4 bg-black dark:bg-white text-white dark:text-black text-xs font-bold tracking-[0.2em] uppercase hover:opacity-90 disabled:opacity-40 transition-all flex items-center justify-center space-x-2"
            >
              {addedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Added to Bag</span>
                </>
              ) : selectedVariant && selectedVariant.stockQuantity <= 0 ? (
                <span>Sold Out</span>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>
          </div>

          {/* Value Perks Mini Bar */}
          <div className="grid grid-cols-3 gap-2 py-3 border-y border-neutral-100 dark:border-neutral-800/80 text-[10px] tracking-wider uppercase text-neutral-500">
            <div className="flex items-center space-x-1.5">
              <Truck className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Free Shipping &gt;$150</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <RotateCcw className="w-3.5 h-3.5 flex-shrink-0" />
              <span>30-Day Returns</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Authentic Craft</span>
            </div>
          </div>

          {/* Collapsible Accordions */}
          <div className="border-t border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-800">
            {/* Description & Details */}
            <div>
              <button
                onClick={() => toggleAccordion('details')}
                className="w-full py-4 flex justify-between items-center text-xs font-bold tracking-widest uppercase text-left"
              >
                <span>Design Details & Fit</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openAccordion === 'details' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordion === 'details' && (
                <div className="pb-4 text-xs font-light text-neutral-600 dark:text-neutral-400 space-y-3 leading-relaxed">
                  <p>{product.description}</p>
                  {product.details && product.details.length > 0 && (
                    <ul className="list-disc pl-4 space-y-1">
                      {product.details.map((detail, idx) => (
                        <li key={idx}>{detail}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            {/* Fabric Care */}
            <div>
              <button
                onClick={() => toggleAccordion('care')}
                className="w-full py-4 flex justify-between items-center text-xs font-bold tracking-widest uppercase text-left"
              >
                <span>Fabrication & Care Instructions</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openAccordion === 'care' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordion === 'care' && (
                <div className="pb-4 text-xs font-light text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                  {product.fabricCare && product.fabricCare.length > 0 ? (
                    <ul className="list-disc pl-4 space-y-1">
                      {product.fabricCare.map((care, idx) => (
                        <li key={idx}>{care}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Dry clean or gentle cold wash inside out. Air dry in shade.</p>
                  )}
                </div>
              )}
            </div>

            {/* Shipping & Delivery */}
            <div>
              <button
                onClick={() => toggleAccordion('shipping')}
                className="w-full py-4 flex justify-between items-center text-xs font-bold tracking-widest uppercase text-left"
              >
                <span>Complimentary Delivery & Returns</span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    openAccordion === 'shipping' ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openAccordion === 'shipping' && (
                <div className="pb-4 text-xs font-light text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                  <p>
                    All orders are packed in signature Driptide protective dust packaging.
                    Express DHL delivery takes 2-4 business days. Returns accepted within 30 days
                    of arrival.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Silhouettes Row */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-neutral-200 dark:border-neutral-800">
          <div className="mb-8">
            <span className="text-[10px] font-bold tracking-[0.25em] text-neutral-400 uppercase">
              Curated Recommendations
            </span>
            <h3 className="text-xl font-black tracking-wider uppercase mt-1">
              Complete The Look
            </h3>
          </div>
          <ProductGrid products={relatedProducts} />
        </section>
      )}

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 max-w-lg w-full p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase">
                Driptide Sizing Matrix
              </h4>
              <button onClick={() => setSizeGuideOpen(false)}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-neutral-500 font-light">
              Our silhouettes feature an intentional relaxed, dropped shoulder architectural cut.
              For a closer sartorial fit, we advise selecting one size down.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs uppercase tracking-wider">
                <thead className="bg-neutral-100 dark:bg-neutral-800 font-bold">
                  <tr>
                    <th className="p-2">Size</th>
                    <th className="p-2">Chest (Inches)</th>
                    <th className="p-2">Length (Inches)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                  <tr>
                    <td className="p-2 font-bold">Small (S)</td>
                    <td className="p-2">40 - 42"</td>
                    <td className="p-2">28.5"</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">Medium (M)</td>
                    <td className="p-2">43 - 45"</td>
                    <td className="p-2">29.5"</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">Large (L)</td>
                    <td className="p-2">46 - 48"</td>
                    <td className="p-2">30.5"</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-bold">X-Large (XL)</td>
                    <td className="p-2">49 - 52"</td>
                    <td className="p-2">31.5"</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <button
              onClick={() => setSizeGuideOpen(false)}
              className="w-full py-2.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-wider"
            >
              Close Guide
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage(props: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense
      fallback={
        <div className="py-32 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-2 border-black dark:border-white border-t-transparent" />
        </div>
      }
    >
      <ProductDetailContent {...props} />
    </Suspense>
  );
}

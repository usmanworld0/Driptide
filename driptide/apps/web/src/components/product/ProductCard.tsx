'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Product } from '@driptide/contracts';
import { useCart } from '@/context/CartContext';
import { getReferenceProductImage } from '@/lib/product-image';
import { Check, ShoppingBag } from 'lucide-react';

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState(false);
  const variant = product.variants.find((item) => item.stockQuantity > 0);
  const image = getReferenceProductImage(product);
  const colors = Array.from(new Set(product.variants.map((item) => `${item.color || ''}|${item.colorHex || ''}`).filter((item) => item !== '|')));
  const price = (product.basePriceMinor / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  async function quickAdd() {
    if (!variant || busy) return;
    setBusy(true);
    try { await addToCart(variant.id, 1); setAdded(true); window.setTimeout(() => setAdded(false), 1600); }
    finally { setBusy(false); }
  }

  return (
    <article className="store-product">
      <div className="store-product__media">
        <Link href={`/product/${product.slug}`} aria-label={`View ${product.name}`}><img src={image} alt={product.name} loading="lazy" />
          {product.isNewArrival && <span className="store-product__badge">New</span>}
        </Link>
        <button type="button" className="store-product__quick-add" onClick={quickAdd} disabled={!variant || busy} aria-label={`Add ${product.name} to bag`}>
          {added ? <><Check size={14} /> Added to bag</> : <><ShoppingBag size={14} /> Quick add</>}
        </button>
      </div>
      <div className="store-product__meta">
        <div className="store-product__name-price"><Link href={`/product/${product.slug}`}>{product.name}</Link><span>{price}</span></div>
        <p>{product.tagline || product.category?.name || 'Driptide essential'}</p>
        {colors.length > 0 && <div className="store-product__swatches" aria-label={`${colors.length} color options`}>{colors.slice(0, 5).map((value) => { const [name, hex] = value.split('|'); return <span key={value} title={name} style={{ backgroundColor: hex || '#ddd' }} />; })}{colors.length > 5 && <small>+{colors.length - 5}</small>}</div>}
      </div>
    </article>
  );
}

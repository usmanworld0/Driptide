'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product, ProductVariant } from '@driptide/contracts';
import { useCart } from '@/context/CartContext';
import { getReferenceProductImage } from '@/lib/product-image';
import { ArrowRight, Check } from 'lucide-react';

export function CampaignProductCard({ product }: { product: Product }) {
  const { addToCart, isLoading } = useCart();
  const [selected, setSelected] = useState<ProductVariant | null>(null);
  const [status, setStatus] = useState('');
  const image = getReferenceProductImage(product);
  const variants = useMemo(() => product.variants.filter((variant) => variant.stockQuantity > 0), [product.variants]);
  const sizes = Array.from(new Set(variants.map((variant) => variant.size).filter((size): size is string => Boolean(size))));
  const price = (product.basePriceMinor / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  async function quickAdd() {
    const variant = selected || (sizes.length === 0 && variants.length === 1 ? variants[0] : null);
    if (!variant) { setStatus('Choose an available size first.'); return; }
    await addToCart(variant.id, 1);
    setStatus('Added to bag');
    window.setTimeout(() => setStatus(''), 1800);
  }

  return <article className="campaign-product">
    <Link href={`/product/${product.slug}`} className="campaign-product__image"><Image fill unoptimized sizes="(max-width: 767px) 50vw, 25vw" src={image} alt={product.name} />{product.isNewArrival && <span className="campaign-product__badge">New</span>}</Link>
    <div className="campaign-product__details">
      <div className="campaign-product__top"><Link href={`/product/${product.slug}`}>{product.name}</Link><span>{price}</span></div>
      <p>{product.tagline || product.category?.name || 'Driptide essentials'}</p>
      {sizes.length > 0 && <div className="campaign-product__sizes" aria-label={`Available sizes for ${product.name}`}>
        {sizes.map((size) => {
          const variant = variants.find((candidate) => candidate.size === size);
          if (!variant) return null;
          return <button type="button" key={size} aria-pressed={selected?.id === variant.id} onClick={() => { setSelected(variant); setStatus(''); }}>{size}</button>;
        })}
      </div>}
      <button type="button" className="campaign-product__add" disabled={isLoading || !variants.length} onClick={quickAdd}>
        {status === 'Added to bag' ? <><Check size={14} /> Added to bag</> : <>Add to bag <ArrowRight size={14} /></>}
      </button>
      {status && status !== 'Added to bag' && <p className="campaign-product__status" role="status">{status}</p>}
      {!variants.length && <p className="campaign-product__status">Sold out</p>}
    </div>
  </article>;
}

'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Filter, Search, SlidersHorizontal, X } from 'lucide-react';
import type { Category, Product } from '@driptide/contracts';
import { api } from '@/lib/api';
import { ProductGrid } from './ProductGrid';

type SortOrder = 'featured' | 'price-ascending' | 'price-descending' | 'newest';

export function CollectionBrowser({
  initialCategory = '',
  initialSearch = '',
  newArrivalsOnly = false,
}: {
  initialCategory?: string;
  initialSearch?: string;
  newArrivalsOnly?: boolean;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [available, setAvailable] = useState(false);
  const [sort, setSort] = useState<SortOrder>('featured');
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setFailed(false);
    Promise.all([
      api.getCategories(),
      api.getProducts({ category: initialCategory || undefined, search: initialSearch || undefined, newArrival: newArrivalsOnly || undefined, sort: 'featured' }),
    ]).then(([nextCategories, nextProducts]) => {
      if (active) { setCategories(nextCategories); setProducts(nextProducts); }
    }).catch(() => { if (active) setFailed(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [initialCategory, initialSearch, newArrivalsOnly]);

  const category = categories.find((item) => item.slug === initialCategory);
  const colors = useMemo(() => Array.from(new Map(products.flatMap((product) => product.variants)
    .filter((variant) => variant.color)
    .map((variant) => [variant.color!.toLowerCase(), { name: variant.color!, hex: variant.colorHex || '#dedede' }])).values()), [products]);
  const visibleProducts = useMemo(() => {
    const filtered = products.filter((product) => {
      if (search.trim() && !`${product.name} ${product.tagline || ''} ${product.description}`.toLowerCase().includes(search.trim().toLowerCase())) return false;
      if (size && !product.variants.some((variant) => variant.size?.toLowerCase() === size.toLowerCase())) return false;
      if (color && !product.variants.some((variant) => variant.color?.toLowerCase() === color.toLowerCase())) return false;
      if (available && product.totalStock <= 0) return false;
      return true;
    });
    return filtered.sort((a, b) => {
      if (sort === 'price-ascending') return a.basePriceMinor - b.basePriceMinor;
      if (sort === 'price-descending') return b.basePriceMinor - a.basePriceMinor;
      if (sort === 'newest') return b.createdAt.localeCompare(a.createdAt);
      return Number(b.featured) - Number(a.featured);
    });
  }, [products, size, color, available, sort]);

  const clearFilters = () => { setSize(''); setColor(''); setAvailable(false); };
  const filterPanel = (
    <div className="collection-filters__inner">
      <div className="collection-filters__heading"><span>Filter</span><button type="button" onClick={clearFilters}>Clear all</button></div>
      <details open className="collection-filter">
        <summary>Availability</summary>
        <label><input type="checkbox" checked={available} onChange={(event) => setAvailable(event.target.checked)} /> In stock</label>
      </details>
      <details className="collection-filter">
        <summary>Size</summary>
        <div className="collection-filter__sizes">{['XS', 'S', 'M', 'L', 'XL', '2XL'].map((item) => <button type="button" aria-pressed={size === item} key={item} onClick={() => setSize(size === item ? '' : item)}>{item}</button>)}</div>
      </details>
      {colors.length > 0 && <details className="collection-filter">
        <summary>Color</summary>
        <div className="collection-filter__colors">{colors.map((item) => <button type="button" key={item.name} aria-pressed={color === item.name.toLowerCase()} onClick={() => setColor(color === item.name.toLowerCase() ? '' : item.name.toLowerCase())}><i style={{ backgroundColor: item.hex }} />{item.name}</button>)}</div>
      </details>}
      <details className="collection-filter" open>
        <summary>Category</summary>
        <div className="collection-filter__categories"><Link href="/shop" aria-current={!initialCategory ? 'page' : undefined}>All products</Link>{categories.map((item) => <Link key={item.id} href={`/category/${item.slug}`} aria-current={item.slug === initialCategory ? 'page' : undefined}>{item.name}</Link>)}</div>
      </details>
    </div>
  );

  return (
    <div className="collection-page">
      <div className="collection-breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/shop">Shop</Link>{category && <><span>/</span><span>{category.name}</span></>}</div>
      <header className="collection-heading">
        <div><span>{newArrivalsOnly ? 'JUST LANDED' : 'THE DRIPTIDE EDIT'}</span><h1>{category?.name || (newArrivalsOnly ? 'New arrivals' : 'Shop all')}</h1>
          {category?.description && <p>{category.description}</p>}
        </div>
      </header>
      <div className="collection-toolbar">
        <label className="collection-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search" aria-label="Search products" /></label>
        <span className="collection-count">{loading ? 'Loading' : `${visibleProducts.length} products`}</span>
        <button className="collection-filter-toggle" type="button" onClick={() => setMobileFiltersOpen(true)}><Filter size={15} /> Filter</button>
        <label className="collection-sort"><SlidersHorizontal size={15} /><span>Sort by</span><select value={sort} onChange={(event) => setSort(event.target.value as SortOrder)}><option value="featured">Featured</option><option value="newest">Newest</option><option value="price-ascending">Price: low to high</option><option value="price-descending">Price: high to low</option></select></label>
      </div>
      <div className="collection-layout">
        <aside className="collection-filters collection-filters--desktop" aria-label="Product filters">{filterPanel}</aside>
        <section className="collection-results" aria-label="Products">
          {loading ? <div className="collection-loading" role="status">Loading products…</div> : failed ? <div className="collection-loading" role="status">Products are temporarily unavailable. Please try again.</div> : <ProductGrid products={visibleProducts} emptyMessage="No products match these filters." />}
        </section>
      </div>
      {mobileFiltersOpen && <div className="collection-filter-sheet" role="dialog" aria-modal="true" aria-label="Filter products"><button className="collection-filter-sheet__backdrop" type="button" aria-label="Close filters" onClick={() => setMobileFiltersOpen(false)} /><section><header><span>Filter and sort</span><button type="button" onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters"><X size={20} /></button></header>{filterPanel}<button type="button" className="collection-filter-sheet__apply" onClick={() => setMobileFiltersOpen(false)}>Show {visibleProducts.length} products</button></section></div>}
    </div>
  );
}

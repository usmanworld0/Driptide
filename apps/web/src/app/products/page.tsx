import { Suspense } from 'react';
import { CollectionBrowser } from '@/components/product/CollectionBrowser';

export const metadata = { title: 'Shop products | Driptide' };

export default function ProductsPage() {
  return (
    <>
      <section className="catalog-masthead catalog-masthead--products">
        <span>DRIPTIDE 2026</span>
        <h1>New Products</h1>
        <p>Discover the latest Driptide clothing and footwear.</p>
      </section>
      <Suspense fallback={<div className="collection-loading">Loading products…</div>}>
        <CollectionBrowser />
      </Suspense>
    </>
  );
}

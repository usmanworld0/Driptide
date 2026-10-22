'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CollectionBrowser } from '@/components/product/CollectionBrowser';

function ShopContent() {
  const params = useSearchParams();
  return <CollectionBrowser initialCategory={params.get('category') || ''} initialSearch={params.get('search') || ''} newArrivalsOnly={params.get('newArrival') === 'true'} />;
}

export default function ShopPage() {
  return <Suspense fallback={<div className="collection-loading">Loading the collection…</div>}><ShopContent /></Suspense>;
}

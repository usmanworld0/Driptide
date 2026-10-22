'use client';

import { Suspense, use } from 'react';
import { CollectionBrowser } from '@/components/product/CollectionBrowser';

function CategoryContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <CollectionBrowser initialCategory={slug} />;
}

export default function CategoryPage(props: { params: Promise<{ slug: string }> }) {
  return <Suspense fallback={<div className="collection-loading">Loading the collection…</div>}><CategoryContent {...props} /></Suspense>;
}

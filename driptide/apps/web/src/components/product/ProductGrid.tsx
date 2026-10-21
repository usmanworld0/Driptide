'use client';

import React from 'react';
import { Product } from '@driptide/contracts';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
}

export function ProductGrid({
  products,
  emptyMessage = 'No products found matching your selection.',
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-xs uppercase tracking-widest text-neutral-500 font-medium">
          {emptyMessage}
        </p>
      </div>
    );
  }

  return (
    <div className="store-product-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

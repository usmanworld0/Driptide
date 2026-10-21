'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@driptide/contracts';
import { api } from '@/lib/api';
import { CampaignProductCard } from '@/components/campaign/CampaignProductCard';
import Link from 'next/link';

export function HomeFeaturedProducts({ title = 'New arrivals', eyebrow = 'JUST LANDED', newArrivalsOnly = true }: { title?: string; eyebrow?: string; newArrivalsOnly?: boolean }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [failed, setFailed] = useState(false);
  const headingId = `home-products-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  useEffect(() => {
    let active = true;
    api.getProducts({ newArrival: newArrivalsOnly ? true : undefined, featured: newArrivalsOnly ? undefined : true, sort: 'featured' })
      .then((items) => { if (active) setProducts(items.slice(0, 4)); })
      .catch(() => { if (active) setFailed(true); });
    return () => { active = false; };
  }, [newArrivalsOnly]);

  return (
    <section className="home-products" data-reveal aria-labelledby={headingId}>
      <div className="home-section-heading">
        <div><span>{eyebrow}</span><h2 id={headingId}>{title}</h2></div>
        <Link href={newArrivalsOnly ? '/shop?newArrival=true' : '/shop'}>View all <span aria-hidden="true">↗</span></Link>
      </div>
      {products.length > 0 ? (
        <div className="home-products__grid">
          {products.map((product) => <CampaignProductCard key={product.id} product={product} />)}
        </div>
      ) : (
        <p className="home-products__state" role="status">{failed ? 'The collection is temporarily unavailable.' : 'Loading new arrivals…'}</p>
      )}
    </section>
  );
}

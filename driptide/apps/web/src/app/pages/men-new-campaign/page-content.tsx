'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@driptide/contracts';
import { api } from '@/lib/api';
import { CampaignProductCard } from '@/components/campaign/CampaignProductCard';

const banners = [
  {
    desktop: 'https://outfitters.com.pk/cdn/shop/files/Men_Web_7770a709-a530-4582-8bca-78337df29e41_1600x.jpg?v=1790160738',
    mobile: 'https://outfitters.com.pk/cdn/shop/files/Men_Mobile_de08891d-1019-4754-8383-482133701995_900x.jpg?v=1790160743',
    alt: 'Driptide winter campaign',
    shape: 'campaign-banner--hero',
  },
  {
    desktop: 'https://outfitters.com.pk/cdn/shop/files/Web_8e424e86-4f63-42d9-ac8b-86cf1afce271_1600x.png?v=1790160756',
    mobile: 'https://outfitters.com.pk/cdn/shop/files/Mobile_a693cce4-d933-42f6-bb4d-eae96cae9c5c_900x.png?v=1790160759',
    alt: 'Driptide autumn collection',
    shape: 'campaign-banner--wide',
  },
  {
    desktop: 'https://outfitters.com.pk/cdn/shop/files/7_86bc9d31-935b-4660-8aea-ac6f14e7ceea_1600x.jpg?v=1790162864',
    mobile: 'https://outfitters.com.pk/cdn/shop/files/7_45ef5901-d27e-458b-b8d1-29ad25766ec3_900x.jpg?v=1790162874',
    alt: 'Driptide seasonal story',
    shape: 'campaign-banner--hero',
  },
];

const campaignVideos = [
  { desktop: 'https://outfitters.com.pk/cdn/shop/videos/c/vp/2d02c2d940774c05b08ae03a35275cc5/2d02c2d940774c05b08ae03a35275cc5.HD-1080p-2.5Mbps-95303184.mp4?v=0', mobile: 'https://outfitters.com.pk/cdn/shop/videos/c/vp/17678f67ddb848efabb0eeab6774adb4/17678f67ddb848efabb0eeab6774adb4.SD-480p-0.9Mbps-95303021.mp4?v=0', poster: 'https://outfitters.com.pk/cdn/shop/files/preview_images/2d02c2d940774c05b08ae03a35275cc5.thumbnail.0000000000_1600x.jpg?v=1790161202', mobilePoster: 'https://outfitters.com.pk/cdn/shop/files/preview_images/17678f67ddb848efabb0eeab6774adb4.thumbnail.0000000000_900x.jpg?v=1790161074' },
  { desktop: 'https://outfitters.com.pk/cdn/shop/videos/c/vp/5db3a1c0a7364a5da3aafe911a925978/5db3a1c0a7364a5da3aafe911a925978.HD-1080p-2.5Mbps-95303186.mp4?v=0', mobile: 'https://outfitters.com.pk/cdn/shop/videos/c/vp/890b088cd68a4887b9ba95f9e89526cc/890b088cd68a4887b9ba95f9e89526cc.SD-480p-0.9Mbps-95303023.mp4?v=0', poster: 'https://outfitters.com.pk/cdn/shop/files/preview_images/5db3a1c0a7364a5da3aafe911a925978.thumbnail.0000000000_1600x.jpg?v=1790161202', mobilePoster: 'https://outfitters.com.pk/cdn/shop/files/preview_images/890b088cd68a4887b9ba95f9e89526cc.thumbnail.0000000000_900x.jpg?v=1790161074' },
  { desktop: 'https://outfitters.com.pk/cdn/shop/videos/c/vp/0f8c34267bc44914bbb0622fbcfd7cfe/0f8c34267bc44914bbb0622fbcfd7cfe.HD-1080p-2.5Mbps-95303185.mp4?v=0', mobile: 'https://outfitters.com.pk/cdn/shop/videos/c/vp/73a9c53800e94094b700e62e9f5d9dc6/73a9c53800e94094b700e62e9f5d9dc6.SD-480p-0.9Mbps-95303022.mp4?v=0', poster: 'https://outfitters.com.pk/cdn/shop/files/preview_images/0f8c34267bc44914bbb0622fbcfd7cfe.thumbnail.0000000000_1600x.jpg?v=1790161203', mobilePoster: 'https://outfitters.com.pk/cdn/shop/files/preview_images/73a9c53800e94094b700e62e9f5d9dc6.thumbnail.0000000000_900x.jpg?v=1790161074' },
  { desktop: 'https://outfitters.com.pk/cdn/shop/videos/c/vp/9556417f96aa4d6b97391fdf23df7dd6/9556417f96aa4d6b97391fdf23df7dd6.HD-1080p-2.5Mbps-95303187.mp4?v=0', mobile: 'https://outfitters.com.pk/cdn/shop/videos/c/vp/58d1bf39c86f48218e2eb7ee71bb6b89/58d1bf39c86f48218e2eb7ee71bb6b89.SD-480p-0.9Mbps-95303024.mp4?v=0', poster: 'https://outfitters.com.pk/cdn/shop/files/preview_images/9556417f96aa4d6b97391fdf23df7dd6.thumbnail.0000000000_1600x.jpg?v=1790161203', mobilePoster: 'https://outfitters.com.pk/cdn/shop/files/preview_images/58d1bf39c86f48218e2eb7ee71bb6b89.thumbnail.0000000000_900x.jpg?v=1790161074' },
  { desktop: 'https://outfitters.com.pk/cdn/shop/videos/c/vp/dd9e03ca226b43959f4675650b53503d/dd9e03ca226b43959f4675650b53503d.HD-1080p-2.5Mbps-95303189.mp4?v=0', mobile: 'https://outfitters.com.pk/cdn/shop/videos/c/vp/ae03988bd1614d9ba852ef88d5a92b4d/ae03988bd1614d9ba852ef88d5a92b4d.SD-480p-0.9Mbps-95303025.mp4?v=0', poster: 'https://outfitters.com.pk/cdn/shop/files/preview_images/dd9e03ca226b43959f4675650b53503d.thumbnail.0000000000_1600x.jpg?v=1790161203', mobilePoster: 'https://outfitters.com.pk/cdn/shop/files/preview_images/ae03988bd1614d9ba852ef88d5a92b4d.thumbnail.0000000000_900x.jpg?v=1790161075' },
  { desktop: 'https://outfitters.com.pk/cdn/shop/videos/c/vp/4badc79d74c64d6e8b0dd79a39f3ca3b/4badc79d74c64d6e8b0dd79a39f3ca3b.HD-1080p-2.5Mbps-95303183.mp4?v=0', mobile: 'https://outfitters.com.pk/cdn/shop/videos/c/vp/19c09aa3f8ea4ff387e5112dda8616dc/19c09aa3f8ea4ff387e5112dda8616dc.SD-480p-0.9Mbps-95303019.mp4?v=0', poster: 'https://outfitters.com.pk/cdn/shop/files/preview_images/4badc79d74c64d6e8b0dd79a39f3ca3b.thumbnail.0000000000_1600x.jpg?v=1790161203', mobilePoster: 'https://outfitters.com.pk/cdn/shop/files/preview_images/19c09aa3f8ea4ff387e5112dda8616dc.thumbnail.0000000000_900x.jpg?v=1790161074' },
];

export default function CampaignPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let active = true;
    api.getProducts({ sort: 'featured' })
      .then((items) => { if (active) setProducts(items); })
      .catch(() => { if (active) setLoadError(true); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const renderProducts = (items: Product[]) => (
    <section className="reference-product-list" aria-label="Driptide new collection">
      {items.length > 0 && <div className="reference-product-list__grid">{items.map((product) => <CampaignProductCard key={product.id} product={product} />)}</div>}
    </section>
  );

  return (
    <div className="campaign-page">
      <div className="campaign-banners">
        {banners.map((banner, index) => (
          <section className={`campaign-banner ${banner.shape}`} key={banner.desktop}>
            <picture>
              <source media="(max-width: 749px)" srcSet={banner.mobile} />
              <img src={banner.desktop} alt={banner.alt} fetchPriority={index === 0 ? 'high' : 'auto'} loading={index === 0 ? 'eager' : 'lazy'} />
            </picture>
          </section>
        ))}
      </div>

      {loading ? <div className="campaign-state" role="status">Loading the collection…</div> : loadError ? (
        <div className="campaign-state" role="status">The collection is temporarily unavailable. Please try again shortly.</div>
      ) : products.length > 0 ? renderProducts(products.slice(0, 3)) : <div className="campaign-state">The new season collection is coming soon.</div>}
      <CampaignVideo media={campaignVideos[0]} />
      {!loading && !loadError && renderProducts(products.slice(3))}
      {campaignVideos.slice(1).map((media, index) => <CampaignVideo key={media.desktop} media={media} label={`Driptide campaign film ${index + 2}`} />)}
    </div>
  );
}

type CampaignVideoMedia = (typeof campaignVideos)[number];

function CampaignVideo({ media, label = 'Driptide seasonal campaign film' }: { media: CampaignVideoMedia; label?: string }) {
  return <section className="reference-video" aria-label={label}>
    <video className="reference-video__desktop" autoPlay muted loop playsInline preload="metadata" poster={media.poster} aria-label={label}>
      <source src={media.desktop} type="video/mp4" />
    </video>
    <video className="reference-video__mobile" autoPlay muted loop playsInline preload="metadata" poster={media.mobilePoster} aria-label={label}>
      <source src={media.mobile} type="video/mp4" />
    </video>
  </section>;
}

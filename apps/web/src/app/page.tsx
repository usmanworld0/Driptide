import type { Metadata } from 'next';
import Link from 'next/link';
import { HomeFeaturedProducts } from '@/components/home/HomeFeaturedProducts';
import { HomeCategoryFocus } from '@/components/home/HomeCategoryFocus';
import { HomeCategoryCarousel } from '@/components/home/HomeCategoryCarousel';
import { RevealSections } from '@/components/home/RevealSections';
import { CampaignFilm } from '@/components/home/CampaignFilm';
import { HomeHeroCarousel } from '@/components/home/HomeHeroCarousel';

export const metadata: Metadata = {
  title: 'Driptide â€” New Season',
  description: 'Shop the latest Driptide styles, essentials, and new season edits.',
};

const edits = [
  {
    eyebrow: 'New denim drop',
    title: 'Wide leg jeans',
    image: 'https://outfitters.com.pk/cdn/shop/files/Men_Web_0cb72726-eac6-417c-a086-d902db00cc28.jpg?v=1792147448&width=1800',
    mobile: 'https://outfitters.com.pk/cdn/shop/files/Men_Mobile_29136ad9-c961-44c6-bd3f-9cc3cd16d21d.jpg?v=1792147452&width=900',
    href: '/category/trousers-denim',
  },
  {
    eyebrow: 'Shop the mood',
    title: 'Dress for the\nmood you’re in.',
    image: 'https://outfitters.com.pk/cdn/shop/files/M_Off-Duty_Web.png?v=1790165853&width=1200',
    mobile: 'https://outfitters.com.pk/cdn/shop/files/M_Off-Duty_Mobile.png?v=1790165860&width=800',
    href: '/shop',
  },
];

const categories = [
  { name: 'T-shirts & tops', image: 'https://outfitters.com.pk/cdn/shop/files/T_shirts_6314b1fd-2230-4dcb-8281-a2187f998bcc.jpg?v=1790321039&width=700', href: '/category/t-shirts-tops' },
  { name: 'Polos', image: 'https://outfitters.com.pk/cdn/shop/files/F1781106204-1.jpg?v=1791445296&width=700', href: '/category/polos' },
  { name: 'Shirts & shackets', image: 'https://outfitters.com.pk/cdn/shop/files/F1034103816.jpg?v=1785303610&width=700', href: '/category/shirts' },
  { name: 'Activewear', image: 'https://outfitters.com.pk/cdn/shop/files/F0292125119-1.jpg?v=1789629335&width=700', href: '/category/activewear' },
  { name: 'Denim', image: 'https://outfitters.com.pk/cdn/shop/files/Denim_107b72c8-518d-4227-b450-110df2eb2207.jpg?v=1790321131&width=700', href: '/category/trousers-denim' },
  { name: 'Trousers', image: 'https://outfitters.com.pk/cdn/shop/files/Trousers_Web_64f79159-df88-4a1e-a88a-e9c92aec46e4.jpg?v=1790321842&width=700', href: '/category/trousers-denim' },
  { name: 'Hoodies & sweats', image: 'https://outfitters.com.pk/cdn/shop/files/Sweatshirts_Web.jpg?v=1790321766&width=700', href: '/category/hoodies-sweats' },
  { name: 'Shorts', image: 'https://outfitters.com.pk/cdn/shop/files/F0183110903LOWER3.jpg?v=1791445191&width=700', href: '/category/shorts' },
  { name: 'Sweaters', image: 'https://outfitters.com.pk/cdn/shop/files/F0183102901_2.jpg?v=1790570831&width=700', href: '/category/sweaters' },
  { name: 'Outerwear', image: 'https://outfitters.com.pk/cdn/shop/files/Outwears.jpg?v=1790321392&width=700', href: '/category/outerwear' },
  { name: 'Footwear', image: 'https://outfitters.com.pk/cdn/shop/files/F0393112113_11.jpg?v=1775560116&width=700', href: '/category/footwear' },
  { name: 'Fragrances', image: 'https://outfitters.com.pk/cdn/shop/files/F0102124998_3_copy.jpg?v=1755843658&width=700', href: '/category/fragrances' },
  { name: 'Accessories', image: 'https://outfitters.com.pk/cdn/shop/files/menu_tile_men_2420934a-0943-458a-991a-7cbb3215983f.jpg?v=1790943560&width=700', href: '/category/accessories' },
  { name: 'Sale', image: 'https://outfitters.com.pk/cdn/shop/files/Men_Web_0cb72726-eac6-417c-a086-d902db00cc28.jpg?v=1792147448&width=700', href: '/category/sale' },
];

const communityFilms = [
  {
    desktop: 'https://outfitters.com.pk/cdn/shop/videos/c/vp/8b995d0da5ae408692525670ff308ffc/8b995d0da5ae408692525670ff308ffc.HD-1080p-4.8Mbps-97845219.mp4?v=0',
    mobile: 'https://outfitters.com.pk/cdn/shop/videos/c/vp/16a6eab268bb4dc9992a61d8eab26571/16a6eab268bb4dc9992a61d8eab26571.HD-1080p-2.5Mbps-97845217.mp4?v=0',
    poster: 'https://outfitters.com.pk/cdn/shop/files/preview_images/8b995d0da5ae408692525670ff308ffc.thumbnail.0000000000_800x.jpg?v=1792147254',
    mobilePoster: 'https://outfitters.com.pk/cdn/shop/files/preview_images/16a6eab268bb4dc9992a61d8eab26571.thumbnail.0000000000_600x.jpg?v=1792147248',
  },
  {
    desktop: 'https://outfitters.com.pk/cdn/shop/videos/c/vp/fc3c74f6acc7462a96c7289c8a188944/fc3c74f6acc7462a96c7289c8a188944.HD-1080p-3.3Mbps-95302897.mp4?v=0',
    mobile: 'https://outfitters.com.pk/cdn/shop/videos/c/vp/7f8df478a78f464fb22d8c556c60ccc5/7f8df478a78f464fb22d8c556c60ccc5.HD-1080p-2.5Mbps-95302893.mp4?v=0',
    poster: 'https://outfitters.com.pk/cdn/shop/files/preview_images/fc3c74f6acc7462a96c7289c8a188944.thumbnail.0000000000_800x.jpg?v=1790160984',
    mobilePoster: 'https://outfitters.com.pk/cdn/shop/files/preview_images/7f8df478a78f464fb22d8c556c60ccc5.thumbnail.0000000000_600x.jpg?v=1790160984',
  },
  {
    desktop: 'https://outfitters.com.pk/cdn/shop/videos/c/vp/9fbcc2f567c940148b2ca03f8c67536b/9fbcc2f567c940148b2ca03f8c67536b.HD-1080p-4.8Mbps-97845220.mp4?v=0',
    mobile: 'https://outfitters.com.pk/cdn/shop/videos/c/vp/53f7159326a843f5bdf1b48a1710d07a/53f7159326a843f5bdf1b48a1710d07a.HD-1080p-2.5Mbps-97845218.mp4?v=0',
    poster: 'https://outfitters.com.pk/cdn/shop/files/preview_images/9fbcc2f567c940148b2ca03f8c67536b.thumbnail.0000000000_800x.jpg?v=1792147248',
    mobilePoster: 'https://outfitters.com.pk/cdn/shop/files/preview_images/53f7159326a843f5bdf1b48a1710d07a.thumbnail.0000000000_600x.jpg?v=1792147247',
  },
  {
    desktop: 'https://outfitters.com.pk/cdn/shop/videos/c/vp/c471ccfa19e047d0aa1d9c4f73f27e7a/c471ccfa19e047d0aa1d9c4f73f27e7a.HD-1080p-3.3Mbps-95302900.mp4?v=0',
    mobile: 'https://outfitters.com.pk/cdn/shop/videos/c/vp/4d0d3b2d6c9845e580eb58250b6a7572/4d0d3b2d6c9845e580eb58250b6a7572.HD-1080p-2.5Mbps-95302899.mp4?v=0',
    poster: 'https://outfitters.com.pk/cdn/shop/files/preview_images/c471ccfa19e047d0aa1d9c4f73f27e7a.thumbnail.0000000000_800x.jpg?v=1790160984',
    mobilePoster: 'https://outfitters.com.pk/cdn/shop/files/preview_images/4d0d3b2d6c9845e580eb58250b6a7572.thumbnail.0000000000_600x.jpg?v=1790160983',
  },
];

const heroSlides = communityFilms.slice(0, 3).map((film, index) => ({
  ...film,
  eyebrow: ['NEW SEASON Â· 2026', 'THE CITY EDIT', 'MADE TO MOVE', 'OFF DUTY, YOUR WAY'][index] ?? 'THE DRIPTIDE EDIT',
  title: ['FW 2026-2027', 'Sweats FW 2026-2027', 'Season Preview FW 26-27'][index],
  href: ['/shop?newArrival=true', '/shop', '/category/activewear', '/category/shirts'][index] ?? '/shop',
}));

export default function HomePage() {
  return (
    <RevealSections>
      <HomeHeroCarousel slides={heroSlides} />
      <section className="home-categories" data-reveal aria-labelledby="home-categories-title">
        <h2 id="home-categories-title" className="sr-only">Shop by categories</h2>
        <HomeCategoryCarousel categories={categories} />
      </section>
      <HomeCategoryFocus />

      <HomeFeaturedProducts />

      <section className="home-editorial" data-reveal aria-label="Driptide collection stories">
        {edits.map((edit, index) => (
          <Link href={edit.href} className="home-editorial__card" key={edit.eyebrow}>
            <picture>
              <source media="(max-width: 749px)" srcSet={edit.mobile} />
              <img src={edit.image} alt={edit.eyebrow} loading="lazy" />
            </picture>
            <span className="home-editorial__copy"><strong>{edit.title}</strong></span>
          </Link>
        ))}
      </section>

      <HomeFeaturedProducts title="Trending now" eyebrow="MOST WANTED" newArrivalsOnly={false} productLimit={5} />

      <section className="home-community-films" data-reveal aria-label="Campaign films">
        <div className="home-section-heading"><div><span>COMMUNITY</span><h2>Explore the latest looks</h2></div><Link href="/shop">Shop the edit <span aria-hidden="true">â†—</span></Link></div>
        <div className="home-community-films__grid">{communityFilms.map((film, index) => <CampaignFilm key={film.desktop} {...film} index={index + 1} />)}</div>
      </section>

      <section className="home-community">
        <span>DRIPTIDE COMMUNITY</span>
        <h2>Made for your everyday.</h2>
        <p>Easy layers. Considered details. Your own way of wearing them.</p>
        <Link href="/shop">Explore the collection <span aria-hidden="true">â†—</span></Link>
      </section>
    </RevealSections>
  );
}

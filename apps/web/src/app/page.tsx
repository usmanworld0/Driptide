import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { RevealSections } from '@/components/home/RevealSections';

export const metadata: Metadata = {
  title: 'DRIPTIDE — Contemporary Fashion',
  description: 'Shop contemporary clothing, footwear, and new collections from Driptide.',
};

const featuredProducts = [
  { name: 'Straight-Leg Jeans', price: '$246.00', image: 'straight-leg-jeans.png' },
  { name: 'Dark indigo Denim', price: '$217.00', image: 'dark-indigo-denim.png' },
  { name: 'Sienna Pea Coat', price: '$778.00', image: 'sienna-pea-coat.png' },
  { name: 'Charcoal crew-neck', price: '$655.00', image: 'charcoal-crew-neck.png' },
  { name: 'Umber Low-Tops', price: '$263.99', image: 'umber-low-tops.png' },
  { name: 'Onyx Leather', price: '$299.00', image: 'onyx-leather.png' },
];

const editorials = [
  { title: 'ELI 2026', image: 'editorial-eli.png' },
  { title: 'Kiot 2026', image: 'editorial-kiot.png' },
  { title: 'Chito 2026', image: 'editorial-chito.png' },
];

function ProductCard({ product }: { product: (typeof featuredProducts)[number] }) {
  return (
    <Link className="el-product" href="/shop">
      <span className="el-product__image">
        <Image src={`/driptide-reference/${product.image}`} alt={product.name} fill sizes="(max-width: 700px) 50vw, 25vw" />
      </span>
      <span className="el-product__details"><span>{product.name}</span><span>{product.price}</span></span>
    </Link>
  );
}

export default function HomePage() {
  return (
    <RevealSections>
      <section className="el-hero" aria-labelledby="el-hero-title">
        <div className="el-hero__copy">
          <h1 id="el-hero-title">New<br />Collections<br />2026<sup>©</sup></h1>
          <Link href="/collections">Explore Collections <span aria-hidden="true">↗</span></Link>
        </div>
        <p className="el-hero__aside">Contemporary fashion<br />from the heart of<br />London.</p>
        <Image className="el-hero__image" src="/driptide-reference/hero-campaign.png" alt="A group of models wearing the Driptide collection" fill priority sizes="(max-width: 700px) 100vw, 55vw" />
        <span className="el-hero__backdrop" aria-hidden="true">
          <span data-scroll data-scroll-speed="0.18">DRIPTIDE</span>
        </span>
        <span className="el-hero__index">01 / 03</span>
      </section>

      <section className="el-intro" aria-labelledby="el-intro-title">
        <div className="el-intro__copy">
          <h2 id="el-intro-title">Our products and collections</h2>
          <p>fashion pieces from the ’80s.</p>
          <Link href="/products">Discover Products <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="el-intro__gallery">
          <Link href="/category/outerwear" aria-label="Explore the Polo Jackets collection">
            <Image src="/driptide-reference/collection-polo.png" alt="Model wearing a ribbed polo, viewed from behind" fill sizes="(max-width: 700px) 50vw, 30vw" />
          </Link>
          <Link href="/category/shirts" aria-label="Explore the Basic Shirts collection">
            <Image src="/driptide-reference/collection-shirts.png" alt="Beige ribbed polo shirt" fill sizes="(max-width: 700px) 50vw, 30vw" />
          </Link>
        </div>
      </section>

      <section className="el-collections" id="collections" aria-labelledby="el-collections-title">
        <div className="el-collections__copy">
          <h2 id="el-collections-title">Popular Collection<br />sw winter (4)</h2>
          <p>Complete the look with complementary pieces designed to work together across seasons.</p>
          <Link href="/collections">More informations <span aria-hidden="true">↗</span></Link>
        </div>
        <Link href="/collections" className="el-collections__feature" aria-label="Explore the winter collection">
          <Image src="/driptide-reference/collection-feature.png" alt="Model wearing a beige ribbed polo and tailored trousers" fill sizes="(max-width: 700px) 100vw, 60vw" />
        </Link>
      </section>

      <section className="el-products" aria-labelledby="el-products-title">
        <div className="el-products__intro">
          <h2 id="el-products-title">Popular products<br />Driptide (6)</h2>
          <p>Discover clothing and footwear selected for everyday versatility, considered details, and effortless styling.</p>
          <Link href="/products">See More <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="el-products__grid">{featuredProducts.map((product) => <ProductCard key={product.name} product={product} />)}</div>
      </section>

      <section className="el-collection-banners" aria-label="Seasonal collections">
        <Link href="/shop" className="el-collection-banner">
          <Image src="/driptide-reference/mens-collection.png" alt="Men’s 2026 Collection" fill sizes="50vw" />
          <span><strong>Men’s 2026 Collection</strong><i>Discover more ↗</i></span>
        </Link>
        <Link href="/shop" className="el-collection-banner">
          <Image src="/driptide-reference/womens-collection.png" alt="Women’s 2026 Collection" fill sizes="50vw" />
          <span><strong>Women’s 2026 Collection</strong><i>Discover more ↗</i></span>
        </Link>
      </section>

      <section className="el-info" aria-label="Shipping and contact information">
        <article>
          <span>01 / DELIVERY</span>
          <h2>Shipping rules how you get the product.</h2>
          <p>Orders are prepared carefully and dispatched with tracking so you can follow every delivery. Delivery times vary by destination, with clear estimates provided before checkout.</p>
          <Link href="/shipping">Discover shipping <span aria-hidden="true">↗</span></Link>
        </article>
        <article>
          <span>02 / RETURNS</span>
          <h2>Considered service, from start to finish.</h2>
          <p>Returns are accepted within 30 days when items are unworn and returned in their original condition.</p>
          <Link href="/shipping">Shipping &amp; returns <span aria-hidden="true">↗</span></Link>
        </article>
        <article>
          <span>03 / CONTACT</span>
          <h2>Contact us how you can</h2>
          <p>Questions about an order, product, or collaboration? Our team is ready to help.</p>
          <Link href="/contact">Contact us <span aria-hidden="true">↗</span></Link>
        </article>
      </section>

      <section className="el-editorial" id="journal" aria-label="Latest campaign stories">
        <header className="el-editorial__heading"><span>SEASONAL STYLE</span><h2>Curated fashion<br />from London.</h2></header>
        <div className="el-editorial__grid">
          {editorials.map((story) => (
            <Link href="/shop" className="el-editorial-card" key={story.title}>
              <span className="el-editorial-card__image"><Image src={`/driptide-reference/${story.image}`} alt={`${story.title} seasonal fashion campaign`} fill sizes="(max-width: 700px) 85vw, 33vw" /></span>
              <span className="el-editorial-card__title">{story.title}<b aria-hidden="true">↗</b></span>
            </Link>
          ))}
        </div>
      </section>


    </RevealSections>
  );
}

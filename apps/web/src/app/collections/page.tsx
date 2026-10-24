import Image from 'next/image';
import Link from 'next/link';

export const metadata = { title: 'Collections | Driptide' };

const collections = [
  {
    name: 'Men’s 2026 Collection',
    note: 'Modern essentials and considered layers for everyday wear.',
    image: '/driptide-reference/mens-collection.png',
    href: '/category/outerwear',
  },
  {
    name: 'Women’s 2026 Collection',
    note: 'A new edit of versatile silhouettes and refined details.',
    image: '/driptide-reference/womens-collection.png',
    href: '/category/shirts',
  },
];

export default function CollectionsPage() {
  return (
    <div className="driptide-collections">
      <header className="driptide-collections__heading">
        <span>DRIPTIDE / 2026</span>
        <h1>New collections</h1>
        <p>Explore the latest Driptide edit: contemporary pieces, effortless layers, and considered details for the season.</p>
        <Link href="/products">Shop all products <span aria-hidden="true">↗</span></Link>
      </header>
      <div className="driptide-collections__grid">
        {collections.map((collection, index) => (
          <Link className="driptide-collections__card" href={collection.href} key={collection.name}>
            <span className="driptide-collections__image">
              <Image src={collection.image} alt={collection.name} fill sizes="(max-width: 700px) 100vw, 50vw" priority={index === 0} />
            </span>
            <span className="driptide-collections__details">
              <span><small>0{index + 1} / COLLECTION</small><strong>{collection.name}</strong><em>{collection.note}</em></span>
              <b aria-hidden="true">↗</b>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

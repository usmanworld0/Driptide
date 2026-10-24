import Image from 'next/image';
import Link from 'next/link';

export const metadata = { title: 'About Driptide' };

export default function AboutPage() {
  return (
    <article className="store-info-page store-info-page--about driptide-story">
      <header className="driptide-story__heading">
        <span>OUR STORY</span>
        <h1>We stand on innovation.</h1>
      </header>
      <div className="driptide-story__body">
        <Image src="/driptide-reference/story-campaign-brown.png" alt="Driptide contemporary fashion campaign" width={800} height={1066} priority />
        <div>
          <p>The customer is at the heart of our unique business model, which brings design, production, distribution, and sales together.</p>
          <p>Driptide is an independent fashion label creating contemporary clothing and footwear for a modern, expressive wardrobe.</p>
          <p>We focus on refined silhouettes, thoughtful details, and versatile pieces made to move between seasons.</p>
          <p>Our collections are evolving compositions of seasonless, gender-neutral essentials. Each piece is designed around individuality and the freedom to dress on your own terms.</p>
          <Link href="/collections">Discover Driptide collections <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
    </article>
  );
}

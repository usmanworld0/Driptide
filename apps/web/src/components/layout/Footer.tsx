import Link from 'next/link';
import { NewsletterSignup } from './NewsletterSignup';

const footerGroups = [
  { title: 'Customer care', links: [['Contact us', '/contact'], ['FAQs', '/faq'], ['Shipping & delivery', '/shipping'], ['Returns & exchanges', '/shipping']] },
  { title: 'About', links: [['Our story', '/about'], ['Shop all', '/shop'], ['New arrivals', '/shop?newArrival=true']] },
  { title: 'Your account', links: [['My account', '/account'], ['Order status', '/account'], ['Shopping bag', '/shop']] },
];

export function Footer() {
  return (
    <footer className="store-footer">
      <section className="store-footer__signup">
        <div><span>THE DRIPTIDE LIST</span><h2>Good things, in your inbox.</h2><p>Be first to hear about new releases and the latest from Driptide.</p></div>
        <NewsletterSignup />
      </section>
      <div className="store-footer__main">
        <Link className="store-footer__wordmark" href="/" aria-label="Driptide home">DRIPTIDE</Link>
        <div className="store-footer__groups">
          {footerGroups.map((group) => <nav key={group.title} aria-label={group.title}><h3>{group.title}</h3>{group.links.map(([label, href]) => <Link key={label} href={href}>{label}</Link>)}</nav>)}
        </div>
      </div>
      <div className="store-footer__bottom"><span>© 2026 Driptide. All rights reserved.</span><div><Link href="/shipping">Privacy</Link><Link href="/shipping">Terms</Link><span>Pakistan · USD $</span></div></div>
    </footer>
  );
}

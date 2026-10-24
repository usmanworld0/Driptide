import Link from 'next/link';

export function Footer() {
  return (
    <footer className="driptide-footer">
      <div className="driptide-footer__brand">
        <Link href="/">DRIPTIDE</Link>
        <p>Contemporary fashion<br />from London.</p>
      </div>
      <nav aria-label="Contact">
        <span>Contact</span>
        <Link href="/contact">Client services</Link>
        <Link href="mailto:hello@driptide.com">hello@driptide.com</Link>
      </nav>
      <nav aria-label="Explore">
        <span>Explore</span>
        <Link href="/products">Shop all</Link>
        <Link href="/collections">Collections</Link>
        <Link href="/story">Our story</Link>
      </nav>
      <nav aria-label="Social">
        <span>Social</span>
        <Link href="https://instagram.com">Instagram ↗</Link>
        <Link href="https://facebook.com">Facebook ↗</Link>
      </nav>
      <nav aria-label="Information">
        <span>Information</span>
        <Link href="/shipping">Shipping &amp; returns</Link>
        <Link href="/faq">Frequently asked questions</Link>
      </nav>
      <small>© 2026 Driptide. All rights reserved.</small>
    </footer>
  );
}

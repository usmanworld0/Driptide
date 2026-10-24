'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="driptide-contact">
      <header className="driptide-contact__heading">
        <span>DRIPTIDE / CLIENT SERVICES</span>
        <h1>Contact</h1>
        <p>We’re here to help with your order, product questions, or anything else you need.</p>
      </header>
      <div className="driptide-contact__layout">
        <aside className="driptide-contact__details">
          <section><span>Customer care</span><Link href="mailto:hello@driptide.com">hello@driptide.com</Link></section>
          <section><span>Opening hours</span><p>Monday — Friday<br />09:00 — 17:00 GMT</p></section>
          <section><span>Press &amp; collaborations</span><Link href="mailto:press@driptide.com">press@driptide.com</Link></section>
          <Link className="driptide-contact__shipping" href="/shipping">Shipping &amp; returns <span aria-hidden="true">↗</span></Link>
        </aside>
        <section className="driptide-contact__form-wrap" aria-label="Send us a message">
          {submitted ? (
            <div className="driptide-contact__success" role="status">
              <h2>Thank you for getting in touch.</h2>
              <p>Your message has been received. Our team will be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
              <div className="driptide-contact__fields">
                <label>Name<input type="text" name="name" autoComplete="name" required /></label>
                <label>Email<input type="email" name="email" autoComplete="email" required /></label>
              </div>
              <label>Subject<input type="text" name="subject" required /></label>
              <label>Message<textarea name="message" rows={6} required /></label>
              <button type="submit">Send message <span aria-hidden="true">↗</span></button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

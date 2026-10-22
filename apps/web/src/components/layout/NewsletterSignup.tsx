'use client';

import { useState, type FormEvent } from 'react';

export function NewsletterSignup({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const endpoint = process.env.NEXT_PUBLIC_NEWSLETTER_URL;
    if (!endpoint) { setMessage('Newsletter signup is not configured yet.'); return; }
    setBusy(true); setMessage('');
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      if (!response.ok) throw new Error('Newsletter request failed');
      setMessage('Thanks for signing up.'); setEmail('');
    } catch { setMessage('We could not submit your signup. Please try again later.'); }
    finally { setBusy(false); }
  }

  return <form className={compact ? 'newsletter-signup newsletter-signup--compact' : 'newsletter-signup'} onSubmit={submit}>
    <label className="sr-only" htmlFor={compact ? 'footer-email' : 'campaign-email'}>Email address</label>
    <input id={compact ? 'footer-email' : 'campaign-email'} type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Your email address" />
    <button type="submit" disabled={busy}>{busy ? 'Sending…' : compact ? 'Join' : 'Sign me up'} <span aria-hidden="true">→</span></button>
    <p role="status" aria-live="polite">{message}</p>
  </form>;
}

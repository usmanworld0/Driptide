'use client';

import React from 'react';

const FAQS = [
  {
    q: 'What is the philosophy behind Driptide garments?',
    a: 'Driptide designs architectural streetwear with legacy tailoring craftsmanship. We produce custom 500GSM loopback cottons and source virgin wools from Biella, Italy, prioritizing longevity over rapid trends.',
  },
  {
    q: 'How do Driptide silhouettes fit?',
    a: 'Our silhouettes feature relaxed, dropped shoulders and cropped boxy waists. If you desire a tailored slim fit, we recommend selecting one size smaller than your standard size.',
  },
  {
    q: 'How can I apply a promotional code?',
    a: 'You can enter and apply your promo code directly inside the Shopping Bag drawer or during step 2 of checkout. Active welcome codes include DRIP15 for 15% off orders exceeding $50.',
  },
  {
    q: 'Which couriers handle delivery?',
    a: 'We ship exclusively via DHL Express and FedEx International Priority, ensuring 2 to 4 business day transit times with end-to-end tracked courier delivery.',
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-12">
      <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-8">
        <span className="text-xs font-bold tracking-[0.25em] text-neutral-400 uppercase">
          Help & Information
        </span>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
          Frequently Asked Questions
        </h1>
      </div>

      <div className="space-y-8 divide-y divide-neutral-200 dark:divide-neutral-800">
        {FAQS.map((item, idx) => (
          <div key={idx} className="pt-6 space-y-2">
            <h3 className="text-xs font-bold tracking-widest uppercase text-black dark:text-white">
              {item.q}
            </h3>
            <p className="text-xs sm:text-sm font-light text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

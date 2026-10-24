'use client';

import React from 'react';
import Link from 'next/link';

export default function ShippingPage() {
  return (
    <div className="store-info-page store-info-page--shipping max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-12">
      <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-8">
        <span className="text-xs font-bold tracking-[0.25em] text-neutral-400 uppercase">
          CLIENT SERVICES
        </span>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
          Shipping, handled with care
        </h1>
      </div>

      <div className="space-y-8 text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300 leading-relaxed">
        <div className="space-y-3">
          <h2 className="text-xs font-bold tracking-widest uppercase text-black dark:text-white">
            Preparing your order
          </h2>
          <p>
            Every Driptide order is prepared with care and packed to protect your pieces throughout their journey. Available delivery methods and estimated arrival times are shown at checkout for your destination.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-bold tracking-widest uppercase text-black dark:text-white">
            Tracking your delivery
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Once your order leaves us, you’ll receive a shipping confirmation with tracking details.</li>
            <li>Delivery estimates begin after dispatch and may vary during busy periods or customs processing.</li>
            <li>Please review your delivery address before placing an order.</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-bold tracking-widest uppercase text-black dark:text-white">
            Need help?
          </h2>
          <p>
            If your parcel arrives damaged or has not moved for an unusual amount of time, contact us with your order number and we’ll help with the next steps.
          </p>
        </div>
      </div>
    </div>
  );
}

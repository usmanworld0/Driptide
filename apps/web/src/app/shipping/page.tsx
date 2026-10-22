'use client';

import React from 'react';
import Link from 'next/link';

export default function ShippingPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-12">
      <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-8">
        <span className="text-xs font-bold tracking-[0.25em] text-neutral-400 uppercase">
          Client Services
        </span>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
          Shipping & Returns Policy
        </h1>
      </div>

      <div className="space-y-8 text-xs sm:text-sm font-light text-neutral-700 dark:text-neutral-300 leading-relaxed">
        <div className="space-y-3">
          <h2 className="text-xs font-bold tracking-widest uppercase text-black dark:text-white">
            Complimentary Worldwide Shipping
          </h2>
          <p>
            Orders over $150 receive complimentary expedited courier delivery via DHL Express or
            FedEx International Priority. Standard shipping for orders under $150 is charged at a flat rate of $15.
          </p>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-bold tracking-widest uppercase text-black dark:text-white">
            Delivery Estimates
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>North America:</strong> 2 - 3 business days</li>
            <li><strong>United Kingdom & Europe:</strong> 2 - 4 business days</li>
            <li><strong>Asia & Australasia:</strong> 3 - 5 business days</li>
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-xs font-bold tracking-widest uppercase text-black dark:text-white">
            30-Day Hassle-Free Returns
          </h2>
          <p>
            Items in unworn condition with original designer tags intact can be returned within 30
            days of receipt. Prepaid return shipping labels are included in all domestic shipments.
          </p>
        </div>
      </div>
    </div>
  );
}

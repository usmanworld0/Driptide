'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-16">
      <div className="space-y-4 border-b border-neutral-200 dark:border-neutral-800 pb-8">
        <span className="text-xs font-bold tracking-[0.25em] text-neutral-400 uppercase">
          Brand Atelier & Philosophy
        </span>
        <h1 className="text-4xl sm:text-5xl font-black uppercase tracking-tight">
          About Driptide
        </h1>
        <p className="text-sm font-light text-neutral-500 max-w-xl leading-relaxed">
          Founded in London with studios in Los Angeles and Tokyo, Driptide is an independent luxury
          streetwear house focused on architectural silhouette construction and pure textile substance.
        </p>
      </div>

      <div className="space-y-12 text-sm font-light leading-relaxed text-neutral-700 dark:text-neutral-300">
        <div className="space-y-4">
          <h2 className="text-base font-bold tracking-[0.2em] uppercase text-black dark:text-white">
            1. Form Follows Substance
          </h2>
          <p>
            We reject the disposable trend cycles of fast fashion and generic graphic merchandising.
            Every garment in our catalog begins with fiber selection: bespoke 500GSM loopback French
            terry knits developed on vintage circular looms, double-faced 650GSM Italian virgin
            wools from Biella, and custom German Fidlock magnetic hardware.
          </p>
        </div>

        <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-900">
          <img
            src="https://outfitters.com.pk/cdn/shop/files/M_Off-Duty_Web.png?v=1790165853&width=1600"
            alt="Driptide Textile Mill"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-bold tracking-[0.2em] uppercase text-black dark:text-white">
            2. The Architectural Silhouette
          </h2>
          <p>
            Our patterns feature intentional drop shoulders, sculpted cropped torsos, wide forward
            pleats, and seamless collar construction. The result is a substantial drape that feels
            empowering, effortless, and timeless.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-base font-bold tracking-[0.2em] uppercase text-black dark:text-white">
            3. Lifetime Garment Care
          </h2>
          <p>
            A garment built with integrity should last decades. We offer complimentary seam
            reinforcement and hardware replacements for the lifetime of all Driptide garments.
          </p>
        </div>
      </div>

      <div className="pt-8 border-t border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
        <Link
          href="/shop"
          className="inline-flex items-center text-xs font-bold uppercase tracking-[0.2em] bg-black dark:bg-white text-white dark:text-black px-8 py-4 hover:opacity-90"
        >
          <span>Explore The Archive</span>
          <ArrowRight className="w-4 h-4 ml-2" />
        </Link>
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24 space-y-12">
      <div className="space-y-3 border-b border-neutral-200 dark:border-neutral-800 pb-8">
        <span className="text-xs font-bold tracking-[0.25em] text-neutral-400 uppercase">
          Concierge Services
        </span>
        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight">
          Client Inquiries & Support
        </h1>
        <p className="text-xs text-neutral-500 uppercase tracking-wider">
          Our atelier concierge is at your disposal Monday to Friday, 9:00 AM – 6:00 PM GMT.
        </p>
      </div>

      {submitted ? (
        <div className="p-8 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-center space-y-3">
          <h3 className="text-xs font-bold tracking-widest uppercase text-emerald-600">
            ✓ Message Dispatched
          </h3>
          <p className="text-xs text-neutral-400 uppercase tracking-wider">
            A client concierge advisor will respond to your inquiry within 1 business day.
          </p>
        </div>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(true);
          }}
          className="space-y-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1">
                Name
              </label>
              <input
                type="text"
                required
                className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs focus:outline-none focus:border-black"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1">
                Email
              </label>
              <input
                type="email"
                required
                className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1">
              Subject
            </label>
            <input
              type="text"
              required
              placeholder="Order inquiry, sizing guidance, or bespoke tailoring"
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1">
              Message
            </label>
            <textarea
              rows={5}
              required
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 px-3 py-2 text-xs focus:outline-none focus:border-black"
            />
          </div>

          <button
            type="submit"
            className="px-8 py-3.5 bg-black dark:bg-white text-white dark:text-black text-xs font-bold uppercase tracking-[0.2em] hover:opacity-90"
          >
            Dispatch Message
          </button>
        </form>
      )}
    </div>
  );
}

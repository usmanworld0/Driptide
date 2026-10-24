import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { SmoothScroll } from '@/components/layout/SmoothScroll';

export const metadata: Metadata = {
  title: 'Driptide — Fashion Store | E-commerce UI Kit',
  description:
    'Modern clothing and fashion platform with minimalist, contemporary streetwear aesthetic.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased selection:bg-[#262626] selection:text-white">
      <body className="min-h-full flex flex-col bg-white text-black">
        <CartProvider>
          <SmoothScroll />
          <Suspense fallback={<div className="h-16 sm:h-20 bg-[#F3F3F3]" />}>
            <AnnouncementBar />
            <Header />
          </Suspense>
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}

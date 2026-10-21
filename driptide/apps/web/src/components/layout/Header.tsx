'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User, ShoppingBag, X, Menu, Search, ArrowUpRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export function Header() {
  const { cart, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const itemCount = cart?.itemCount || 0;

  return (
    <header className="sticky top-0 z-40 bg-white transition-colors border-b border-neutral-200">
      <div className="header-shell px-4 sm:px-8">
        <div className="header-main-row flex items-center h-20">
          <div className="header-brand-group flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="header-menu-toggle p-1 text-[#111111] hover:opacity-75 transition-opacity cursor-pointer focus:outline-none"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 stroke-[1.75]" />
              ) : (
                <Menu className="w-6 h-6 stroke-[1.75]" />
              )}
            </button>

            <Link href="/" className="header-wordmark-wrap flex items-center justify-center" aria-label="Driptide Home">
              <span className="header-wordmark">Driptide</span>
            </Link>
          </div>

          <nav className="header-primary-nav flex items-center text-[11px] uppercase tracking-[0.06em] text-[#111111]" aria-label="Shop departments">
            <Link href="/shop" aria-current="page">Men</Link>
            <Link href="/shop">Women</Link>
            <Link href="/shop">Juniors</Link>
          </nav>

          <div className="header-utilities flex items-center">
            <button type="button" onClick={() => setSearchOpen((open) => !open)} className="header-search-trigger hover:opacity-70" aria-label="Search the shop" aria-expanded={searchOpen}><Search className="w-[18px] h-[18px]" /><span>Search</span></button>
            <Link href="/account" className="hover:opacity-70" aria-label="Customer Account"><User className="w-[20px] h-[20px] stroke-[1.6]" /></Link>
            <button
              onClick={openCart}
              className="relative hover:opacity-70 cursor-pointer focus-visible:outline focus-visible:outline-2"
              aria-label={`Shopping Bag${itemCount ? `, ${itemCount} items` : ''}`}
            >
              <ShoppingBag className="w-[20px] h-[20px] stroke-[1.6]" />
              {itemCount > 0 && <span className="absolute -top-2 -right-2 min-w-4 h-4 px-1 bg-white text-black rounded-full text-[9px] flex items-center justify-center">{itemCount}</span>}
            </button>
          </div>
        </div>
      </div>

      {searchOpen && (
        <form action="/shop" role="search" className="header-search-panel">
          <Search size={18} aria-hidden="true" />
          <input autoFocus name="search" type="search" placeholder="Search products" aria-label="Search products" />
          <button type="submit">Search</button>
          <button type="button" onClick={() => setSearchOpen(false)} aria-label="Close search"><X size={18} /></button>
        </form>
      )}

      {mobileMenuOpen && (
        <div className="nav-drawer fixed inset-0 z-[60] overflow-y-auto bg-white text-[#111]" role="dialog" aria-modal="true" aria-label="Shop navigation">
          <div className="nav-drawer__top">
            <button type="button" onClick={() => setMobileMenuOpen(false)} className="nav-drawer__close" aria-label="Close navigation"><X size={28} strokeWidth={1.4} /></button>
            <Link href="/" className="nav-drawer__wordmark" onClick={() => setMobileMenuOpen(false)}>Driptide</Link>
            <nav aria-label="Shop departments" className="nav-drawer__departments">
              <Link href="/shop" onClick={() => setMobileMenuOpen(false)} aria-current="page">Men</Link>
              <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>Women</Link>
              <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>Juniors</Link>
            </nav>
          </div>

          <div className="nav-drawer__content">
            <div className="nav-drawer__links">
              <nav className="nav-drawer__season" aria-label="Seasonal collections">
                <Link href="/shop?newArrival=true" onClick={() => setMobileMenuOpen(false)}>New in</Link>
                <Link href="/pages/men-new-campaign" onClick={() => setMobileMenuOpen(false)}>Sweats FW 2026-2027</Link>
                <Link href="/pages/men-new-campaign" onClick={() => setMobileMenuOpen(false)}>FW 2026-2027</Link>
                <Link href="/pages/men-new-campaign" onClick={() => setMobileMenuOpen(false)}>Season preview FW 26-27</Link>
              </nav>
              <section className="nav-drawer__categories">
                <h2>Shop by categories</h2>
                <nav aria-label="Shop by category">
                  <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>View all</Link>
                  <Link href="/category/t-shirts-tops" onClick={() => setMobileMenuOpen(false)}>T-shirts</Link>
                  <Link href="/category/polos" onClick={() => setMobileMenuOpen(false)}>Polos</Link>
                  <Link href="/category/shirts" onClick={() => setMobileMenuOpen(false)}>Shirts | Shackets</Link>
                  <Link href="/category/activewear" onClick={() => setMobileMenuOpen(false)}>Activewear</Link>
                  <Link href="/category/trousers-denim" onClick={() => setMobileMenuOpen(false)}>Trousers</Link>
                  <Link href="/category/shorts" onClick={() => setMobileMenuOpen(false)}>Shorts</Link>
                  <Link href="/category/trousers-denim" onClick={() => setMobileMenuOpen(false)}>Jeans</Link>
                  <Link href="/category/footwear" onClick={() => setMobileMenuOpen(false)}>Footwear</Link>
                  <Link href="/category/fragrances" onClick={() => setMobileMenuOpen(false)}>Fragrances</Link>
                  <Link href="/category/accessories" onClick={() => setMobileMenuOpen(false)}>Accessories</Link>
                  <Link href="/category/underwear" onClick={() => setMobileMenuOpen(false)}>Underwear</Link>
                  <Link href="/category/hoodies-sweats" onClick={() => setMobileMenuOpen(false)}>Sweatshirts | Hoodies</Link>
                  <Link href="/category/sweaters" onClick={() => setMobileMenuOpen(false)}>Sweaters</Link>
                  <Link href="/category/outerwear" onClick={() => setMobileMenuOpen(false)}>Outerwear</Link>
                </nav>
              </section>
              <Link className="nav-drawer__sale" href="/category/sale" onClick={() => setMobileMenuOpen(false)}>+ Special prices and offers</Link>
            </div>

            <div className="nav-drawer__tiles" aria-label="Featured edits">
              <Link href="/pages/men-new-campaign" onClick={() => setMobileMenuOpen(false)}>
                <Image unoptimized width={533} height={700} src="https://outfitters.com.pk/cdn/shop/files/menu_tile_men_2420934a-0943-458a-991a-7cbb3215983f.jpg?v=1790943560&width=533" alt="Driptide seasonal collection" />
                <span>Sweats FW 2026-2027 <ArrowUpRight size={15} /></span>
              </Link>
              <Link href="/pages/men-new-campaign" onClick={() => setMobileMenuOpen(false)}>
                <Image unoptimized width={533} height={700} src="https://outfitters.com.pk/cdn/shop/files/Men_94c8e35f-7920-486c-9f0a-4cfa0685faa4.jpg?v=1790167022&width=533" alt="Driptide fall winter collection" />
                <span>FW 2026-2027 <ArrowUpRight size={15} /></span>
              </Link>
              <Link href="/shop" onClick={() => setMobileMenuOpen(false)}>
                <Image unoptimized width={533} height={700} src="https://outfitters.com.pk/cdn/shop/files/Men_bfcec1c0-f3e8-4d23-8e9e-1b66640266e0.jpg?v=1787049378&width=533" alt="Driptide seasonal edit" />
                <span>Explore the edit <ArrowUpRight size={15} /></span>
              </Link>
            </div>
          </div>

          <footer className="nav-drawer__footer">
            <span>Driptide — Contemporary Streetwear</span>
            <nav aria-label="Customer support">
              <Link href="/faq" onClick={() => setMobileMenuOpen(false)}>Help</Link>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>Contact us</Link>
              <Link href="/account" onClick={() => setMobileMenuOpen(false)}>My account</Link>
            </nav>
          </footer>
        </div>
      )}
    </header>
  );
}

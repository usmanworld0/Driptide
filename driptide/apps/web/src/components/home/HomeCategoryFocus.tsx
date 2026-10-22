'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

const categoryEdits = [
  {
    name: 'Sweatshirts & Hoodies',
    href: '/category/hoodies-sweats',
    image: 'https://outfitters.com.pk/cdn/shop/files/Sweatshirts_Web.jpg?v=1790321766&width=1200',
    products: [
      { name: 'Washed Out Slogan Print Hoodie', fit: 'Relaxed Fit', price: '8,490', image: 'https://outfitters.com.pk/cdn/shop/files/F0707107903_5_copy.jpg?v=1792671076&width=700', color: '#55565a' },
      { name: 'Quarter Zip Up Sweatshirt', fit: 'Relaxed Fit', price: '6,990', image: 'https://outfitters.com.pk/cdn/shop/files/F0665107007_4.jpg?v=1792670857&width=700', color: '#c7b9a8' },
      { name: 'Slogan Print Hoodie', fit: 'Relaxed Fit', price: '7,490', image: 'https://outfitters.com.pk/cdn/shop/files/F0670107902_3.jpg?v=1790319953&width=700', color: '#111111' },
      { name: 'Graphic Hoodie', fit: 'Relaxed Fit', price: '6,990', image: 'https://outfitters.com.pk/cdn/shop/files/F0713107901_2.jpg?v=1791800971&width=700', color: '#111111' },
    ],
  },
  {
    name: 'Trousers',
    href: '/category/trousers-denim',
    image: 'https://outfitters.com.pk/cdn/shop/files/Trousers_Web_64f79159-df88-4a1e-a88a-e9c92aec46e4.jpg?v=1790321842&width=1200',
    products: [
      { name: 'Regular Fit Cargo Jogger Trousers', fit: 'Regular Fit', price: '6,490', image: 'https://outfitters.com.pk/cdn/shop/files/F0780108113LOWER_eaab08bc-b178-4339-b9a9-c834bdcfd01b.jpg?v=1787913106&width=700', color: '#343638' },
      { name: 'Baggy Fit Carpenter Pants', fit: 'Baggy Fit', price: '7,490', image: 'https://outfitters.com.pk/cdn/shop/files/F0831108806_2_copy_f78a164b-834e-48e8-8ff1-9ec72b181e15.jpg?v=1791714180&width=700', color: '#c3b8a8' },
      { name: 'Relaxed Fit Trousers', fit: 'Relaxed Fit', price: '5,990', image: 'https://outfitters.com.pk/cdn/shop/files/F0782108113LOWER3.jpg?v=1791442522&width=700', color: '#111111' },
      { name: 'Washed Out Skater Fit Trousers', fit: 'Skater Fit', price: '7,490', image: 'https://outfitters.com.pk/cdn/shop/files/F0790108905_2_copy.jpg?v=1792050033&width=700', color: '#35373b' },
    ],
  },
  {
    name: 'Shirts',
    href: '/category/shirts',
    image: 'https://outfitters.com.pk/cdn/shop/files/Shirts_Web_762c5a8a-c837-4271-97bf-594eb51729ad.jpg?v=1790321898&width=1200',
    products: [
      { name: 'Embroidered Corduroy Shacket', fit: 'Relaxed Fit', price: '10,490', image: 'https://outfitters.com.pk/cdn/shop/files/F1286103806_2_copy.jpg?v=1789024542&width=700', color: '#746956' },
      { name: 'Popover Shirt', fit: 'Regular Fit', price: '4,990', image: 'https://outfitters.com.pk/cdn/shop/files/F1275103002_2.jpg?v=1792666224&width=700', color: '#d2c7b6' },
      { name: 'Textured Shirt', fit: 'Regular Fit', price: '5,690', image: 'https://outfitters.com.pk/cdn/shop/files/F1036103002.jpg?v=1789626406&width=700', color: '#a6a7a4' },
      { name: 'Textured Shirt', fit: 'Regular Fit', price: '4,990', image: 'https://outfitters.com.pk/cdn/shop/files/F1188103002_1.jpg?v=1790314461&width=700', color: '#d5d1c8' },
    ],
  },
];

export function HomeCategoryFocus() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeCategory = categoryEdits[activeIndex];

  return (
    <section className="home-category-focus" aria-labelledby="home-category-focus-title">
      <Link className="home-category-focus__feature" href={activeCategory.href} aria-label={`Shop ${activeCategory.name}`}>
        <Image src={activeCategory.image} alt={`${activeCategory.name} campaign`} width={1336} height={1640} unoptimized priority={activeIndex === 0} />
      </Link>

      <div className="home-category-focus__content">
        <header className="home-category-focus__header">
          <h2 id="home-category-focus-title">Categories in Focus</h2>
          <div className="home-category-focus__tabs" role="tablist" aria-label="Featured product categories">
            {categoryEdits.map((category, index) => (
              <button
                type="button"
                role="tab"
                id={`home-category-tab-${index}`}
                aria-selected={activeIndex === index}
                aria-controls="home-category-products"
                className={activeIndex === index ? 'is-active' : ''}
                key={category.name}
                onClick={() => setActiveIndex(index)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </header>

        <div className="home-category-focus__rail" id="home-category-products" role="tabpanel" aria-labelledby={`home-category-tab-${activeIndex}`}>
          {activeCategory.products.map((product) => (
            <Link className="home-focus-product" href={activeCategory.href} key={`${activeCategory.name}-${product.name}-${product.image}`}>
              <span className="home-focus-product__image"><Image src={product.image} alt={product.name} width={700} height={1050} unoptimized loading="lazy" /></span>
              <span className="home-focus-product__name">{product.name}</span>
              <span className="home-focus-product__fit">{product.fit} | Men</span>
              <strong className="home-focus-product__price">PKR {product.price}</strong>
              <span className="home-focus-product__swatch" style={{ backgroundColor: product.color }} aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

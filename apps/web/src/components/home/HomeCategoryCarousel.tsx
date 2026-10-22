'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRef, useState } from 'react';

type HomeCategory = { name: string; image: string; href: string };

export function HomeCategoryCarousel({ categories }: { categories: HomeCategory[] }) {
  const rail = useRef<HTMLDivElement>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const move = (direction: -1 | 1) => rail.current?.scrollBy({ left: direction * rail.current.clientWidth * 0.72, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });

  return (
    <div className="home-categories__rail-wrap">
      <div className="home-categories__arrows">
        <button type="button" onClick={() => move(-1)} aria-label="Scroll categories left"><ArrowLeft size={17} /></button>
        <button type="button" onClick={() => move(1)} aria-label="Scroll categories right"><ArrowRight size={17} /></button>
      </div>
      <div className="home-category-grid" ref={rail}>
        {categories.map((category) => (
          <Link className={`home-category${hoveredCategory && hoveredCategory !== category.name ? ' is-dimmed' : ''}`} href={category.href} key={category.name} onMouseEnter={() => setHoveredCategory(category.name)} onMouseLeave={() => setHoveredCategory(null)} onFocus={() => setHoveredCategory(category.name)} onBlur={() => setHoveredCategory(null)}>
            <Image src={category.image} alt="" width={700} height={900} unoptimized />
            <span>{category.name}<b aria-hidden="true">↗</b></span>
          </Link>
        ))}
      </div>
    </div>
  );
}

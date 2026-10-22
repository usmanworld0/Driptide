'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type HeroSlide = {
  desktop: string;
  mobile: string;
  poster: string;
  mobilePoster: string;
  eyebrow: string;
  title: string;
  href: string;
};

export function HomeHeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const hero = useRef<HTMLElement>(null);
  const pointerStartX = useRef<number | null>(null);

  const showSlide = useCallback((index: number) => {
    setActiveIndex((index + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 749px)');
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!hero.current || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(hero.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || reduceMotion || slides.length < 2) return;
    const timer = window.setInterval(() => showSlide(activeIndex + 1), 8000);
    return () => window.clearInterval(timer);
  }, [activeIndex, isVisible, reduceMotion, showSlide, slides.length]);

  const slide = slides[activeIndex];
  if (!slide) return null;

  return (
    <section
      className="home-hero home-hero--carousel"
      aria-label="Campaign highlights"
      aria-roledescription="carousel"
      ref={hero}
      onPointerDown={(event) => { pointerStartX.current = event.clientX; }}
      onPointerUp={(event) => {
        const start = pointerStartX.current;
        const distance = start === null ? 0 : event.clientX - start;
        if (Math.abs(distance) > 45) showSlide(activeIndex + (distance < 0 ? 1 : -1));
        pointerStartX.current = null;
      }}
      onPointerCancel={() => { pointerStartX.current = null; }}
      onKeyDown={(event) => {
        if (event.key === 'ArrowRight') showSlide(activeIndex + 1);
        if (event.key === 'ArrowLeft') showSlide(activeIndex - 1);
      }}
      tabIndex={0}
    >
      <video key={`${activeIndex}-${isMobile ? 'mobile' : 'desktop'}`} className="home-hero__video" autoPlay={!reduceMotion} muted loop playsInline preload="auto" poster={isMobile ? slide.mobilePoster : slide.poster} aria-label={`${slide.eyebrow} campaign video`}>
        <source src={isMobile ? slide.mobile : slide.desktop} type="video/mp4" />
      </video>
      <div className="home-hero__copy" key={`copy-${activeIndex}`}><h1>{slide.title}</h1></div>
      <div className="home-hero__dots">
        {slides.map((item, index) => <button type="button" key={item.desktop} onClick={() => showSlide(index)} aria-label={`Show campaign slide ${index + 1}`} aria-current={index === activeIndex ? 'true' : undefined} />)}
      </div>
    </section>
  );
}

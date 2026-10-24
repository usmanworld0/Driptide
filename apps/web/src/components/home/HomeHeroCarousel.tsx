import type { HeroSlide } from './HomeHeroCarousel.types';

export type { HeroSlide } from './HomeHeroCarousel.types';

export function HomeHeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const slide = slides[0];
  if (!slide) return null;

  return (
    <section className="home-hero" aria-label={`${slide.eyebrow}: campaign highlight`}>
      <div className="home-hero__artwork" aria-hidden="true" />
    </section>
  );
}

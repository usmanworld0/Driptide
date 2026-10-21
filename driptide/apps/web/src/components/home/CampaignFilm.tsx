'use client';

import { useEffect, useRef, useState } from 'react';

export function CampaignFilm({
  desktop,
  mobile,
  poster,
  mobilePoster,
  index,
}: {
  desktop: string;
  mobile: string;
  poster: string;
  mobilePoster: string;
  index: number;
}) {
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const video = useRef<HTMLVideoElement>(null);
  const frame = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 749px)');
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (isMobile === null || !video.current || !frame.current) return;
    const element = video.current;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!('IntersectionObserver' in window)) {
      void element.play().catch(() => undefined);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) void element.play().catch(() => undefined);
      else element.pause();
    }, { threshold: 0.25, rootMargin: '80px' });
    observer.observe(frame.current);
    return () => { observer.disconnect(); element.pause(); };
  }, [isMobile]);

  const source = isMobile ? mobile : desktop;
  const posterImage = isMobile ? mobilePoster : poster;

  return (
    <div className="home-community-film" ref={frame}>
      {isMobile === null ? <img src={poster} alt="" /> : <video ref={video} muted loop playsInline preload="none" poster={posterImage} aria-label={`Campaign film ${index}`}><source src={source} type="video/mp4" /></video>}
    </div>
  );
}

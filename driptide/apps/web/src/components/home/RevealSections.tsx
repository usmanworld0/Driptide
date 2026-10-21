'use client';

import { useEffect, type ReactNode } from 'react';

export function RevealSections({ children }: { children: ReactNode }) {
  useEffect(() => {
    const root = document.querySelector('.home-page');
    if (!root) return;
    root.classList.add('home-page--reveal-ready');
    const sections = root.querySelectorAll<HTMLElement>('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      sections.forEach((section) => section.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return <div className="home-page">{children}</div>;
}

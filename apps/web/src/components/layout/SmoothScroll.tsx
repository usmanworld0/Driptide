'use client';

import { useEffect } from 'react';

export function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let scroll: { destroy: () => void } | undefined;
    let disposed = false;

    const initialize = async () => {
      if (reducedMotion.matches || scroll) return;

      const { default: LocomotiveScroll } = await import('locomotive-scroll');
      if (disposed || reducedMotion.matches) return;

      scroll = new LocomotiveScroll({
        lenisOptions: {
          lerp: 0.1,
          smoothWheel: true,
          syncTouch: false,
        },
      });
    };

    const handleMotionPreference = () => {
      if (reducedMotion.matches) {
        scroll?.destroy();
        scroll = undefined;
      } else {
        void initialize();
      }
    };

    void initialize();
    reducedMotion.addEventListener('change', handleMotionPreference);

    return () => {
      disposed = true;
      reducedMotion.removeEventListener('change', handleMotionPreference);
      scroll?.destroy();
    };
  }, []);

  return null;
}

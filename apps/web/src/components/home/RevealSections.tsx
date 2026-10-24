import type { ReactNode } from 'react';

export function RevealSections({ children }: { children: ReactNode }) {
  return <div className="home-page">{children}</div>;
}

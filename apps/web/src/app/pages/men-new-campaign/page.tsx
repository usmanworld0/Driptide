import type { Metadata } from 'next';
import CampaignPage from './page-content';

export const metadata: Metadata = {
  title: 'New Season — Driptide',
  description: 'Discover the latest Driptide menswear campaign and new season collection.',
};

export default function MenCampaignRoute() {
  return <CampaignPage />;
}

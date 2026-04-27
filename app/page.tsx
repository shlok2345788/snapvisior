import type { Metadata } from 'next';
import HomeClient from './home-client';

export const metadata: Metadata = {
  title: 'Snapvisor | Instant Event Photo Delivery for Brands and Teams',
  description:
    'Capture events on iPhone and pro cameras, deliver photos in seconds, and scale with social media and web product support.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Snapvisor | Instant Event Photo Delivery for Brands and Teams',
    description:
      'Real-time event media delivery with photography, social media management, and app/website development in one team.',
    url: '/',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Snapvisor | Instant Event Photo Delivery for Brands and Teams',
    description:
      'Get event photos delivered in seconds and grow with Snapvisor creative and digital services.',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://snapvisor.com/#organization',
      name: 'Snapvisor',
      url: 'https://snapvisor.com',
      logo: 'https://snapvisor.com/og-image.png',
      sameAs: [],
    },
    {
      '@type': 'LocalBusiness',
      '@id': 'https://snapvisor.com/#business',
      name: 'Snapvisor',
      url: 'https://snapvisor.com',
      image: 'https://snapvisor.com/og-image.png',
      description:
        'Instant event photography delivery with iPhone and camera teams, plus social media and web/app development.',
      areaServed: 'IN',
      parentOrganization: {
        '@id': 'https://snapvisor.com/#organization',
      },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://snapvisor.com/#website',
      url: 'https://snapvisor.com',
      name: 'Snapvisor',
      publisher: {
        '@id': 'https://snapvisor.com/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: 'https://snapvisor.com/gallery/{search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Service',
      '@id': 'https://snapvisor.com/#service-instant-delivery',
      serviceType: 'Instant Event Photography Delivery',
      provider: {
        '@id': 'https://snapvisor.com/#organization',
      },
      areaServed: 'IN',
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
      },
    },
  ],
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomeClient />
    </>
  );
}

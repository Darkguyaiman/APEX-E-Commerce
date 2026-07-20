import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Apex',
    short_name: 'Apex',
    description:
      'Premium football boots, training kit, and performance gear engineered for elite match-day speed.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#050505',
    theme_color: '#050505',
    categories: ['shopping', 'sports'],
    icons: [
      {
        src: '/apex-logo.png',
        sizes: '500x500',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/apex-logo.png',
        sizes: '500x500',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}

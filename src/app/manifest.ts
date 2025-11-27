import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Code63Labs',
    short_name: 'C63',
    description: 'Your mini app home screen',
    start_url: '/',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#D946EF',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  }
}

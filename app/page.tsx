// pageServer.tsx
import HomePage from '@/components/ui/HomePage';
import { Metadata } from 'next'

export const metadata: Metadata = {
  metadataBase: new URL('https://useduckit.app'),
  keywords: ['Grammarly', 'OpenAI', 'ChatGPT', 'AI Writing Assistant', 'macos ai assistant'],
  title: 'Duck it! — Instant AI writing assistant',
  description: 'Duck it! is your instant AI writing assistant. Whenever you need to improve grammar, concise text, and translate with just one shortcut.',
  openGraph: {
    title: 'Duck it! — Instant AI writing assistant',
    description: 'Duck it! is your instant AI writing assistant. Whenever you need to improve grammar, concise text, and translate with just one shortcut.',
    url: 'https://useduckit.app/',
    siteName: 'Duck it!',
    images: [
      {
        url: '/OGImage.jpg',
        width: 800,
        height: 600,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  manifest: '/site.webmanifest',
  twitter: {
    card: 'summary_large_image',
    title: 'Duck it! — Instant AI writing assistant',
    description: 'Duck it! is your instant AI writing assistant. Whenever you need to improve grammar, concise text, and translate with just one shortcut.',
    images: ['https://useduckit.app/OGImage.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
    ],
    shortcut: ['/favicon.ico'],
    apple: [
      { url: '/apple-touch-icon.png' },
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'icon', url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { rel: 'icon', url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { rel: 'mask-icon', url: '/safari-pinned-tab.svg', color: '#ff8c2d' },
      { rel: 'manifest', url: '/site.webmanifest' },
    ],
  },
}

export default function HomePageServer() {
  return <HomePage/>;
}
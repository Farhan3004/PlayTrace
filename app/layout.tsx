import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-grotesk', weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = {
  title: {
    default: 'PLAYTRACE — Your journey. Your proof. Your next opportunity.',
    template: '%s · PLAYTRACE',
  },
  description:
    'PLAYTRACE connects athletes, teams, coaches, scouts and event organisers through one intelligent sports and esports ecosystem — verified achievements, events, competitions and opportunities.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0B0F17',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable} bg-background`}>
      <body className="antialiased">
        {children}
        <Toaster position="bottom-right" richColors closeButton style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }} />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

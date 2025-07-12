import type { Metadata, Viewport } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })

export const metadata: Metadata = {
  title: 'VariaVaria Jewelry | Handcrafted Lucky Jewelry',
  description: 'Discover beautiful handcrafted jewelry featuring four-leaf clovers. Each piece is carefully made to bring you luck and style.',
  keywords: ['jewelry', 'four-leaf clover', 'handcrafted', 'lucky jewelry', 'rings', 'necklaces', 'earrings', 'bracelets'],
  authors: [{ name: 'VariaVaria Jewelry' }],
  creator: 'VariaVaria Jewelry',
  openGraph: {
    title: 'VariaVaria Jewelry | Handcrafted Lucky Jewelry',
    description: 'Discover beautiful handcrafted jewelry featuring four-leaf clovers. Each piece is carefully made to bring you luck and style.',
    url: 'https://variavariajewelry.com',
    siteName: 'VariaVaria Jewelry',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VariaVaria Jewelry',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VariaVaria Jewelry | Handcrafted Lucky Jewelry',
    description: 'Discover beautiful handcrafted jewelry featuring four-leaf clovers.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#22c55e',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Four Leaf Clover Jewelry" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#22c55e" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className="font-sans antialiased">
        <div className="min-h-screen bg-neutral-50">
          {children}
        </div>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              style: {
                background: '#22c55e',
              },
            },
            error: {
              style: {
                background: '#ef4444',
              },
            },
          }}
        />
      </body>
    </html>
  )
} 
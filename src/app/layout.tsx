import type { Metadata } from 'next'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Textdrop — Paste once. Access anywhere.',
  description:
    'Turn any text into a short 5-character code and retrieve it instantly from any device. No accounts, no passwords, no friction.',
  keywords: ['text sharing', 'clipboard', 'code', 'paste', 'transfer text', 'textdrop'],
  authors: [{ name: 'Textdrop' }],
  openGraph: {
    title: 'Textdrop — Paste once. Access anywhere.',
    description:
      'Turn any text into a short 5-character code and retrieve it instantly from any device.',
    url: 'https://textdrop.uz',
    siteName: 'Textdrop',
    type: 'website',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Textdrop - Paste once. Access anywhere.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Textdrop — Paste once. Access anywhere.',
    description: 'Turn any text into a short code and retrieve it instantly from any device.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://textdrop.uz'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:ital,wght@0,300;0,400;0,500;1,300&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

import localFont from 'next/font/local';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import { Footer } from '@/components/common/Footer';
import Script from 'next/script';
import Navigation from '@/components/common/Navigation';
import { Metadata } from 'next';

const inter = localFont({
  src: [
    {
      path: '../public/fonts/Inter.ttf',
      style: 'normal',
    },
    {
      path: '../public/fonts/Inter-Italic.ttf',
      style: 'italic',
    },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://fullcourt-training.com'),
  title: {
    default: 'FULLCOURT TRAINING - Basketball Animations',
    template: '%s | FULLCOURT TRAINING',
  },
  description: 'Animated Basketball Drills and Plays',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    url: '/',
    title: 'FULLCOURT TRAINING - Basketball Animations',
    description: 'Animated Basketball Drills and Plays',
    siteName: 'FULLCOURT TRAINING',
    images: [
      {
        url: '/images/cover.webp',
        width: 1200,
        height: 630,
        type: 'image/webp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FULLCOURT TRAINING - Basketball Animations',
    description: 'Animated Basketball Drills and Plays',
    images: ['/images/cover.webp'],
  },
  icons: {
    icon: [
      { url: '/favicon/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: ['/favicon/favicon.ico'],
    apple: [{ url: '/favicon/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/favicon/site.webmanifest',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <main className="flex flex-col">{children}</main>
          <Footer />
        </ThemeProvider>
        <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
      </body>
    </html>
  );
}

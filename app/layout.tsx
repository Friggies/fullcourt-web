import localFont from 'next/font/local';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import Navigation from '@/components/navigation';
import { Footer } from '@/components/organisms/Footer';
import Script from 'next/script';

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          type="image/png"
          href="/favicon/favicon-96x96.png"
          sizes="96x96"
        />
        <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/favicon/apple-touch-icon.png"
        />
        <meta name="apple-mobile-web-app-title" content="FULLCOURT" />
        <link rel="manifest" href="/favicon/site.webmanifest" />

        <meta property="og:title" content="FULLCOURT - Basketball Training" />
        <meta property="og:description" content="Animated Basketball Drills" />
        <meta
          property="og:image"
          content="https://fullcourt-training.com/images/cover.webp"
        />
        <meta property="og:image:type" content="image/webp" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fullcourt-training.com" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="FULLCOURT - Basketball Training" />
        <meta name="twitter:description" content="Animated Basketball Drills" />
        <meta
          name="twitter:image"
          content="https://fullcourt-training.com/images/cover.webp"
        />
      </head>
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
      </body>
      <Script src="https://scripts.simpleanalyticscdn.com/latest.js" />
    </html>
  );
}

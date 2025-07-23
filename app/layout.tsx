import localFont from 'next/font/local';
import { ThemeProvider } from 'next-themes';
import './globals.css';
import Link from 'next/link';
import { ThemeSwitcher } from '@/components/theme-switcher';
import Navigation from '@/components/navigation';

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

export default function RootLayout({
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
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <main className="p-4 min-h-screen">
            <div className="max-w-3xl mx-auto flex flex-col gap-6">
              {children}
            </div>
          </main>
          <footer className="p-4 border-t border-t-foreground/10">
            <div className="max-w-3xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <Link href="/" className="font-black uppercase">
                Fullcourt Training
              </Link>
              <ThemeSwitcher />
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}

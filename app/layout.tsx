import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";

const inter = localFont({
    src: [
        {
            path: "../public/fonts/Inter.ttf",
            style: "normal",
        },
        {
            path: "../public/fonts/Inter-Italic.ttf",
            style: "italic",
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
                <link rel="icon" type="image/png" href="/favicon/favicon-96x96.png" sizes="96x96" />
                <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
                <link rel="shortcut icon" href="/favicon/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
                <meta name="apple-mobile-web-app-title" content="FULLCOURT" />
                <link rel="manifest" href="/favicon/site.webmanifest" />
            </head>
            <body className={`${inter.className} antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange>
                    <nav className="w-full flex flex-col sm:flex-row justify-between items-center p-5 max-w-5xl mx-auto">
                        <Link className="text-xl font-black uppercase" href={"/"}>
                            Fullcourt - Training
                        </Link>
                        <div className="flex gap-5 font-semibold">
                            <Link className="hover:underline" href={"/drills"}>
                                Drills
                            </Link>
                            <Link className="hover:underline" href={"/b2b"}>
                                B2B
                            </Link>
                            <Link className="hover:underline" href={"/profile"}>
                                Profile
                            </Link>
                            <Link className="hover:underline" href={"/contact"}>
                                Contact
                            </Link>
                        </div>
                    </nav>
                    {children}
                    <footer className="w-full flex items-center justify-center p-5 max-w-5xl mx-auto">
                        <p>
                            Powered by{" "}
                            <a
                                href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                                target="_blank"
                                className="font-bold hover:underline"
                                rel="noreferrer">
                                Supabase
                            </a>
                        </p>
                        <ThemeSwitcher />
                    </footer>
                </ThemeProvider>
            </body>
        </html>
    );
}

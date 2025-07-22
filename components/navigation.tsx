"use client";

import { MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();
    const links = [
        { href: "/drills", label: "Drill Library" },
        { href: "/b2b", label: "B2B" },
        { href: "/profile", label: "My Profile" },
        { href: "mailto:contact@fullcourt-training.com", label: "Contact Us" },
    ];
    const some = [
        { href: "https://www.instagram.com/fullcourt_training/", label: "Instagram" },
        { href: "https://www.youtube.com/@fullcourt-training", label: "YouTube" },
        { href: "https://www.tiktok.com/@fullcourt_training", label: "TikTok" },
    ];

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    useEffect(() => {
        document.body.classList.toggle("overflow-hidden", isOpen);
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [isOpen]);

    return (
        <>
            <nav className="p-4 mx-auto border-b border-b-foreground/10 bg-background sticky top-0 z-40">
                <div className="max-w-3xl w-full flex justify-between items-center mx-auto">
                    <Link href="/" className="font-black uppercase">
                        Fullcourt Training
                    </Link>
                    <div className="hidden sm:flex gap-4 font-normal">
                        {links.map((link) => (
                            <Link key={link.href} href={link.href} className="hover:underline">
                                {link.label}
                            </Link>
                        ))}
                    </div>
                    <button onClick={() => setIsOpen((o) => !o)} className="sm:hidden">
                        <MenuIcon size={30} />
                    </button>
                </div>
            </nav>
            <div
                className={`fixed inset-0 z-50 flex ${
                    isOpen ? "pointer-events-auto" : "pointer-events-none"
                }`}>
                <div
                    className={`
             w-full h-full bg-background p-4
            transform transition-transform duration-300 ease-in-out flex flex-col gap-4 motion-reduce:duration-0
            ${isOpen ? "translate-x-0" : "translate-x-full"}
          `}>
                    <button onClick={() => setIsOpen(false)} className="ml-auto">
                        <XIcon size={30} />
                    </button>
                    <nav className="flex flex-col gap-4 font-normal">
                        <Link
                            href={"/"}
                            onClick={() => setIsOpen(false)}
                            className="text-lg font-black uppercase">
                            Fullcourt Training
                        </Link>
                        {links.map((link) => (
                            <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                                {link.label}
                            </Link>
                        ))}
                        {some.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setIsOpen(false)}
                                target="_blank">
                                {link.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>
        </>
    );
}

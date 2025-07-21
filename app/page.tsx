import { Hero } from "@/components/hero";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "FULLCOURT - TRAINING",
    description: "",
};

export default function Home() {
    return (
        <main className="min-h-screen">
            <Hero />
            <main className="flex-1 flex flex-col gap-6 px-4"></main>
        </main>
    );
}

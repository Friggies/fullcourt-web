import { Hero } from "@/components/hero";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "FULLCOURT TRAINING",
    description: "",
};

export default function Index() {
    return (
        <>
            <Hero title="Animated basketball drills for&nbsp;the&nbsp;entire&nbsp;court" />
        </>
    );
}

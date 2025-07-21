import Image from "next/image";

export function Hero() {
    return (
        <div className="flex flex-col items-center py-20 gap-10 bg-[url(/images/floor.jpg)] bg-cover bg-fixed">
            <Image
                src={"/images/logo-svg.svg"}
                width={161}
                height={150}
                alt="Fullcourt - Training logo"
            />
            <h1 className="text-2xl lg:text-3xl mx-auto max-w-xl text-center font-semibold">
                Animated basketball drills
                <br />
                for the entire court
            </h1>
        </div>
    );
}

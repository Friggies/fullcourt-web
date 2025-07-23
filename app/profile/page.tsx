import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { InfoIcon } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";
import { Hero } from "@/components/hero";

export default async function Profile() {
    const supabase = await createClient();

    // You can also use getUser() which will be slower.
    const { data, error } = await supabase.auth.getClaims();
    if (error || !data?.claims) {
        redirect("/auth/login");
    }

    console.log(data);

    const { data: user } = await supabase.auth.getUser();
    console.log(user);

    return (
        <>
            <Hero title={data.claims.email} />
            <LogoutButton />
            <div className="bg-accent text-sm p-3 px-5 rounded-md flex gap-3 items-center">
                <InfoIcon size="16" strokeWidth={2} />
                This is a protected page that you can only see as an authenticated user
            </div>
        </>
    );
}

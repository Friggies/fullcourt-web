"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { drill } from "@/lib/types";
import { PostgrestError } from "@supabase/supabase-js";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { CircleXIcon, LoaderIcon } from "lucide-react";

export default function DrillPage() {
    const [drill, setDrill] = useState<drill | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<PostgrestError | null>(null);
    const { id } = useParams();
    const router = useRouter();

    useEffect(() => {
        const supabase = createClient();
        const fetchDrill = async () => {
            const { data, error } = await supabase.from("drills").select("*").eq("id", id).single();
            if (error) {
                setError(error);
                console.log(error);
            } else {
                setDrill(data);
            }
            setLoading(false);
        };
        fetchDrill();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col justify- items-center mt-10 gap-2">
                <LoaderIcon className="animate-spin" />
                Loading
            </div>
        );
    }

    if (error?.code === "PGRST116") {
        router.replace("/404");
        return;
    }

    if (error || !drill) {
        return (
            <div className="flex flex-col justify- items-center mt-10 gap-2">
                <CircleXIcon />
                Error loading drill
            </div>
        );
    }

    return (
        <div>
            <h1>{drill.name}</h1>
            <p>{drill.description}</p>
        </div>
    );
}

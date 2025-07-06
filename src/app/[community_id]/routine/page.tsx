"use client";

import React, { use, useEffect, useState } from "react";
import AppBar from "@/components/AppBar";
import BottomBar from "@/components/BottomBar";
import { getRoutinesByCommunity } from "@/api/getKnowledgeItemsByCommunity";
import type { KnowledgeItem } from "@/models/KnowledgeItem";
import Loader from "@/components/Loader";

export default function RoutinePage() {
    const [community, setCommunity] = useState<any>(null);
    const [lang, setLang] = useState("kn");
    const [routineItems, setRoutineItems] = useState<KnowledgeItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedLang = localStorage.getItem("preferences.lang") || "kn";
        setLang(storedLang);

        const data = localStorage.getItem(`selectedCommunity`);
        if (data) setCommunity(JSON.parse(data));
    }, []);

    useEffect(() => {
        if (!community) return;
        setLoading(true);
        // Fetch only routine type items
        getRoutinesByCommunity(community.community_id)
            .then((items) => {
                setRoutineItems(items);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch routine items:", error);
                setLoading(false);
            });
    }, [community]);

    if (!community) return null;

    return (
        <>
            <AppBar title={`${community.name?.[lang] || community.community_id} - ದಿನಚರಿ`} />
            <main className="flex flex-col items-center justify-center min-h-[70vh] px-3 pb-16 w-full max-w-3xl mx-auto">
                {loading && Loader()}

                {!loading && routineItems.length === 0 && (
                    <p className="mt-8 text-center text-gray-500">No routine items found.</p>
                )}

                <div className="grid grid-cols-1 gap-4 mt-8 w-full">
                    {routineItems.map((item) => (
                        <div key={item.id} className="border rounded-lg p-4 shadow hover:shadow-md transition">
                            <h2 className="font-semibold text-lg mb-2">{item.title}</h2>
                            <div className="prose max-w-none whitespace-pre-wrap">{item.content}</div>
                        </div>
                    ))}
                </div>
            </main>
            <BottomBar
                communityId={community.community_id}
                communityName={community.name?.[lang] || community.community_id}
                active="community"
            />
        </>
    );
}

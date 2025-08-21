"use client";

import React, { useEffect, useState } from "react";
import AppBar from "@/components/app-bar";
import BottomBar from "@/components/bottom-bar";
import { getRoutinesByCommunity } from "@/api/getKnowledgeItemsByCommunity";
import type { KnowledgeItem } from "@/models/KnowledgeItem";
import Loader from "@/components/Loader";
import Tabs from "@/components/Tabs";
import { BiMusic, BiSolidQuoteAltLeft, BiBookAlt, BiCalendar } from "react-icons/bi";
import { useApp } from '@/context/AppContext'
import CustomMarkdown from "@/components/CustomMarkdown";
import Panchanga from "@/components/Panchanga";

export default function RoutinePage() {
    const { community, lang } = useApp()
    const [routineItems, setRoutineItems] = useState<KnowledgeItem[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedId, setSelectedId] = useState<string | null>(null)

    useEffect(() => {
        if (!community) return
        setLoading(true)
        getRoutinesByCommunity(community.community_id)
            .then((items) => {
                setRoutineItems(items)
                setLoading(false)
            })
            .catch((error) => {
                console.error("Failed to fetch routine items:", error)
                setLoading(false)
            })
    }, [community])


    const renderItems = (renderType: string) => {
        const filtered = routineItems.filter((item) => item.type === renderType);

        if (filtered.length === 0) {
            return renderType == "calendar"
                ? <Panchanga />
                : <p className="text-gray-500">ಈ ವಿಭಾಗದಲ್ಲಿ ವಿಷಯ ಲಭ್ಯವಿಲ್ಲ.</p>;
        }

        const activeItem = selectedId
            ? filtered.find((item) => item.id === selectedId) || filtered[0]
            : filtered[0];

        return (
            <div className="space-y-4">
                {filtered.length > 1 && (
                    <select
                        className="font-semibold text-lg mb-2 text-center w-full appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23374151' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                            backgroundPosition: 'right 0.5rem center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '1.5em 1.5em'
                        }}
                        value={activeItem.id}
                        onChange={(e) => setSelectedId(e.target.value)}
                    >
                        {filtered.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.title}
                            </option>
                        ))}
                    </select>
                )}

                <div>
                    {filtered.length == 1 && (
                        <>
                            <h2 className="font-semibold text-lg mb-2">{activeItem.title}</h2>
                            <hr className="mb-4 border-gray-300" />
                        </>
                    )}

                    <div className="prose prose-sm sm:prose lg:prose-lg max-w-none">
                        <CustomMarkdown content={activeItem.type == "song"
                            ? activeItem.content.replace(/\n/g, '\n &nbsp;').replace(/\n/g, '  \n')
                            : activeItem.content} />
                    </div>
                </div>
            </div>
        );
    };

    const tabs = [
        {
            id: "geethe",
            label: "ಗೀತೆ",
            icon: BiMusic,
            content: () => renderItems("song"),
        },
        {
            id: "amruthavachana",
            label: "ಅಮೃತವಚನ",
            icon: BiSolidQuoteAltLeft,
            content: () => renderItems("quote"),
        },
        {
            id: "shloka",
            label: "ಶ್ಲೋಕ",
            icon: BiBookAlt,
            content: () => renderItems("shloka"),
        },
        {
            id: "panchanga",
            label: "ಪಂಚಾಂಗ",
            icon: BiCalendar,
            content: () => renderItems("calendar"),
        },
    ];

    if (!community || (!loading && routineItems.length == 0)) return <p className="text-center text-gray-500 mt-50">ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ</p>;

    if (loading) return Loader();

    return (
        <>
            <AppBar title={`${community.name?.[lang] || community.community_id} - ದಿನಚರಿ`} />
            <Tabs header={community?.properties?.routine.header ?? undefined} tabs={tabs} />
            <BottomBar
                communityName={community.name?.[lang] || community.community_id}
                active="community"
            />
        </>
    );
}

"use client";

import { getKnowledgeItemsByCategory } from '@/api/getKnowledgeItemsByCommunity';
import AppBar from '@/components/app-bar';
import BottomBar from '@/components/bottom-bar';
import Loader from '@/components/Loader';
import { EventType } from '@/models/KnowledgeItem';
import { useApp } from '@/context/AppContext';
import React, { useEffect, useState } from 'react';

export default function AnnualPlan() {
    const { community, lang } = useApp();
    const [annualPlan, setAnnualPlan] = useState<EventType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (community) {
            document.title = `Annual Plan - ${community.name?.['en'] || community.community_id}`;
        }
    }, [community]);

    useEffect(() => {
        if (!community) return;
        setLoading(true);
        getKnowledgeItemsByCategory(community.community_id, 'calendar')
            .then((items) => {
                const annualPlanItem = items.find(item => item.type === "annual_plan");
                if (annualPlanItem?.content) {
                    setAnnualPlan(JSON.parse(annualPlanItem.content));
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch routine items:", error);
                setLoading(false);
            });
    }, [community]);

    if (!community || (!loading && annualPlan.length == 0)) {
        return <p className="text-center text-gray-500 mt-50">ಯಾವುದೇ ಮಾಹಿತಿ ಲಭ್ಯವಿಲ್ಲ</p>;
    }

    if (loading) return Loader();

    return (
        <>
            <AppBar title={`ಪ್ರಜ್ಞಾನಂ - ${community.name?.[lang] || community.community_id}`} />
            <h2 className="card-title text-center text-2xl font-semibold mb-4">ವಾರ್ಷಿಕ ಯೋಜನೆ</h2>
            <div className="card app-card bg-white rounded-lg py-3 border border-gray-200">
                <div className="card-body">
                    <ul className="list-group list-group-flush">
                        {annualPlan.map((event, index) => (
                            <li key={index} className={`list-group-item px-2 ${event.status === "past" ? "text-gray-400" : ""}`}>
                                <div className={`px-2 ${event.status === "current" ? "text-pink-400" : ""}`}>
                                    <b>{event.title}</b>
                                </div>
                                <small className='px-2'>{event.date}</small>
                                {index !== (annualPlan.length - 1) && <hr className="my-2 text-gray-300" />}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
            <BottomBar
                communityName={community.name?.[lang] || community.community_id}
                active="community"
            />
        </>
    );
}

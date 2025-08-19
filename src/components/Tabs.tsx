'use client';

import { Properties } from '@/models/community';
import { useState, ReactNode } from 'react';

type Tab = {
    id: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    content: ReactNode | (() => ReactNode);
};

type TabsProps = {
    header?: Properties['routine']['header'];
    tabs: Tab[];
};

export default function Tabs({ header, tabs }: TabsProps) {
    const [activeTab, setActiveTab] = useState(tabs?.[0]?.id || '');
    return (
        <div className="space-y-4">

            {/* Card Header */}
            {header && (
                <div className="p-4 text-center">
                    <h5 className="text-lg font-semibold">{header.title}</h5>
                    {header.subtitle && <h6 className="text-md text-gray-600">{header.subtitle}</h6>}
                    {header.tagline && <p className="text-sm text-gray-500">{header.tagline}</p>}
                </div>
            )}

            {/* Tabs */}
            <div className="flex justify-between gap-2">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex flex-col px-4 items-center justify-center py-2 rounded-xl transition text-pink-400 ${activeTab === tab.id ? 'shadow border border-gray-200 font-semibold' : ''
                                }`}
                        >
                            <div className="mb-1"><Icon size={28} /></div>
                            <h6 className={`text-sm ${activeTab === tab.id ? 'text-pink-400' : 'text-gray-600'}`}>{tab.label}</h6>
                        </button>
                    );
                })}
            </div>

            {/* Tab Content */}
            <div className="bg-white border border-gray-300 rounded-xl transition p-3">
                {tabs.map((tab) =>
                    activeTab === tab.id ? (
                        <div key={tab.id} className="text-center text-base text-gray-700">
                            {typeof tab.content === 'function' ? tab.content() : tab.content}
                        </div>
                    ) : null
                )}
            </div>
        </div>
    );
}
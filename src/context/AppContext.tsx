'use client';

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Community } from '@/models/community'
import { getCommunity, getLang, setCommunity as setCookieCommunity } from '@/utils/cookies'
import { getCommunityById } from '@/api/getCommunities';

interface AppContextType {
    community: Community | null
    setCommunity: (community: Community | null) => void
    lang: string
    setLang: (lang: string) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: React.ReactNode }) {
    const [community, setCommunity] = useState<Community | null>(null)
    const [lang, setLang] = useState("kn")

    useEffect(() => {
        setLang(getLang())

        const storedCommunity = getCommunity()
        if (storedCommunity) {
            // First set from cookie to avoid blank screen
            setCommunity(storedCommunity)

            // Then fetch fresh data
            getCommunityById(storedCommunity.community_id)
                .then(freshCommunity => {
                    setCommunity(freshCommunity)
                    // Update cookie with fresh data
                    setCookieCommunity(freshCommunity)
                })
                .catch(error => {
                    console.error('Failed to refresh community data:', error)
                })
        }
    }, [])

    return (
        <AppContext.Provider value={{ community, setCommunity, lang, setLang }}>
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    const context = useContext(AppContext)
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider')
    }
    return context
}
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Community } from '@/models/community'
import { getCommunityData, getCommunityId, getLang, setCommunityData, setCommunityId } from '@/utils/cookies'
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
        if (typeof window !== 'undefined') {
            setLang(getLang())
            
            // Check cookie first
            const communityId = getCommunityId()
            
            if (communityId) {
                // Try to get from localStorage first
                const storedCommunity = getCommunityData()
                if (storedCommunity && storedCommunity.community_id === communityId) {
                    setCommunity(storedCommunity)
                }
                
                // Refresh data from backend
                getCommunityById(communityId)
                    .then(freshCommunity => {
                        setCommunity(freshCommunity)
                        setCommunityData(freshCommunity)
                    })
                    .catch(error => {
                        console.error('Failed to refresh community data:', error)
                    })
            } else {
                // If no cookie, check localStorage
                const storedCommunity = getCommunityData()
                if (storedCommunity) {
                    // Restore from localStorage
                    setCommunity(storedCommunity)
                    setCommunityId(storedCommunity.community_id)
                }
            }
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
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { Community } from '@/models/community'
import { getCommunity, getLang } from '@/utils/cookies'

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
        setCommunity(getCommunity())
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
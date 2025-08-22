import Cookies from 'js-cookie'
import type { Community } from '@/models/community'

export const StorageKeys = {
    COMMUNITY_ID: 'selectedCommunityId',
    COMMUNITY_DATA: 'communityData',
    LANG: 'preferences.lang'
} as const

// Helper to check if we're on client side
const isClient = typeof window !== 'undefined'

export function setCommunityId(communityId: string) {
    Cookies.set(StorageKeys.COMMUNITY_ID, communityId)
}

export function getCommunityId(): string | null {
    return Cookies.get(StorageKeys.COMMUNITY_ID) || null
}

export function setCommunityData(community: Community) {
    if (!isClient) return
    localStorage.setItem(StorageKeys.COMMUNITY_DATA, JSON.stringify(community))
}

export function getCommunityData(): Community | null {
    if (!isClient) return null
    const stored = localStorage.getItem(StorageKeys.COMMUNITY_DATA)
    return stored ? JSON.parse(stored) : null
}

export function setLang(lang: string) {
    if (!isClient) return
    localStorage.setItem(StorageKeys.LANG, lang)
}

export function getLang(): string {
    if (!isClient) return 'kn'
    return localStorage.getItem(StorageKeys.LANG) || 'kn'
}
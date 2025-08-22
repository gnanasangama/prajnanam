import Cookies from 'js-cookie'
import type { Community } from '@/models/community'

export const StorageKeys = {
    COMMUNITY_ID: 'selectedCommunityId',
    COMMUNITY_DATA: 'communityData',
    LANG: 'preferences.lang'
} as const

export function setCommunityId(communityId: string) {
    Cookies.set(StorageKeys.COMMUNITY_ID, communityId)
}

export function getCommunityId(): string | null {
    return Cookies.get(StorageKeys.COMMUNITY_ID) || null
}

export function setCommunityData(community: Community) {
    localStorage.setItem(StorageKeys.COMMUNITY_DATA, JSON.stringify(community))
}

export function getCommunityData(): Community | null {
    const stored = localStorage.getItem(StorageKeys.COMMUNITY_DATA)
    return stored ? JSON.parse(stored) : null
}

export function setLang(lang: string) {
    localStorage.setItem(StorageKeys.LANG, lang)
}

export function getLang(): string {
    return localStorage.getItem(StorageKeys.LANG) || 'kn'
}
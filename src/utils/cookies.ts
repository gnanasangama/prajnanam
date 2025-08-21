import Cookies from 'js-cookie'
import type { Community } from '@/models/community'

export const CookieKeys = {
    COMMUNITY: 'selectedCommunity',
    LANG: 'preferences.lang'
} as const

export function setCommunity(community: Community) {
    Cookies.set(CookieKeys.COMMUNITY, JSON.stringify(community))
}

export function getCommunity(): Community | null {
    const stored = Cookies.get(CookieKeys.COMMUNITY)
    return stored ? JSON.parse(stored) : null
}

export function setLang(lang: string) {
    Cookies.set(CookieKeys.LANG, lang)
}

export function getLang(): string {
    return Cookies.get(CookieKeys.LANG) || 'kn'
}
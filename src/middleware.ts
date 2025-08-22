import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Exclude API routes and public assets
    if (
        request.nextUrl.pathname.startsWith('/api') ||
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.startsWith('/select-community') ||
        request.nextUrl.pathname.startsWith('/manifest.json') ||
        request.nextUrl.pathname.startsWith('/images')
    ) {
        return NextResponse.next()
    }

    const communityId = request.cookies.get('selectedCommunityId')
    
    if (!communityId) {
        return NextResponse.redirect(new URL('/select-community', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
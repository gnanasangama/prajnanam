import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    // Exclude API routes and public assets
    if (
        request.nextUrl.pathname.startsWith('/api') ||
        request.nextUrl.pathname.startsWith('/_next') ||
        request.nextUrl.pathname.startsWith('/select-community')
    ) {
        return NextResponse.next()
    }

    const selectedCommunity = request.cookies.get('selectedCommunity')
    
    if (!selectedCommunity) {
        return NextResponse.redirect(new URL('/select-community', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
}
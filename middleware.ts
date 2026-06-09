import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isPublicAsset =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/workbox-') ||
    pathname === '/sw.js' ||
    pathname === '/manifest.json' ||
    pathname === '/favicon.ico' ||
    /\.[^/]+$/.test(pathname)

  if (isPublicAsset) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/demo')) {
    return NextResponse.next()
  }

  
  return NextResponse.next()
}
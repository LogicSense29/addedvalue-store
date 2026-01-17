import { NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/auth'

export async function middleware(request) {
  // Check if we are visiting an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    const token = request.cookies.get('token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/auth', request.url))
    }

    const payload = await verifyJWT(token)

    if (!payload || payload.role !== 'ADMIN') {
      // If token is invalid or user is not ADMIN, redirect to home or unauthorized page
      // For now, redirecting to home seems appropriate or a dedicated 403 page
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}

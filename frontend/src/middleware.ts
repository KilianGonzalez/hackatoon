import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/verify-email']
const authRoutes = ['/login', '/register', '/forgot-password']

export async function middleware(request: NextRequest) {
  const { response, user } = await updateSession(request)
  const pathname = request.nextUrl.pathname

  // Allow public routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith('/api/auth'))) {
    // If user is logged in and tries to access auth routes, redirect to app
    if (user && authRoutes.some(route => pathname === route)) {
      return NextResponse.redirect(new URL('/app', request.url))
    }
    return response
  }

  // Protected routes - require authentication
  if (pathname.startsWith('/app') || pathname.startsWith('/admin')) {
    if (!user) {
      const redirectUrl = new URL('/login', request.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

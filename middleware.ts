import { NextRequest, NextResponse } from 'next/server'
import { authService } from '@/lib/services/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip middleware for public routes
  if (
    pathname.startsWith('/login') ||
    pathname.startsWith('/register') ||
    pathname.startsWith('/api/auth/request-otp') ||
    pathname.startsWith('/api/auth/verify-otp') ||
    pathname.startsWith('/api/auth/register') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // Get token from cookie
  const token = request.cookies.get('auth_token')?.value

  if (!token) {
    // Redirect to login for protected pages
    if (pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Return 401 for API routes
    if (pathname.startsWith('/api')) {
      return NextResponse.json(
        { error: 'Unauthorized - No token provided' },
        { status: 401 }
      )
    }

    return NextResponse.next()
  }

  try {
    // Verify JWT token
    const payload = await authService.verifyJWT(token)

    // Attach user context to request headers
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-user-id', payload.user_id.toString())
    requestHeaders.set('x-tenant-id', payload.tenant_id.toString())
    requestHeaders.set('x-user-role', payload.role)
    requestHeaders.set('x-user-email', payload.email)

    // Continue with modified headers
    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    console.error('JWT verification failed:', error)

    // Clear invalid cookie
    const response = pathname.startsWith('/admin')
      ? NextResponse.redirect(new URL('/login', request.url))
      : NextResponse.json(
          { error: 'Unauthorized - Invalid token' },
          { status: 401 }
        )

    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/',
    })

    return response
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

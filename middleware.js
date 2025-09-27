import { NextResponse } from 'next/server';
import { decryptData } from './lib/decrypt';
import { encryptData } from './lib/encrypt';

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get cookies
  const localSession = request.cookies.get('localSession')?.value;
  const appSession = request.cookies.get('appSession')?.value;

  // Check if user is authenticated (has both required cookies)
  const isAuthenticated = localSession && appSession;

  // Debug logging for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Middleware: Cookie check', {
      pathname,
      hasLocalSession: !!localSession,
      hasAppSession: !!appSession,
      isAuthenticated
    });
  }

  // Define route types
  const isAuthRoute = pathname.startsWith('/auth');
  const isLoginRoute = pathname === '/login';
  const isSignupRoute = pathname === '/signup';

  try {
    // Handle authentication routes
    if (isAuthRoute) {
      if (!isAuthenticated) {
        // Redirect unauthenticated users to login
        return NextResponse.redirect(new URL('/login', request.url));
      }

      // Validate and re-encrypt localSession for authenticated users
      try {
        const userData = await decryptData(localSession);

        // Re-encrypt localSession with new expiration for extra security
        const newExpirationTime = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
        const newLocalSession = await encryptData(userData.userId, newExpirationTime);

        // Create response and update the localSession cookie
        const response = NextResponse.next();
        response.cookies.set('localSession', newLocalSession, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60, // 1 hour
          path: '/'
        });

        return response;
      } catch (error) {
        // Invalid or expired localSession - clear cookies and redirect to login
        console.error('Middleware auth error:', error.message);

        // In development, log more details for debugging
        if (process.env.NODE_ENV === 'development') {
          console.log('Development mode: Cookie validation failed', {
            hasLocalSession: !!localSession,
            hasAppSession: !!appSession,
            pathname
          });
        }

        const response = NextResponse.redirect(new URL('/login', request.url));
        response.cookies.delete('localSession');
        response.cookies.delete('appSession');
        return response;
      }
    }

    // Handle login/signup routes
    if (isLoginRoute || isSignupRoute) {
      if (isAuthenticated) {
        // Validate localSession before redirecting
        try {
          await decryptData(localSession);
          // Valid session - redirect to dashboard
          return NextResponse.redirect(new URL('/auth/userDashboard', request.url));
        } catch (error) {
          // Invalid session - clear cookies and allow access to login/signup
          const response = NextResponse.next();
          response.cookies.delete('localSession');
          response.cookies.delete('appSession');
          return response;
        }
      }
    }

    // For all other routes, just pass through
    return NextResponse.next();

  } catch (error) {
    console.error('Middleware error:', error);

    // On any error, clear cookies if on auth routes and redirect to login
    if (isAuthRoute) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('localSession');
      response.cookies.delete('appSession');
      return response;
    }

    // For other routes, just continue
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
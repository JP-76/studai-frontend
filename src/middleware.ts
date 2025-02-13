import { NextRequest, NextResponse } from 'next/server';
import { jwtDecode } from './utils/jwtDecode';

export function middleware(request: NextRequest) {
  // const { pathname } = request.nextUrl;

  // if (pathname === '/') {
  //   return NextResponse.next();
  // }

  // const authToken = request.cookies.get('auth_token');
  // if (!authToken) {
  //   return NextResponse.redirect(new URL('/', request.url));
  // }

  // try {
  //   const decodedToken = jwtDecode(authToken.value);
  //   const currentTime = Math.floor(Date.now() / 1000);

  //   if (decodedToken.exp < currentTime) {
  //     const response = NextResponse.redirect(new URL('/', request.url));
  //     response.cookies.set('auth_token', '', { expires: new Date(0) });
  //     return response;
  //   }
  // } catch (error) {
  //   // Se a decodificação falhar, removemos o cookie
  //   const response = NextResponse.redirect(new URL('/', request.url));
  //   response.cookies.set('auth_token', '', { expires: new Date(0) });
  //   return response;
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}

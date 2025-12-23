import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Get the main domain from environment or default
const getMainDomain = () => {
  // In production, this would be your actual domain
  // For development, we use localhost
  return process.env.NEXT_PUBLIC_MAIN_DOMAIN || 'localhost';
};

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get('host') || '';
  const mainDomain = getMainDomain();
  
  // Extract subdomain
  // Handle both production (admin.example.com) and development (admin.localhost:3000)
  let subdomain = '';
  
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    // Development: admin.localhost:3000
    const parts = hostname.split('.');
    if (parts.length > 1 && parts[0] !== 'localhost' && parts[0] !== 'www') {
      subdomain = parts[0];
    }
  } else {
    // Production: admin.example.com
    const parts = hostname.replace(`:${url.port}`, '').split('.');
    // If we have more than 2 parts (subdomain.domain.tld), first part is subdomain
    // Skip 'www' as a subdomain
    if (parts.length > 2 || (parts.length === 2 && !hostname.includes(mainDomain))) {
      if (parts[0] !== 'www') {
        subdomain = parts[0];
      }
    }
  }

  // Handle admin subdomain
  if (subdomain === 'admin') {
    // Rewrite admin.domain.com/* to /admin/*
    if (!url.pathname.startsWith('/admin')) {
      url.pathname = `/admin${url.pathname}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  // In development, allow direct /admin access (subdomain might not be set up in hosts)
  // In production, redirect to admin subdomain
  if (url.pathname.startsWith('/admin')) {
    // For development (localhost), allow direct /admin access
    if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
      return NextResponse.next();
    }

    // Production: redirect to admin.domain.com
    const protocol = url.protocol;
    const domainParts = hostname.split('.');
    // Remove any existing subdomain and add 'admin'
    const baseDomain = domainParts.length > 2
      ? domainParts.slice(-2).join('.')
      : hostname;
    const adminUrl = `${protocol}//admin.${baseDomain}${url.pathname.replace('/admin', '') || '/'}`;

    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

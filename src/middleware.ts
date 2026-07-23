import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// ============================================================
// Rate Limiter — In-memory sliding window per IP
// ============================================================
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 20; // max requests per window for auth endpoints

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

// Clean up stale entries periodically (every 5 min)
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

// ============================================================
// Middleware
// ============================================================
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // --- Rate Limiting on auth endpoints ---
  const rateLimitedPaths = [
    '/api/auth/callback/credentials',
    '/api/auth/register',
  ];

  if (rateLimitedPaths.some(p => pathname.startsWith(p))) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    if (isRateLimited(ip)) {
      return new NextResponse('Too many requests. Please try again later.', {
        status: 429,
        headers: { 'Retry-After': '60' },
      });
    }
  }

  // --- CSRF Protection on mutating API requests ---
  // Validate that the Origin/Referer header matches the app's own host.
  // Browsers always send Origin on cross-origin requests, so a missing or
  // mismatched Origin indicates a cross-site attack.
  const mutatingMethods = ['POST', 'PATCH', 'PUT', 'DELETE'];
  if (
    pathname.startsWith('/api/') &&
    mutatingMethods.includes(request.method) &&
    !pathname.startsWith('/api/auth/') // NextAuth handles its own CSRF
  ) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('host');

    // If Origin is present, it must match the host
    if (origin && host) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
          return new NextResponse('Forbidden — cross-origin request blocked', { status: 403 });
        }
      } catch {
        return new NextResponse('Forbidden — invalid origin', { status: 403 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};

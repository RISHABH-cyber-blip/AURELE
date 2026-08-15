import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { DISCLAIMER_COOKIE } from '@/lib/cookies'

const ALLOWLIST = ['/welcome', '/api/', '/auth/', '/legal/', '/_next/', '/favicon.ico']

// Only these paths actually need the auth session refreshed server-side
// (they render user-specific data via getCurrentUser()). Everything else
// — /shop, /product/*, /, /customize, etc. — doesn't need this, so
// skipping it here removes a real network round-trip from most navigations.
const NEEDS_AUTH_REFRESH = ['/account', '/orders', '/wishlist', '/admin', '/checkout', '/track-order']

function isAllowlisted(pathname: string) {
  return ALLOWLIST.some((prefix) => pathname.startsWith(prefix))
}

function needsAuthRefresh(pathname: string) {
  return NEEDS_AUTH_REFRESH.some((prefix) => pathname.startsWith(prefix))
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const pathname = request.nextUrl.pathname

  // ── Disclaimer gate — fast, cookie-only check, no network call ──
  const hasAgreed = request.cookies.get(DISCLAIMER_COOKIE)?.value === 'true'
  if (!hasAgreed && !isAllowlisted(pathname)) {
    const gateUrl = new URL('/welcome', request.url)
    gateUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(gateUrl)
  }

  // ── Supabase session refresh — ONLY for routes that actually need it ──
  if (needsAuthRefresh(pathname)) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (supabaseUrl && supabaseAnonKey && supabaseUrl.startsWith('http')) {
      try {
        const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
          cookies: {
            getAll() {
              return request.cookies.getAll()
            },
            setAll(cookiesToSet: Array<{ name: string; value: string; options?: CookieOptions }>) {
              cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
              response = NextResponse.next({ request })
              cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options)
              )
            },
          },
        })
        await supabase.auth.getUser()
      } catch (err) {
        console.error('Middleware Supabase auth error:', err)
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|glb|gltf)$).*)',
  ],
}
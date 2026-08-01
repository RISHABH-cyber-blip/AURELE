import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { DISCLAIMER_COOKIE } from '@/lib/cookies'

// Paths that must stay accessible even without agreeing to the disclaimer —
// otherwise you couldn't read the terms, and API/auth routes would break.
const ALLOWLIST = ['/welcome', '/api/', '/auth/', '/legal/', '/_next/', '/favicon.ico']

function isAllowlisted(pathname: string) {
  return ALLOWLIST.some((prefix) => pathname.startsWith(prefix))
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  // ── Existing Supabase session refresh (unchanged) ──
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )
  await supabase.auth.getUser()

  // ── NEW: Disclaimer gate — enforced server-side, before any page renders ──
  const pathname = request.nextUrl.pathname
  const hasAgreed = request.cookies.get(DISCLAIMER_COOKIE)?.value === 'true'

  if (!hasAgreed && !isAllowlisted(pathname)) {
    const gateUrl = new URL('/welcome', request.url)
    gateUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(gateUrl)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|glb|gltf)$).*)',
  ],
}
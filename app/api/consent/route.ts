import { NextResponse } from 'next/server'
import { DISCLAIMER_COOKIE, CONSENT_COOKIE, ONE_YEAR } from '@/lib/cookies'

export async function POST(request: Request) {
  const { type, value } = await request.json()

  const response = NextResponse.json({ success: true })

  if (type === 'disclaimer') {
    response.cookies.set(DISCLAIMER_COOKIE, 'true', { maxAge: ONE_YEAR, path: '/', sameSite: 'lax' })
  }
  if (type === 'cookies') {
    response.cookies.set(CONSENT_COOKIE, value, { maxAge: ONE_YEAR, path: '/', sameSite: 'lax' })
  }

  return response
}
import { cookies } from 'next/headers'

const DISCLAIMER_COOKIE = 'aurele_disclaimer_agreed'
const CONSENT_COOKIE = 'aurele_cookie_consent'
const ONE_YEAR = 60 * 60 * 24 * 365

export async function hasAgreedToDisclaimer(): Promise<boolean> {
  const store = await cookies()
  return store.get(DISCLAIMER_COOKIE)?.value === 'true'
}

export async function getCookieConsent(): Promise<string | null> {
  const store = await cookies()
  return store.get(CONSENT_COOKIE)?.value ?? null
}

export { DISCLAIMER_COOKIE, CONSENT_COOKIE, ONE_YEAR }
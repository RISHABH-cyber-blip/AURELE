import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const lat = searchParams.get('lat')
  const lon = searchParams.get('lon')

  if (!lat || !lon) {
    return NextResponse.json({ error: 'Missing coordinates.' }, { status: 400 })
  }

  const url = new URL('https://nominatim.openstreetmap.org/reverse')
  url.searchParams.set('lat', lat)
  url.searchParams.set('lon', lon)
  url.searchParams.set('format', 'json')
  url.searchParams.set('addressdetails', '1')

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': 'Aurele-Ecommerce-Demo/1.0 (portfolio project)' },
  })

  if (!res.ok) {
    return NextResponse.json({ error: 'Could not determine address.' }, { status: 500 })
  }

  const item = await res.json()

  return NextResponse.json({
    displayName: item.display_name,
    line1: item.address?.road || item.address?.suburb || item.address?.neighbourhood || '',
    city: item.address?.city || item.address?.town || item.address?.village || item.address?.suburb || '',
    state: item.address?.state || '',
    postalCode: item.address?.postcode || '',
    country: item.address?.country || '',
  })
}
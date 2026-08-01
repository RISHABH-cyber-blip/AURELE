import { NextResponse } from 'next/server'

// Proxies to OpenStreetMap's Nominatim geocoding service. We route through
// our own server (rather than calling Nominatim directly from the browser)
// because their usage policy requires a real identifying User-Agent and
// caps requests at 1/second — easier to control from our own API route.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')

  if (!query || query.length < 3) {
    return NextResponse.json({ results: [] })
  }

  const url = new URL('https://nominatim.openstreetmap.org/search')
  url.searchParams.set('q', query)
  url.searchParams.set('format', 'json')
  url.searchParams.set('addressdetails', '1')
  url.searchParams.set('limit', '6')

  const res = await fetch(url.toString(), {
    headers: { 'User-Agent': 'Aurele-Ecommerce-Demo/1.0 (portfolio project)' },
  })

  if (!res.ok) {
    return NextResponse.json({ results: [] })
  }

  const data = await res.json()

  const results = data.map((item: any) => ({
    displayName: item.display_name,
    lat: item.lat,
    lon: item.lon,
    line1: item.address?.road || item.address?.suburb || item.address?.neighbourhood || '',
    city: item.address?.city || item.address?.town || item.address?.village || item.address?.suburb || '',
    state: item.address?.state || '',
    postalCode: item.address?.postcode || '',
    country: item.address?.country || '',
  }))

  return NextResponse.json({ results })
}
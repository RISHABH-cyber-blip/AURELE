import { NextResponse } from 'next/server'
import { getNewArrivals } from '@/lib/products'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') || undefined
  const products = await getNewArrivals(category)
  return NextResponse.json({ products })
}
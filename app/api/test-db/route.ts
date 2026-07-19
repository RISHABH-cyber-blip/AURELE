import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// Temporary route — delete this file once you've confirmed the connection works.
export async function GET() {
  try {
    const brands = await prisma.brand.findMany()
    return NextResponse.json({
      connected: true,
      message: `Found ${brands.length} brand(s) in your live database.`,
      brands,
    })
  } catch (error) {
    return NextResponse.json(
      { connected: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
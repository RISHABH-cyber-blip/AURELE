import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { CASE_METALS, DIAL_COLORS, STRAP_MATERIALS } from '@/lib/customize-options'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, caseMetalId, dialColorId, strapMaterialId, size, estimatedPrice } = body

    if (!email || !caseMetalId || !dialColorId || !strapMaterialId || !size) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 })
    }

    const caseMetal = CASE_METALS.find((c) => c.id === caseMetalId)?.label ?? caseMetalId
    const dialColor = DIAL_COLORS.find((d) => d.id === dialColorId)?.label ?? dialColorId
    const strapMaterial = STRAP_MATERIALS.find((s) => s.id === strapMaterialId)?.label ?? strapMaterialId

    await prisma.customBuildRequest.create({
      data: { email, caseMetal, dialColor, strapMaterial, size, estimatedPrice },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Custom build save error:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
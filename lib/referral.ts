import { prisma } from '@/lib/prisma'

const CHARSET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // no ambiguous chars (0/O, 1/I)

function randomCode(length = 7): string {
  let code = ''
  for (let i = 0; i < length; i++) code += CHARSET[Math.floor(Math.random() * CHARSET.length)]
  return code
}

export async function generateUniqueReferralCode(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomCode()
    const existing = await prisma.user.findUnique({ where: { referralCode: code } as any })
    if (!existing) return code
  }
  return `${randomCode(5)}${Date.now().toString(36).slice(-3).toUpperCase()}`
}

// Points awarded to the referrer when their referred friend's FIRST
// paid order goes through.
export const REFERRAL_REWARD_POINTS = 500
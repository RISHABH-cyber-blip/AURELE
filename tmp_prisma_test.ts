import { prisma } from './lib/prisma'

async function main() {
  const users = await prisma.user.findMany({ take: 1, select: { id: true, isAdmin: true } })
  console.log('Fetched users successfully:', users)
  await prisma.$disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})



import { prisma } from './lib/prisma'

async function main() {
  const brands = await prisma.brand.findMany({ take: 1 })
  console.log('brands', brands.length)
  await prisma.$disconnect()
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

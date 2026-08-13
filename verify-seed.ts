import { prisma } from './lib/prisma'

async function verify() {
  try {
    const brandCount = await prisma.brand.count()
    const productCount = await prisma.product.count()
    const variantCount = await prisma.productVariant.count()
    const categoryCount = await prisma.category.count()
    
    console.log('✅ Seed Verification Results:')
    console.log(`  Brands: ${brandCount}`)
    console.log(`  Categories: ${categoryCount}`)
    console.log(`  Products: ${productCount}`)
    console.log(`  Variants: ${variantCount}`)
    
    if (brandCount > 0 && productCount > 0) {
      console.log('\n✅ Seed successful! Database is populated.')
    } else {
      console.log('\n❌ Seed may have failed. No data found.')
    }
  } catch (error) {
    console.error('❌ Error checking database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

verify()

import { prisma } from "../lib/db"

async function main() {
  try {
    console.log("🔌 Testing MongoDB connection...")
    
    // Test connection
    await prisma.$connect()
    console.log("✅ Connected to MongoDB successfully!")

    // Test query - Count documents
    const categoryCount = await prisma.category.count()
    console.log(`📦 Categories: ${categoryCount}`)

    const productCount = await prisma.product.count()
    console.log(`🛍️  Products: ${productCount}`)

    const userCount = await prisma.user.count()
    console.log(`👤 Users: ${userCount}`)

    const orderCount = await prisma.order.count()
    console.log(`📋 Orders: ${orderCount}`)

    // Test find first category
    const firstCategory = await prisma.category.findFirst()
    if (firstCategory) {
      console.log(`\n📂 First category: ${firstCategory.name} (${firstCategory.slug})`)
    }

    // Test find first product
    const firstProduct = await prisma.product.findFirst({
      include: { category: true }
    })
    if (firstProduct) {
      console.log(`\n🛒 First product: ${firstProduct.name}`)
      console.log(`   Price: ${firstProduct.price.toLocaleString()}₫`)
      console.log(`   Category: ${firstProduct.category.name}`)
    }

    console.log("\n✅ All tests passed!")
  } catch (error) {
    console.error("❌ Connection failed:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()


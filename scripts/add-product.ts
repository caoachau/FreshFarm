import { prisma } from "../lib/db"

async function main() {
  const args = process.argv.slice(2)
  
  if (args.length < 1) {
    console.log("Usage: npx ts-node scripts/add-product.ts <category-slug>")
    console.log("Example: npx ts-node scripts/add-product.ts vegetables-fruits")
    console.log("\nAvailable categories:")
    const categories = await prisma.category.findMany({
      select: { slug: true, name: true }
    })
    categories.forEach(cat => {
      console.log(`  - ${cat.slug}: ${cat.name}`)
    })
    await prisma.$disconnect()
    process.exit(1)
  }

  const categorySlug = args[0]

  try {
    // Find category
    const category = await prisma.category.findUnique({
      where: { slug: categorySlug }
    })

    if (!category) {
      console.error(`❌ Category with slug "${categorySlug}" not found!`)
      process.exit(1)
    }

    // Example product data - modify as needed
    const productData = {
      name: "Cà Chua Tươi Sạch",
      description: "Cà chua đỏ tươi sạch, giàu vitamin C và lycopene",
      price: 28000,
      originalPrice: 35000,
      discount: 20,
      image: "/fresh-organic-tomatoes.jpg",
      images: ["/fresh-organic-tomatoes.jpg", "/fresh-organic-tomatoes.png"],
      stock: 150,
      sold: 0,
      rating: 4.6,
      votes: 0,
      categoryId: category.id,
    }

    // Create product
    const product = await prisma.product.create({
      data: productData,
      include: {
        category: true
      }
    })

    console.log("✅ Product created successfully!")
    console.log(`   ID: ${product.id}`)
    console.log(`   Name: ${product.name}`)
    console.log(`   Price: ${product.price.toLocaleString()}₫`)
    console.log(`   Category: ${product.category.name}`)
    console.log(`   Stock: ${product.stock}`)
  } catch (error) {
    console.error("❌ Error creating product:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()


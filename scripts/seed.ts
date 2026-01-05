import { prisma } from "../lib/db"

async function main() {
  console.log("Starting database seed...")

  // Delete existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.review.deleteMany()
  await prisma.wishlistItem.deleteMany()
  await prisma.cartItem.deleteMany()
  await prisma.address.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()
  await prisma.blogPost.deleteMany()
  await prisma.user.deleteMany()

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Rau - Cú - Trái Cây",
        slug: "vegetables-fruits",
        description: "Rau quả tươi sạch hữu cơ",
        image: "/fresh-vegetables.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Thịt - Cá - Hải Sản",
        slug: "meat-fish-seafood",
        description: "Thịt, cá và hải sản tươi sống",
        image: "/meat-and-fish.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Sữa - Trứng - Tươi Mát",
        slug: "dairy-eggs",
        description: "Sữa, trứng và các sản phẩm tươi mát",
        image: "/dairy-products.jpg",
      },
    }),
    prisma.category.create({
      data: {
        name: "Ngũ Cốc - Đậu - Hạt",
        slug: "grains-beans",
        description: "Ngũ cốc, đậu và các loại hạt",
        image: "/grains-and-seeds.jpg",
      },
    }),
  ])

  const products = [
    {
      name: "Su Hào Xanh WinEco",
      description: "Su hào xanh tươi sạch, giàu chất xơ",
      price: 35.12,
      originalPrice: 45,
      discount: 22,
      categoryId: categories[0].id,
      stock: 150,
      image: "/fresh-vegetables.jpg",
      images: ["/fresh-vegetables.jpg"],
      rating: 4.8,
      votes: 156,
      sold: 450,
    },
    {
      name: "Cần Tây Lần WinEco",
      description: "Cần tây lần tươi sạch, giàu vitamin",
      price: 52.72,
      originalPrice: 65,
      discount: 19,
      categoryId: categories[0].id,
      stock: 120,
      image: "/fresh-vegetables.jpg",
      images: ["/fresh-vegetables.jpg"],
      rating: 4.6,
      votes: 98,
      sold: 320,
    },
    {
      name: "Bí Xanh (Dưa) WinEco",
      description: "Dưa lỡ xanh tươi, sạch sẽ",
      price: 31.92,
      originalPrice: 40,
      discount: 20,
      categoryId: categories[0].id,
      stock: 100,
      image: "/fresh-vegetables.jpg",
      images: ["/fresh-vegetables.jpg"],
      rating: 4.5,
      votes: 78,
      sold: 210,
    },
    {
      name: "Dưa Hấu Đỏ Kỳ Lạ",
      description: "Dưa hấu đỏ ngon, ngọt, mặn",
      price: 79.2,
      originalPrice: 99,
      discount: 20,
      categoryId: categories[0].id,
      stock: 80,
      image: "/fresh-fruits.jpg",
      images: ["/fresh-fruits.jpg"],
      rating: 4.7,
      votes: 145,
      sold: 580,
    },
    {
      name: "Cải Lơ Xanh",
      description: "Cải lơ xanh tươi sạch, giàu dinh dưỡng",
      price: 18.32,
      originalPrice: 22,
      discount: 17,
      categoryId: categories[0].id,
      stock: 200,
      image: "/fresh-vegetables.jpg",
      images: ["/fresh-vegetables.jpg"],
      rating: 4.4,
      votes: 67,
      sold: 380,
    },
    {
      name: "Thịt Heo Nạc",
      description: "Thịt heo nạc tươi, sạch sẽ, an toàn",
      price: 125.0,
      originalPrice: 150,
      discount: 17,
      categoryId: categories[1].id,
      stock: 50,
      image: "/meat-and-fish.jpg",
      images: ["/meat-and-fish.jpg"],
      rating: 4.7,
      votes: 234,
      sold: 890,
    },
    {
      name: "Cá Ba Sa Phi Lê",
      description: "Cá ba sa phi lê tươi sống, dinh dưỡng cao",
      price: 98.0,
      originalPrice: 120,
      discount: 18,
      categoryId: categories[1].id,
      stock: 40,
      image: "/meat-and-fish.jpg",
      images: ["/meat-and-fish.jpg"],
      rating: 4.6,
      votes: 156,
      sold: 620,
    },
    {
      name: "Sữa Tươi Vinamilk",
      description: "Sữa tươi nguyên chất 100%, giàu canxi",
      price: 28.5,
      originalPrice: 35,
      discount: 19,
      categoryId: categories[2].id,
      stock: 200,
      image: "/dairy-products.jpg",
      images: ["/dairy-products.jpg"],
      rating: 4.5,
      votes: 267,
      sold: 1200,
    },
    {
      name: "Trứng Gà Sạch",
      description: "Trứng gà sạch, đủ dinh dưỡng",
      price: 45.0,
      originalPrice: 55,
      discount: 18,
      categoryId: categories[2].id,
      stock: 180,
      image: "/dairy-products.jpg",
      images: ["/dairy-products.jpg"],
      rating: 4.4,
      votes: 145,
      sold: 750,
    },
    {
      name: "Gạo Lức Hữu Cơ",
      description: "Gạo lức hữu cơ, giàu chất xơ",
      price: 65.0,
      originalPrice: 80,
      discount: 19,
      categoryId: categories[3].id,
      stock: 120,
      image: "/grains-and-seeds.jpg",
      images: ["/grains-and-seeds.jpg"],
      rating: 4.5,
      votes: 112,
      sold: 560,
    },
    {
      name: "Đậu Phộng Hữu Cơ",
      description: "Đậu phộng hữu cơ, bổ dưỡng",
      price: 85.0,
      originalPrice: 105,
      discount: 19,
      categoryId: categories[3].id,
      stock: 100,
      image: "/grains-and-seeds.jpg",
      images: ["/grains-and-seeds.jpg"],
      rating: 4.7,
      votes: 134,
      sold: 420,
    },
  ]

  for (const product of products) {
    await prisma.product.create({ data: product })
  }

  // Create blog posts
  const blogPosts = [
    {
      title: "10 Lợi Ích Sức Khỏe Của Rau Lá Xanh",
      slug: "10-loi-ich-suc-khoe-rau-la-xanh",
      excerpt: "Rau lá xanh là nguồn dinh dưỡng phong phú và tốt cho sức khỏe.",
      content: "Chi tiết về lợi ích của rau lá xanh...",
      image: "/fresh-vegetables.jpg",
      category: "Tips",
    },
    {
      title: "Cách Chọn Và Bảo Quản Rau Quả Sạch",
      slug: "cach-chon-bao-quan-rau-qua-sach",
      excerpt: "Hướng dẫn chọn rau quả tươi sạch và bảo quản lâu dài.",
      content: "Chi tiết về cách chọn và bảo quản...",
      image: "/fresh-fruits.jpg",
      category: "Tips",
    },
    {
      title: "Công Thức Làm Bánh Quy Mật Ong Hàn Quốc",
      slug: "cong-thuc-banh-quy-mat-ong-han-quoc",
      excerpt: "Công thức chi tiết để làm bánh quy ngon tại nhà.",
      content: "Chi tiết công thức...",
      image: "/fresh-vegetables.jpg",
      category: "Recipes",
    },
  ]

  for (const post of blogPosts) {
    await prisma.blogPost.create({ data: post })
  }

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

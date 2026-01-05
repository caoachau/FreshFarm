import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getUserId, isValidObjectId } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - Invalid or missing user ID" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || user.role !== "SELLER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const products = await prisma.product.findMany({
      where: { sellerId: userId },
      include: {
        category: true,
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - Invalid or missing user ID" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user || user.role !== "SELLER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const data = await request.json()

    // Validate required fields
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 })
    }
    
    if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
      return NextResponse.json({ error: "Product description is required" }, { status: 400 })
    }
    
    if (!data.price || typeof data.price !== 'number' || data.price <= 0) {
      return NextResponse.json({ error: "Valid price is required" }, { status: 400 })
    }
    
    if (!data.categoryId || !isValidObjectId(String(data.categoryId))) {
      return NextResponse.json({ error: "Valid category ID is required" }, { status: 400 })
    }
    
    // Verify category exists
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } })
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    const product = await prisma.product.create({
      data: {
        name: data.name.trim(),
        description: data.description.trim(),
        price: data.price,
        originalPrice: data.originalPrice || null,
        discount: data.discount || 0,
        image: data.image || "",
        images: data.images || [],
        stock: data.stock || 100,
        categoryId: data.categoryId,
        sellerId: userId,
        status: "PENDING", // Chờ admin duyệt
        variety: data.variety || null,
        season: data.season || null,
        certification: data.certification || null,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}


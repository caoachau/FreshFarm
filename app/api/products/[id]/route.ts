import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { isValidObjectId } from "@/lib/api-utils"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const productId = String(id).trim()
    
    if (!isValidObjectId(productId)) {
      return NextResponse.json({ error: "Invalid product ID format" }, { status: 400 })
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        reviews: {
          include: { user: { select: { fullName: true, avatar: true } } },
          orderBy: { createdAt: "desc" },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    const relatedProducts = await prisma.product.findMany({
      where: {
        categoryId: product.categoryId,
        id: { not: productId },
      },
      take: 4,
    })

    return NextResponse.json({ product, relatedProducts })
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

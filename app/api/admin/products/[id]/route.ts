import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getUserId, isValidObjectId } from "@/lib/api-utils"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - Invalid or missing user ID" }, { status: 401 })
    }

    const admin = await prisma.user.findUnique({ where: { id: userId } })
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    const productId = String(id).trim()
    
    if (!isValidObjectId(productId)) {
      return NextResponse.json({ error: "Invalid product ID format" }, { status: 400 })
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        category: true,
        seller: {
          select: { id: true, fullName: true, email: true },
        },
      },
    })

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - Invalid or missing user ID" }, { status: 401 })
    }

    const admin = await prisma.user.findUnique({ where: { id: userId } })
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    const productId = String(id).trim()
    
    if (!isValidObjectId(productId)) {
      return NextResponse.json({ error: "Invalid product ID format" }, { status: 400 })
    }

    const body = await request.json()
    const { 
      name, 
      description, 
      price, 
      originalPrice,
      discount,
      stock, 
      status, 
      categoryId,
      image,
      images,
      variety,
      season,
      certification,
      sellerId
    } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name.trim()
    if (description !== undefined) updateData.description = description.trim()
    if (price !== undefined) updateData.price = Number(price)
    if (originalPrice !== undefined) updateData.originalPrice = originalPrice ? Number(originalPrice) : null
    if (discount !== undefined) updateData.discount = Number(discount)
    if (stock !== undefined) updateData.stock = Number(stock)
    if (status !== undefined) updateData.status = status
    if (image !== undefined) updateData.image = image
    if (images !== undefined) updateData.images = Array.isArray(images) ? images : []
    if (variety !== undefined) updateData.variety = variety || null
    if (season !== undefined) updateData.season = season || null
    if (certification !== undefined) updateData.certification = certification || null
    if (categoryId !== undefined && isValidObjectId(String(categoryId))) {
      updateData.categoryId = categoryId
    }
    if (sellerId !== undefined) {
      updateData.sellerId = sellerId && isValidObjectId(String(sellerId)) ? sellerId : null
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: updateData,
      include: {
        category: true,
        seller: {
          select: { id: true, fullName: true, email: true },
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - Invalid or missing user ID" }, { status: 401 })
    }

    const admin = await prisma.user.findUnique({ where: { id: userId } })
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    const productId = String(id).trim()
    
    if (!isValidObjectId(productId)) {
      return NextResponse.json({ error: "Invalid product ID format" }, { status: 400 })
    }

    await prisma.product.delete({
      where: { id: productId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}

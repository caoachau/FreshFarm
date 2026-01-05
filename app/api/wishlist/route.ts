import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getUserId, isValidObjectId } from "@/lib/api-utils"

// GET: trả về wishlist theo dạng { items: [...] } để đồng bộ với hook useWishlist
export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - Invalid or missing user ID" }, { status: 401 })
    }

    const items = await prisma.wishlistItem.findMany({
      where: { userId },
      include: { product: true },
    })

    return NextResponse.json({ items })
  } catch (error) {
    console.error("Error fetching wishlist:", error)
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 })
  }
}

// POST: toggle thêm / xoá khỏi wishlist
export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - Invalid or missing user ID" }, { status: 401 })
    }

    const requestBody = await request.json()
    const productId = String(requestBody.productId || "").trim()
    
    if (!productId || !isValidObjectId(productId)) {
      return NextResponse.json({ error: "Invalid product ID format" }, { status: 400 })
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
    })

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } })
      return NextResponse.json({ action: "removed" })
    }

    const item = await prisma.wishlistItem.create({
      data: { userId, productId },
      include: { product: true },
    })

    return NextResponse.json({ action: "added", item })
  } catch (error) {
    console.error("Error updating wishlist:", error)
    return NextResponse.json({ error: "Failed to update wishlist" }, { status: 500 })
  }
}

// DELETE: xoá 1 sản phẩm khỏi wishlist theo productId
export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - Invalid or missing user ID" }, { status: 401 })
    }

    const requestBody = await request.json()
    const productId = String(requestBody.productId || "").trim()
    
    if (!productId || !isValidObjectId(productId)) {
      return NextResponse.json({ error: "Invalid product ID format" }, { status: 400 })
    }

    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId, productId } },
    })

    if (!existing) {
      return NextResponse.json({ success: true })
    }

    await prisma.wishlistItem.delete({ where: { id: existing.id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting from wishlist:", error)
    return NextResponse.json({ error: "Failed to delete from wishlist" }, { status: 500 })
  }
}

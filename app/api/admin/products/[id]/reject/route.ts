import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getUserId, isValidObjectId } from "@/lib/api-utils"

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

    const product = await prisma.product.update({
      where: { id: productId },
      data: { status: "REJECTED" },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error rejecting product:", error)
    return NextResponse.json({ error: "Failed to reject product" }, { status: 500 })
  }
}


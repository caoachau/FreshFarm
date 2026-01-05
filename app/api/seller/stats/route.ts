import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getUserId } from "@/lib/api-utils"

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

    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    const [totalProducts, pendingOrders, orders] = await Promise.all([
      prisma.product.count({ where: { sellerId: userId } }),
      prisma.order.count({
        where: {
          sellerId: userId,
          status: "PENDING",
        },
      }),
      prisma.order.findMany({
        where: {
          sellerId: userId,
          status: { in: ["DELIVERED", "CONFIRMED", "PROCESSING", "SHIPPING"] },
          createdAt: { gte: startOfMonth },
        },
        include: { items: true },
      }),
    ])

    const monthlyRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)

    // Tính rating trung bình từ reviews của sản phẩm
    const products = await prisma.product.findMany({
      where: { sellerId: userId },
      include: { reviews: true },
    })

    const allRatings = products.flatMap((p) => p.reviews.map((r) => r.rating))
    const averageRating =
      allRatings.length > 0
        ? allRatings.reduce((sum, r) => sum + r, 0) / allRatings.length
        : 0

    return NextResponse.json({
      totalProducts,
      pendingOrders,
      monthlyRevenue,
      averageRating,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}


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
    if (!user || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const [
      totalUsers,
      pendingProducts,
      warnings,
      totalOrders,
      totalProducts,
      totalReviews,
      totalRevenue,
      activeUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count({ where: { status: "PENDING" } }),
      prisma.productWarning.count({ where: { isRead: false } }),
      prisma.order.count(),
      prisma.product.count(),
      prisma.review.count(),
      prisma.order.aggregate({
        where: { status: "DELIVERED" },
        _sum: { totalAmount: true },
      }),
      prisma.user.count({ where: { status: "ACTIVE" } }),
    ])

    return NextResponse.json({
      totalUsers,
      activeUsers,
      pendingProducts,
      warnings,
      totalOrders,
      totalProducts,
      totalReviews,
      totalRevenue: totalRevenue._sum.totalAmount || 0,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}


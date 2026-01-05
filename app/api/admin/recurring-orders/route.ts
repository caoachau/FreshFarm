import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getUserId } from "@/lib/api-utils"

// GET - Lấy tất cả recurring orders (Admin only)
export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 })
    }

    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    // Check if RecurringOrder model exists
    if (!prisma.recurringOrder) {
      return NextResponse.json(
        {
          error: "Database schema not updated. Please run: npm run db:generate && npm run db:push",
        },
        { status: 500 }
      )
    }

    const where: any = {}
    if (status && status !== "all") {
      where.status = status
    }

    const [recurringOrders, total] = await Promise.all([
      prisma.recurringOrder.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              phone: true,
            },
          },
          items: {
            include: {
              product: true,
            },
            orderBy: {
              deliveryDate: "asc",
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.recurringOrder.count({ where }),
    ])

    return NextResponse.json({
      recurringOrders,
      total,
      page,
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Error fetching recurring orders:", error)
    return NextResponse.json({ error: "Failed to fetch recurring orders" }, { status: 500 })
  }
}


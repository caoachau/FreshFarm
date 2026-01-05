import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getUserId, isValidObjectId } from "@/lib/api-utils"

// PATCH - Đánh dấu item đã giao
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 })
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 })
    }

    // Check if RecurringOrderItem model exists
    if (!prisma.recurringOrderItem) {
      return NextResponse.json(
        {
          error: "Database schema not updated. Please run: npm run db:generate && npm run db:push",
        },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { isDelivered } = body

    const item = await prisma.recurringOrderItem.findUnique({
      where: { id },
      include: {
        recurringOrder: true,
      },
    })

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    const updated = await prisma.recurringOrderItem.update({
      where: { id },
      data: {
        isDelivered: isDelivered ?? true,
        deliveredAt: isDelivered ? new Date() : null,
      },
      include: {
        product: true,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating recurring order item:", error)
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 })
  }
}

// DELETE - Xóa item khỏi recurring order
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 })
    }

    // Check if RecurringOrderItem model exists
    if (!prisma.recurringOrderItem) {
      return NextResponse.json(
        {
          error: "Database schema not updated. Please run: npm run db:generate && npm run db:push",
        },
        { status: 500 }
      )
    }

    const item = await prisma.recurringOrderItem.findUnique({
      where: { id },
      include: {
        recurringOrder: true,
      },
    })

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    // Check permission
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (item.recurringOrder.userId !== userId && user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.recurringOrderItem.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting recurring order item:", error)
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 })
  }
}


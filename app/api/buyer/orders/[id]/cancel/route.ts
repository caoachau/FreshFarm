import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = request.headers.get("x-user-id")
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { reason } = await request.json().catch(() => ({ reason: null }))

    const order = await prisma.order.findUnique({
      where: { id },
    })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    if (order.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Cho phép hủy đơn hàng khi chưa giao (trừ DELIVERED và CANCELLED)
    const cancellableStatuses = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPING"]
    if (!cancellableStatuses.includes(order.status)) {
      return NextResponse.json(
        { error: "Không thể hủy đơn hàng ở trạng thái này" },
        { status: 400 }
      )
    }

    const updated = await prisma.order.update({
      where: { id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        cancelledReason: reason || "Người mua hủy",
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: "Failed to cancel order" }, { status: 500 })
  }
}


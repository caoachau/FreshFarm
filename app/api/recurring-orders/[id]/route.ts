import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getUserId, isValidObjectId } from "@/lib/api-utils"

// GET - Lấy chi tiết recurring order
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if RecurringOrder model exists
    if (!prisma.recurringOrder) {
      return NextResponse.json(
        {
          error: "Database schema not updated. Please run: npm run db:generate && npm run db:push",
        },
        { status: 500 }
      )
    }

    const { id } = await params
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 })
    }

    const recurringOrder = await prisma.recurringOrder.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
          orderBy: {
            deliveryDate: "asc",
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
            phone: true,
          },
        },
      },
    })

    if (!recurringOrder) {
      return NextResponse.json({ error: "Recurring order not found" }, { status: 404 })
    }

    // Check permission (user can only view their own orders, admin can view all)
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (recurringOrder.userId !== userId && user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    return NextResponse.json(recurringOrder)
  } catch (error) {
    console.error("Error fetching recurring order:", error)
    return NextResponse.json({ error: "Failed to fetch recurring order" }, { status: 500 })
  }
}

// PATCH - Cập nhật recurring order
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if RecurringOrder model exists
    if (!prisma.recurringOrder) {
      return NextResponse.json(
        {
          error: "Database schema not updated. Please run: npm run db:generate && npm run db:push",
        },
        { status: 500 }
      )
    }

    const { id } = await params
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 })
    }

    const body = await request.json()
    const { status, notes } = body

    const recurringOrder = await prisma.recurringOrder.findUnique({
      where: { id },
    })

    if (!recurringOrder) {
      return NextResponse.json({ error: "Recurring order not found" }, { status: 404 })
    }

    // Check permission
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (recurringOrder.userId !== userId && user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Update
    const updated = await prisma.recurringOrder.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("Error updating recurring order:", error)
    return NextResponse.json({ error: "Failed to update recurring order" }, { status: 500 })
  }
}

// DELETE - Xóa recurring order
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if RecurringOrder model exists
    if (!prisma.recurringOrder) {
      return NextResponse.json(
        {
          error: "Database schema not updated. Please run: npm run db:generate && npm run db:push",
        },
        { status: 500 }
      )
    }

    const { id } = await params
    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 })
    }

    const recurringOrder = await prisma.recurringOrder.findUnique({
      where: { id },
    })

    if (!recurringOrder) {
      return NextResponse.json({ error: "Recurring order not found" }, { status: 404 })
    }

    // Check permission
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (recurringOrder.userId !== userId && user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await prisma.recurringOrder.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting recurring order:", error)
    return NextResponse.json({ error: "Failed to delete recurring order" }, { status: 500 })
  }
}


import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const phone = searchParams.get("phone")
    const orderId = searchParams.get("orderId")

    if (!phone && !orderId) {
      return NextResponse.json({ error: "phone or orderId is required" }, { status: 400 })
    }

    let order = null

    if (orderId) {
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          items: {
            include: { product: true },
          },
        },
      })

      if (!order) {
        return NextResponse.json({ found: false })
      }

      return NextResponse.json({
        found: true,
        orders: [order],
      })
    } else if (phone) {
      // Return all orders for this phone number, not just the first one
      const orders = await prisma.order.findMany({
        where: { phone },
        orderBy: { createdAt: "desc" },
        include: {
          items: {
            include: { product: true },
          },
        },
      })

      if (!orders || orders.length === 0) {
        return NextResponse.json({ found: false })
      }

      return NextResponse.json({
        found: true,
        orders,
      })
    }

    return NextResponse.json({ found: false })
  } catch (error) {
    console.error("Error tracking order:", error)
    return NextResponse.json({ error: "Failed to track order" }, { status: 500 })
  }
}


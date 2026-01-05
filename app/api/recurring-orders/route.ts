import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getUserId, isValidObjectId } from "@/lib/api-utils"

// GET - Lấy danh sách recurring orders của user
export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if RecurringOrder model exists
    if (!prisma.recurringOrder) {
      console.error("RecurringOrder model not found in Prisma Client. Please run: npm run db:generate")
      return NextResponse.json(
        {
          error: "Database schema not updated. Please run: npm run db:generate && npm run db:push",
          details: "RecurringOrder model not found in Prisma Client",
        },
        { status: 500 }
      )
    }

    const recurringOrders = await prisma.recurringOrder.findMany({
      where: { userId },
      include: {
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
    })

    return NextResponse.json(recurringOrders)
  } catch (error: any) {
    console.error("Error fetching recurring orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch recurring orders", details: error.message },
      { status: 500 }
    )
  }
}

// POST - Tạo recurring order mới
export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { items, shippingAddress, phone, notes } = body

    // Validate
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Items are required" }, { status: 400 })
    }

    if (!shippingAddress || !phone) {
      return NextResponse.json({ error: "Shipping address and phone are required" }, { status: 400 })
    }

    // Validate each item
    for (const item of items) {
      if (!item.productId || !isValidObjectId(String(item.productId))) {
        return NextResponse.json({ error: "Invalid product ID in items" }, { status: 400 })
      }
      if (!item.quantity || item.quantity <= 0) {
        return NextResponse.json({ error: "Invalid quantity in items" }, { status: 400 })
      }
      if (!item.deliveryDate) {
        return NextResponse.json({ error: "Delivery date is required for each item" }, { status: 400 })
      }
    }

    // Get product prices
    const productIds = items.map((item: any) => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    const productMap = new Map(products.map((p) => [p.id, p]))

    // Check if RecurringOrder model exists in Prisma Client
    if (!prisma.recurringOrder) {
      console.error("RecurringOrder model not found in Prisma Client. Please run: npm run db:generate")
      return NextResponse.json(
        {
          error: "Database schema not updated. Please run: npm run db:generate && npm run db:push",
          details: "RecurringOrder model not found in Prisma Client",
        },
        { status: 500 }
      )
    }

    // Create recurring order with items
    const recurringOrder = await prisma.recurringOrder.create({
      data: {
        userId,
        shippingAddress,
        phone,
        notes: notes || null,
        items: {
          create: items.map((item: any) => {
            const product = productMap.get(item.productId)
            if (!product) {
              throw new Error(`Product ${item.productId} not found`)
            }
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product.price,
              deliveryDate: new Date(item.deliveryDate),
            }
          }),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    return NextResponse.json(recurringOrder)
  } catch (error: any) {
    console.error("Error creating recurring order:", error)
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      meta: error.meta,
      stack: error.stack,
    })
    
    // Check if it's a Prisma error about missing model
    if (error.message?.includes("recurringOrder") || error.message?.includes("RecurringOrder")) {
      return NextResponse.json(
        {
          error: "Database schema not updated. Please run: npm run db:generate && npm run db:push",
          details: error.message,
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: error.message || "Failed to create recurring order", details: error.message },
      { status: 500 }
    )
  }
}


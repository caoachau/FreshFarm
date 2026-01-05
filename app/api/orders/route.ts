import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getUserId, isValidObjectId } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - Invalid or missing user ID" }, { status: 401 })
    }

    const orders = await prisma.order.findMany({
      where: { userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - Invalid or missing user ID" }, { status: 401 })
    }

    const { items, shippingAddress, phone, paymentMethod, discount } = await request.json()
    
    // Validate required fields
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
      if (!item.quantity || item.quantity <= 0 || !Number.isInteger(item.quantity)) {
        return NextResponse.json({ error: "Invalid quantity in items" }, { status: 400 })
      }
      if (!item.price || item.price <= 0 || typeof item.price !== 'number') {
        return NextResponse.json({ error: "Invalid price in items" }, { status: 400 })
      }
    }

    let totalAmount = 0
    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } })
      if (!product) {
        return NextResponse.json({ error: `Product ${item.productId} not found` }, { status: 404 })
      }
      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Insufficient stock for product ${product.name}` }, { status: 400 })
      }
      totalAmount += product.price * item.quantity
    }

    const shippingFee = totalAmount > 300000 ? 0 : 30000
    
    // Get sellerId from the first product (assuming all items are from the same seller)
    let sellerId: string | null = null
    if (items.length > 0) {
      const firstProduct = await prisma.product.findUnique({
        where: { id: items[0].productId },
        select: { sellerId: true },
      })
      sellerId = firstProduct?.sellerId || null
    }
    
    const order = await prisma.order.create({
      data: {
        userId,
        sellerId,
        shippingAddress,
        phone,
        paymentMethod,
        totalAmount,
        discount: discount || 0,
        shippingFee,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: { items: true },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}

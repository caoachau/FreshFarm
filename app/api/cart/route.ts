import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getUserId, isValidObjectId } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request)
    
    if (!userId) {
      console.error("GET /api/cart - Unauthorized: Invalid or missing user ID")
      return NextResponse.json(
        { error: "Unauthorized - Invalid or missing user ID" }, 
        { status: 401 }
      )
    }

    console.log("Fetching cart for userId:", userId)

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    })

    console.log("Cart items found:", cartItems.length)
    return NextResponse.json(cartItems)
  } catch (error) {
    console.error("Error fetching cart:", error)
    return NextResponse.json(
      { error: "Failed to fetch cart" }, 
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request)
    
    if (!userId) {
      console.error("POST /api/cart - Unauthorized: Invalid or missing user ID")
      return NextResponse.json(
        { error: "Unauthorized - Invalid or missing user ID" }, 
        { status: 401 }
      )
    }

    const body = await request.json()
    console.log("POST /api/cart body:", body)
    
    // Extract and validate productId
    const productIdRaw = body.productId
    if (!productIdRaw) {
      return NextResponse.json(
        { error: "Product ID is required" }, 
        { status: 400 }
      )
    }

    const productId = String(productIdRaw).trim()
    console.log("Processing productId:", productId)
    
    if (!isValidObjectId(productId)) {
      console.error("Invalid product ID format:", productId)
      return NextResponse.json(
        { error: "Invalid product ID format" }, 
        { status: 400 }
      )
    }

    const quantity = body.quantity || 1
    const variant = body.variant || null

    // Check if item already exists
    const existing = await prisma.cartItem.findUnique({
      where: { 
        userId_productId: { userId, productId } 
      },
    })

    if (existing) {
      // Update quantity if item exists
      const updated = await prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + quantity },
        include: { product: true },
      })
      console.log("Cart item updated:", updated.id)
      return NextResponse.json(updated)
    }

    // Create new cart item
    const newItem = await prisma.cartItem.create({
      data: { userId, productId, quantity, variant },
      include: { product: true },
    })

    console.log("Cart item created:", newItem.id)
    return NextResponse.json(newItem)
  } catch (error) {
    console.error("Error adding to cart:", error)
    return NextResponse.json(
      { error: "Failed to add to cart" }, 
      { status: 500 }
    )
  }
}

import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getUserId, isValidObjectId } from "@/lib/api-utils"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const productId = String(id).trim()
    
    if (!isValidObjectId(productId)) {
      return NextResponse.json({ error: "Invalid product ID format" }, { status: 400 })
    }

    const reviews = await prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            fullName: true,
            avatar: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - Invalid or missing user ID" }, { status: 401 })
    }

    const { id } = await params
    const productId = String(id).trim()
    
    if (!isValidObjectId(productId)) {
      return NextResponse.json({ error: "Invalid product ID format" }, { status: 400 })
    }

    const { rating, content, orderId } = await request.json()

    // Validate required fields
    if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: "Review content is required" }, { status: 400 })
    }

    // Check if product exists
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    // Check if user has already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId,
        userId,
      },
    })

    if (existingReview) {
      return NextResponse.json({ error: "You have already reviewed this product" }, { status: 400 })
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        productId,
        userId,
        rating,
        content: content.trim(),
        orderId: orderId && isValidObjectId(String(orderId)) ? orderId : null,
      },
      include: {
        user: {
          select: {
            fullName: true,
            avatar: true,
          },
        },
      },
    })

    // Update product rating
    const allReviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    })

    const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    const votes = allReviews.length

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: averageRating,
        votes,
      },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}


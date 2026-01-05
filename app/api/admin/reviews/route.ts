import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getUserId, isValidObjectId } from "@/lib/api-utils"

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

    const searchParams = request.nextUrl.searchParams
    const productId = searchParams.get("productId")
    const userIdFilter = searchParams.get("userId")
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")

    const where: any = {}
    if (productId && isValidObjectId(productId)) {
      where.productId = productId
    }
    if (userIdFilter && isValidObjectId(userIdFilter)) {
      where.userId = userIdFilter
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          product: {
            select: { id: true, name: true, image: true },
          },
          user: {
            select: { id: true, fullName: true, email: true, avatar: true },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.review.count({ where }),
    ])

    return NextResponse.json({
      reviews,
      total,
      page,
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - Invalid or missing user ID" }, { status: 401 })
    }

    const admin = await prisma.user.findUnique({ where: { id: userId } })
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { reviewId } = await request.json()
    
    if (!reviewId || !isValidObjectId(String(reviewId))) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 })
    }

    // Get review to update product rating
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { productId: true, rating: true },
    })

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    // Delete review
    await prisma.review.delete({
      where: { id: reviewId },
    })

    // Recalculate product rating
    const remainingReviews = await prisma.review.findMany({
      where: { productId: review.productId },
      select: { rating: true },
    })

    if (remainingReviews.length > 0) {
      const averageRating = remainingReviews.reduce((sum, r) => sum + r.rating, 0) / remainingReviews.length
      await prisma.product.update({
        where: { id: review.productId },
        data: {
          rating: averageRating,
          votes: remainingReviews.length,
        },
      })
    } else {
      await prisma.product.update({
        where: { id: review.productId },
        data: {
          rating: 0,
          votes: 0,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting review:", error)
    return NextResponse.json({ error: "Failed to delete review" }, { status: 500 })
  }
}


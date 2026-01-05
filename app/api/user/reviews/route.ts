import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getUserId, isValidObjectId } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - Invalid or missing user ID" }, { status: 401 })
    }

    const reviews = await prisma.review.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            image: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching user reviews:", error)
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - Invalid or missing user ID" }, { status: 401 })
    }

    const { reviewId, rating, content } = await request.json()

    if (!reviewId || !isValidObjectId(String(reviewId))) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 })
    }

    // Check if review belongs to user
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { userId: true, productId: true, rating: true },
    })

    if (!existingReview) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    if (existingReview.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Validate rating
    if (rating && (rating < 1 || rating > 5 || !Number.isInteger(rating))) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    // Update review
    const updateData: any = {}
    if (rating !== undefined) updateData.rating = rating
    if (content !== undefined) updateData.content = content.trim()

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: updateData,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        user: {
          select: {
            fullName: true,
            avatar: true,
          },
        },
      },
    })

    // Recalculate product rating if rating changed
    if (rating !== undefined && rating !== existingReview.rating) {
      const allReviews = await prisma.review.findMany({
        where: { productId: existingReview.productId },
        select: { rating: true },
      })

      const averageRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
      await prisma.product.update({
        where: { id: existingReview.productId },
        data: {
          rating: averageRating,
          votes: allReviews.length,
        },
      })
    }

    return NextResponse.json(updatedReview)
  } catch (error) {
    console.error("Error updating review:", error)
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - Invalid or missing user ID" }, { status: 401 })
    }

    const { reviewId } = await request.json()

    if (!reviewId || !isValidObjectId(String(reviewId))) {
      return NextResponse.json({ error: "Invalid review ID" }, { status: 400 })
    }

    // Check if review belongs to user
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { userId: true, productId: true },
    })

    if (!review) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 })
    }

    if (review.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
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


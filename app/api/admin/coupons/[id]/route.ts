import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getUserId, isValidObjectId } from "@/lib/api-utils"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - Invalid or missing user ID" }, { status: 401 })
    }

    const admin = await prisma.user.findUnique({ where: { id: userId } })
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    const couponId = String(id).trim()

    if (!isValidObjectId(couponId)) {
      return NextResponse.json({ error: "Invalid coupon ID format" }, { status: 400 })
    }

    const {
      name,
      description,
      type,
      value,
      minOrderValue,
      maxDiscount,
      usageLimit,
      status,
      startDate,
      endDate,
    } = await request.json()

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (type !== undefined) updateData.type = type
    if (value !== undefined) updateData.value = value
    if (minOrderValue !== undefined) updateData.minOrderValue = minOrderValue || null
    if (maxDiscount !== undefined) updateData.maxDiscount = maxDiscount || null
    if (usageLimit !== undefined) updateData.usageLimit = usageLimit || null
    if (status !== undefined) updateData.status = status
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null

    // Validate type and value
    if (type && !["PERCENTAGE", "FIXED"].includes(type)) {
      return NextResponse.json({ error: "Invalid coupon type" }, { status: 400 })
    }

    if (value !== undefined) {
      const finalType = type || (await prisma.coupon.findUnique({ where: { id: couponId }, select: { type: true } }))?.type
      if (finalType === "PERCENTAGE" && (value < 0 || value > 100)) {
        return NextResponse.json({ error: "Percentage value must be between 0 and 100" }, { status: 400 })
      }
      if (finalType === "FIXED" && value <= 0) {
        return NextResponse.json({ error: "Fixed value must be greater than 0" }, { status: 400 })
      }
    }

    const coupon = await prisma.coupon.update({
      where: { id: couponId },
      data: updateData,
    })

    return NextResponse.json(coupon)
  } catch (error: any) {
    console.error("Error updating coupon:", error)
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - Invalid or missing user ID" }, { status: 401 })
    }

    const admin = await prisma.user.findUnique({ where: { id: userId } })
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { id } = await params
    const couponId = String(id).trim()

    if (!isValidObjectId(couponId)) {
      return NextResponse.json({ error: "Invalid coupon ID format" }, { status: 400 })
    }

    await prisma.coupon.delete({
      where: { id: couponId },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting coupon:", error)
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 })
  }
}


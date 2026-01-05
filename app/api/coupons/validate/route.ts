import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getUserId } from "@/lib/api-utils"

export async function POST(request: NextRequest) {
  try {
    const { code, totalAmount } = await request.json()

    if (!code || typeof code !== 'string') {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 })
    }

    if (!totalAmount || typeof totalAmount !== 'number' || totalAmount <= 0) {
      return NextResponse.json({ error: "Valid total amount is required" }, { status: 400 })
    }

    // Find coupon by code
    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase().trim() },
    })

    if (!coupon) {
      return NextResponse.json({ error: "Mã giảm giá không tồn tại" }, { status: 404 })
    }

    // Check status
    if (coupon.status !== "ACTIVE") {
      return NextResponse.json({ error: "Mã giảm giá không còn hiệu lực" }, { status: 400 })
    }

    // Check date validity
    const now = new Date()
    if (coupon.startDate && now < coupon.startDate) {
      return NextResponse.json({ error: "Mã giảm giá chưa có hiệu lực" }, { status: 400 })
    }
    if (coupon.endDate && now > coupon.endDate) {
      return NextResponse.json({ error: "Mã giảm giá đã hết hạn" }, { status: 400 })
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "Mã giảm giá đã hết lượt sử dụng" }, { status: 400 })
    }

    // Check minimum order value
    if (coupon.minOrderValue && totalAmount < coupon.minOrderValue) {
      return NextResponse.json({ 
        error: `Đơn hàng tối thiểu ${coupon.minOrderValue.toLocaleString()}₫ để sử dụng mã này` 
      }, { status: 400 })
    }

    // Calculate discount
    let discount = 0
    if (coupon.type === "PERCENTAGE") {
      discount = (totalAmount * coupon.value) / 100
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount
      }
    } else if (coupon.type === "FIXED") {
      discount = coupon.value
      if (discount > totalAmount) {
        discount = totalAmount
      }
    }

    return NextResponse.json({
      valid: true,
      coupon: {
        id: coupon.id,
        code: coupon.code,
        name: coupon.name,
        description: coupon.description,
        type: coupon.type,
        value: coupon.value,
        discount: Math.floor(discount),
      },
    })
  } catch (error) {
    console.error("Error validating coupon:", error)
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 })
  }
}


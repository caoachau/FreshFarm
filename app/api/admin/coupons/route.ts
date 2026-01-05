import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getUserId, isValidObjectId } from "@/lib/api-utils"

export async function GET(request: NextRequest) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - Invalid or missing user ID" }, { status: 401 })
    }

    const admin = await prisma.user.findUnique({ where: { id: userId } })
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(coupons)
  } catch (error) {
    console.error("Error fetching coupons:", error)
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - Invalid or missing user ID" }, { status: 401 })
    }

    const admin = await prisma.user.findUnique({ where: { id: userId } })
    if (!admin || admin.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const {
      code,
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

    // Validate required fields (value can be 0 for PERCENTAGE, so check for null/undefined)
    if (!code || !name || !type || value === undefined || value === null) {
      return NextResponse.json({ error: "Vui lòng điền đầy đủ: Mã, Tên, Loại và Giá trị" }, { status: 400 })
    }

    if (!["PERCENTAGE", "FIXED"].includes(type)) {
      return NextResponse.json({ error: "Loại mã giảm giá không hợp lệ" }, { status: 400 })
    }

    if (type === "PERCENTAGE" && (value < 0 || value > 100)) {
      return NextResponse.json({ error: "Giá trị phần trăm phải từ 0 đến 100" }, { status: 400 })
    }

    if (type === "FIXED" && value <= 0) {
      return NextResponse.json({ error: "Giá trị số tiền phải lớn hơn 0" }, { status: 400 })
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        name,
        description: description || null,
        type,
        value: Number(value),
        minOrderValue: minOrderValue && minOrderValue > 0 ? Number(minOrderValue) : null,
        maxDiscount: maxDiscount && maxDiscount > 0 ? Number(maxDiscount) : null,
        usageLimit: usageLimit && usageLimit > 0 ? Number(usageLimit) : null,
        status: status || "ACTIVE",
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
    })

    return NextResponse.json(coupon, { status: 201 })
  } catch (error: any) {
    console.error("Error creating coupon:", error)
    console.error("Error details:", JSON.stringify(error, null, 2))
    
    if (error.code === "P2002") {
      return NextResponse.json({ error: "Mã giảm giá đã tồn tại" }, { status: 400 })
    }
    
    // Check if it's a Prisma schema error (model doesn't exist)
    if (error.message?.includes("coupon") || error.message?.includes("Coupon")) {
      return NextResponse.json({ 
        error: "Model Coupon chưa được tạo trong database. Vui lòng chạy: npm run db:push" 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      error: error.message || "Failed to create coupon",
      details: process.env.NODE_ENV === "development" ? error.message : undefined
    }, { status: 500 })
  }
}


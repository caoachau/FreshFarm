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

    const warnings = await prisma.productWarning.findMany({
      include: {
        product: {
          select: { id: true, name: true },
        },
        seller: {
          select: { id: true, fullName: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json(warnings)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch warnings" }, { status: 500 })
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

    const { productId, sellerId, message, severity } = await request.json()
    
    // Validate required fields
    if (!productId || !isValidObjectId(String(productId))) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 })
    }
    
    if (!sellerId || !isValidObjectId(String(sellerId))) {
      return NextResponse.json({ error: "Invalid seller ID" }, { status: 400 })
    }
    
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const warning = await prisma.productWarning.create({
      data: {
        productId,
        sellerId,
        message,
        severity: severity || "warning",
      },
    })

    return NextResponse.json(warning)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create warning" }, { status: 500 })
  }
}


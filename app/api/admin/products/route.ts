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
    const status = searchParams.get("status")

    const where: any = {}
    if (status) {
      where.status = status
    }

    const [products, pendingCount, approvedCount, rejectedCount, totalCount] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          seller: {
            select: { id: true, fullName: true, email: true },
          },
          category: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where: { status: "PENDING" } }),
      prisma.product.count({ where: { status: "APPROVED" } }),
      prisma.product.count({ where: { status: "REJECTED" } }),
      prisma.product.count(),
    ])

    return NextResponse.json({
      products,
      pendingCount,
      approvedCount,
      rejectedCount,
      totalCount,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
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

    const data = await request.json()

    // Validate required fields
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      return NextResponse.json({ error: "Tên sản phẩm là bắt buộc" }, { status: 400 })
    }
    
    if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
      return NextResponse.json({ error: "Mô tả sản phẩm là bắt buộc" }, { status: 400 })
    }
    
    if (!data.price || typeof data.price !== 'number' || data.price <= 0) {
      return NextResponse.json({ error: "Giá sản phẩm phải lớn hơn 0" }, { status: 400 })
    }
    
    if (!data.categoryId || !isValidObjectId(String(data.categoryId))) {
      return NextResponse.json({ error: "Danh mục không hợp lệ" }, { status: 400 })
    }

    // Verify category exists
    const category = await prisma.category.findUnique({ where: { id: data.categoryId } })
    if (!category) {
      return NextResponse.json({ error: "Danh mục không tồn tại" }, { status: 404 })
    }

    const product = await prisma.product.create({
      data: {
        name: data.name.trim(),
        description: data.description.trim(),
        price: data.price,
        originalPrice: data.originalPrice || null,
        discount: data.discount || 0,
        image: data.image || "",
        images: data.images || [],
        stock: data.stock || 100,
        categoryId: data.categoryId,
        sellerId: data.sellerId && isValidObjectId(String(data.sellerId)) ? data.sellerId : null,
        status: data.status || "APPROVED", // Admin tạo sản phẩm mặc định là APPROVED
        variety: data.variety || null,
        season: data.season || null,
        certification: data.certification || null,
      },
      include: {
        category: true,
        seller: {
          select: { id: true, fullName: true, email: true },
        },
      },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error: any) {
    console.error("Error creating product:", error)
    return NextResponse.json({ 
      error: error.message || "Không thể tạo sản phẩm" 
    }, { status: 500 })
  }
}


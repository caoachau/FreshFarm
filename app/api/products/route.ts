import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get("category")
    const search = searchParams.get("search")
    const sort = searchParams.get("sort") || "newest"
    const page = Number.parseInt(searchParams.get("page") || "1")

    // Cho phép client truyền limit, mặc định 12
    const limitParam = Number.parseInt(searchParams.get("limit") || "12")
    const limit = Number.isNaN(limitParam) || limitParam <= 0 ? 12 : Math.min(limitParam, 48)

    const where: any = {}
    if (category && category !== "all") {
      where.category = { slug: category }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ]
    }

    // Bộ lọc giá & rating (nếu client gửi)
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const minRating = searchParams.get("minRating")

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) {
        where.price.gte = Number.parseInt(minPrice)
      }
      if (maxPrice) {
        where.price.lte = Number.parseInt(maxPrice)
      }
    }

    if (minRating) {
      where.rating = {
        gte: Number.parseFloat(minRating),
      }
    }

    const orderBy: any = {}
    switch (sort) {
      case "price-asc":
        orderBy.price = "asc"
        break
      case "price-desc":
        orderBy.price = "desc"
        break
      case "bestselling":
        orderBy.sold = "desc"
        break
      case "rating":
        orderBy.rating = "desc"
        break
      default:
        orderBy.createdAt = "desc"
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: { category: true },
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

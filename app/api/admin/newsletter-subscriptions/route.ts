import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getUserId } from "@/lib/api-utils"

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

    // Get all newsletter subscriptions
    const subscriptions = await prisma.newsletterSubscription.findMany({
      orderBy: { createdAt: "desc" },
    })

    return NextResponse.json({ subscriptions, total: subscriptions.length })
  } catch (error: any) {
    console.error("Error fetching newsletter subscriptions:", error)
    return NextResponse.json({ error: "Failed to fetch subscriptions" }, { status: 500 })
  }
}


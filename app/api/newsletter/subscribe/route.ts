import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Check if email already exists
    const existing = await prisma.newsletterSubscription.findUnique({
      where: { email: email.trim().toLowerCase() },
    })

    if (existing) {
      return NextResponse.json({ message: "Email đã được đăng ký trước đó" }, { status: 200 })
    }

    // Create new subscription
    await prisma.newsletterSubscription.create({
      data: {
        email: email.trim().toLowerCase(),
      },
    })

    return NextResponse.json({ message: "Đăng ký thành công! Cảm ơn bạn đã quan tâm." }, { status: 201 })
  } catch (error: any) {
    console.error("Error subscribing to newsletter:", error)
    return NextResponse.json({ error: "Có lỗi xảy ra. Vui lòng thử lại sau." }, { status: 500 })
  }
}


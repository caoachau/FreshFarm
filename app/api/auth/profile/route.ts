import { prisma } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"
import { getUserId } from "@/lib/api-utils"

export async function PATCH(request: NextRequest) {
  try {
    const userId = getUserId(request)
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized - Invalid or missing user ID" }, { status: 401 })
    }

    const { name, phone } = await request.json()

    const updateData: { fullName?: string; phone?: string } = {}
    if (name !== undefined) {
      updateData.fullName = name
    }
    if (phone !== undefined) {
      updateData.phone = phone
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
      },
    })

    return NextResponse.json({
      ...user,
      name: user.fullName,
    })
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
  }
}

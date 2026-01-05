import { authenticateUser } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Missing email or password" }, { status: 400 })
    }

    const user = await authenticateUser(email, password)
    const response = NextResponse.json(user)

    // Set user ID in header for subsequent requests
    response.headers.set("x-user-id", user.id)

    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }
}

import { registerUser } from "@/lib/auth"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json()

    if (!email || !password || !fullName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const user = await registerUser(email, password, fullName)
    const response = NextResponse.json(user)
    response.headers.set("x-user-id", user.id)
    return response
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

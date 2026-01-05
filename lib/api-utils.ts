import { type NextRequest } from "next/server"

// Helper function to validate ObjectID format (MongoDB)
export function isValidObjectId(id: string): boolean {
  return /^[0-9a-fA-F]{24}$/.test(id)
}

// Helper function to safely extract and validate user ID from request headers
export function getUserId(request: NextRequest): string | null {
  const userIdHeader = request.headers.get("x-user-id")
  
  if (!userIdHeader) {
    return null
  }

  // Ensure it's a string and trim
  const userId = String(userIdHeader).trim()
  
  // Validate format
  if (!isValidObjectId(userId)) {
    console.error("Invalid ObjectID format:", userId)
    return null
  }

  return userId
}


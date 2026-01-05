"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  fullName: string
  name?: string // Alias for fullName for compatibility
  phone?: string
  loyaltyPoints?: number
}

// Helper function to normalize token to a usable string (Mongo ObjectId or fallback)
function normalizeToken(token: any): string | null {
  if (!token) return null

  // If token is already a string, try to extract a 24-char hex id if present
  if (typeof token === "string") {
    const trimmed = token.trim()
    const match = trimmed.match(/[0-9a-fA-F]{24}/)
    if (match) return match[0]
    return trimmed || null
  }

  if (typeof token === "object" && token !== null) {
    // Handle common patterns {_id}, {$oid}, or nested id
    if (token.id) return normalizeToken(token.id)
    if (token._id) return normalizeToken(token._id)
    if (token.$oid) return normalizeToken(token.$oid)
    // Fallback: stringify and attempt extraction
    return normalizeToken(JSON.stringify(token))
  }

  // Primitive fallback
  const str = String(token).trim()
  const match = str.match(/[0-9a-fA-F]{24}/)
  if (match) return match[0]
  return str || null
}

export function useAuth() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("user")
    const savedToken = localStorage.getItem("authToken")
    if (savedUser && savedToken) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
        
        // Normalize token from localStorage or user object
        const tokenString = normalizeToken(savedToken) || normalizeToken(parsedUser?.id)
        
        if (tokenString) {
          setToken(tokenString)
          // Update localStorage with normalized token
          localStorage.setItem("authToken", tokenString)
        } else {
          console.warn("[v0] Invalid token format, clearing auth")
          localStorage.removeItem("user")
          localStorage.removeItem("authToken")
          setToken(null)
          setUser(null)
        }
      } catch (error) {
        console.error("[v0] Failed to load user from localStorage:", error)
        localStorage.removeItem("user")
        localStorage.removeItem("authToken")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || "Login failed")
      }

      const userData = await response.json()
      setUser(userData)

      // Prefer server-provided header, then payload fields
      const headerToken = response.headers.get("x-user-id")
      const tokenString =
        normalizeToken(headerToken) ||
        normalizeToken(userData.id) ||
        normalizeToken(userData._id)
      if (!tokenString) {
        throw new Error("Invalid user ID format")
      }

      localStorage.setItem("user", JSON.stringify(userData))
      localStorage.setItem("authToken", tokenString)
      setToken(tokenString)

      return userData
    } catch (error) {
      console.error("[v0] Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (email: string, password: string, fullName: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Signup failed" }))
        throw new Error(errorData.error || "Signup failed")
      }

      const userData = await response.json()
      setUser(userData)

      // Prefer server-provided header, then payload fields
      const headerToken = response.headers.get("x-user-id")
      const tokenString =
        normalizeToken(headerToken) ||
        normalizeToken(userData.id) ||
        normalizeToken(userData._id)
      if (!tokenString) {
        throw new Error("Invalid user ID format")
      }
      
      localStorage.setItem("user", JSON.stringify(userData))
      localStorage.setItem("authToken", tokenString)
      setToken(tokenString)

      return userData
    } catch (error) {
      console.error("[v0] Signup error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("user")
    localStorage.removeItem("authToken")
    router.push("/")
  }

  const updateProfile = async (data: { name?: string; phone?: string }) => {
    if (!token) return

    // Normalize token before sending
    const tokenString = normalizeToken(token)
    if (!tokenString) {
      console.error("[v0] Invalid token format for updateProfile")
      return
    }

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": tokenString,
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        setUser(updatedUser)
        localStorage.setItem("user", JSON.stringify(updatedUser))
      }
    } catch (error) {
      console.error("[v0] Error updating profile:", error)
    }
  }

  return {
    user: user ? { ...user, name: user.fullName } : null,
    isLoading,
    isAuthenticated: !!user,
    token,
    login,
    signup,
    logout,
    updateProfile,
  }
}

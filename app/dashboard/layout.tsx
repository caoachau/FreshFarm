"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import DashboardSidebar from "@/components/dashboard/sidebar"

type UserRole = "ADMIN" | "SELLER" | "BUYER"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { user, token, isLoading, isAuthenticated } = useAuth()
  const [userRole, setUserRole] = useState<UserRole | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth/login")
      return
    }

    if (user && token) {
      // Fetch user role từ API với x-user-id
      fetch("/api/auth/me", {
        headers: {
          "x-user-id": token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.role) {
            setUserRole(data.role as UserRole)
          } else {
            setUserRole("BUYER")
          }
        })
        .catch(() => {
          setUserRole("BUYER")
        })
    }
  }, [user, token, isLoading, isAuthenticated, router])

  if (isLoading || !userRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-neutral-50">
      <DashboardSidebar role={userRole} />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}


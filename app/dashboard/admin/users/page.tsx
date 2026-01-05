"use client"

import { useState } from "react"
import { Search, Ban, CheckCircle, UserX } from "lucide-react"
import useSWR from "swr"
import { authenticatedFetcher } from "@/lib/fetcher"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export default function AdminUsersPage() {
  const { token, isAuthenticated } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const { data: users, mutate } = useSWR(
    isAuthenticated && token ? ["/api/admin/users", token] : null,
    ([url, token]) => authenticatedFetcher(url, token)
  )

  const handleBanUser = async (userId: string, status: string) => {
    const action = status === "BANNED" ? "khóa" : "mở khóa"
    if (!confirm(`Bạn có chắc muốn ${action} người dùng này?`)) return

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": token || "",
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        alert(`Đã ${action} người dùng thành công`)
        mutate()
      } else {
        const error = await response.json()
        alert(error.error || `Không thể ${action} người dùng`)
      }
    } catch (error) {
      console.error("Error updating user:", error)
      alert("Có lỗi xảy ra khi cập nhật người dùng")
    }
  }

  const filteredUsers = users?.filter((user: any) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Quản Lý Người Dùng</h1>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-4 border border-border mb-6">
        <div className="flex items-center gap-2">
          <Search size={20} className="text-neutral-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo email hoặc tên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700">Người Dùng</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700">Vai Trò</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700">Trạng Thái</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700">Ngày Tạo</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredUsers.map((user: any) => (
              <tr key={user.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">{user.fullName}</p>
                    <p className="text-sm text-neutral-600">{user.email}</p>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.role === "ADMIN" ? "bg-purple-100 text-purple-700" :
                    user.role === "SELLER" ? "bg-blue-100 text-blue-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {user.role === "ADMIN" ? "Admin" :
                     user.role === "SELLER" ? "Người Bán" :
                     "Người Mua"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.status === "ACTIVE" ? "bg-green-100 text-green-700" :
                    user.status === "BANNED" ? "bg-red-100 text-red-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>
                    {user.status === "ACTIVE" ? "Hoạt Động" :
                     user.status === "BANNED" ? "Đã Khóa" :
                     "Tạm Khóa"}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-600">
                  {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {user.status === "ACTIVE" ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBanUser(user.id, "BANNED")}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Ban size={16} className="mr-1" />
                        Khóa
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleBanUser(user.id, "ACTIVE")}
                        className="text-green-600 hover:text-green-700"
                      >
                        <CheckCircle size={16} className="mr-1" />
                        Mở Khóa
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}


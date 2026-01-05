"use client"

import { useState } from "react"
import { Search, Calendar, CheckCircle, XCircle, Package, User } from "lucide-react"
import useSWR from "swr"
import { authenticatedFetcher } from "@/lib/fetcher"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

const statusConfig: Record<string, { label: string; color: string }> = {
  ACTIVE: { label: "Đang Hoạt Động", color: "bg-green-100 text-green-700" },
  PAUSED: { label: "Tạm Dừng", color: "bg-yellow-100 text-yellow-700" },
  CANCELLED: { label: "Đã Hủy", color: "bg-red-100 text-red-700" },
  COMPLETED: { label: "Hoàn Thành", color: "bg-blue-100 text-blue-700" },
}

export default function AdminRecurringOrdersPage() {
  const { token, isAuthenticated } = useAuth()
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const { data, mutate } = useSWR(
    isAuthenticated && token
      ? [`/api/admin/recurring-orders?status=${statusFilter}&page=${page}&limit=20`, token]
      : null,
    ([url, token]) => authenticatedFetcher(url, token)
  )

  const handleMarkDelivered = async (itemId: string) => {
    if (!confirm("Đánh dấu sản phẩm này đã được giao?")) return

    try {
      const tokenString = String(token || "").trim()
      const response = await fetch(`/api/recurring-orders/items/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": tokenString,
        },
        body: JSON.stringify({ isDelivered: true }),
      })

      if (response.ok) {
        mutate()
        alert("Đã đánh dấu giao hàng thành công")
      } else {
        const error = await response.json()
        alert(error.error || "Không thể cập nhật")
      }
    } catch (error) {
      console.error("Error marking delivered:", error)
      alert("Có lỗi xảy ra")
    }
  }

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    if (!confirm(`Cập nhật trạng thái đơn hàng thành "${statusConfig[newStatus]?.label}"?`)) return

    try {
      const tokenString = String(token || "").trim()
      const response = await fetch(`/api/recurring-orders/${orderId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": tokenString,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        mutate()
        alert("Đã cập nhật trạng thái thành công")
      } else {
        const error = await response.json()
        alert(error.error || "Không thể cập nhật")
      }
    } catch (error) {
      console.error("Error updating status:", error)
      alert("Có lỗi xảy ra")
    }
  }

  const filteredOrders = data?.recurringOrders?.filter((order: any) => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      order.id.toLowerCase().includes(search) ||
      order.user?.email?.toLowerCase().includes(search) ||
      order.user?.fullName?.toLowerCase().includes(search) ||
      order.phone?.toLowerCase().includes(search)
    )
  }) || []

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Quản Lý Đơn Hàng Giao Định Kỳ</h1>
        <div className="text-sm text-neutral-600">
          Tổng: {data?.total || 0} đơn hàng
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 border border-border mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2">
            <Search size={20} className="text-neutral-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo mã đơn, email, tên hoặc số điện thoại..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 outline-none"
            />
          </div>
          <div className="flex gap-2">
            {["all", "ACTIVE", "PAUSED", "CANCELLED", "COMPLETED"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  statusFilter === status
                    ? "bg-primary text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
              >
                {status === "all" ? "Tất Cả" : statusConfig[status]?.label || status}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.map((order: any) => (
          <div key={order.id} className="bg-white rounded-lg p-6 border border-border">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <Package className="text-primary" size={24} />
                  <p className="font-bold text-lg">Đơn #{order.id.slice(-8)}</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      statusConfig[order.status]?.color || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {statusConfig[order.status]?.label || order.status}
                  </span>
                </div>
                <div className="text-sm text-neutral-600 space-y-1">
                  <p>
                    <User size={14} className="inline mr-1" />
                    Khách hàng: <strong>{order.user?.fullName}</strong> ({order.user?.email})
                  </p>
                  <p>Điện thoại: {order.phone}</p>
                  <p>Địa chỉ: {order.shippingAddress}</p>
                  <p>Ngày tạo: {new Date(order.createdAt).toLocaleString("vi-VN")}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {order.status === "ACTIVE" && (
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(order.id, "PAUSED")}
                      className="text-yellow-600"
                    >
                      Tạm Dừng
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateStatus(order.id, "CANCELLED")}
                      className="text-red-600"
                    >
                      Hủy
                    </Button>
                  </>
                )}
                {order.status === "PAUSED" && (
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(order.id, "ACTIVE")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Kích Hoạt
                  </Button>
                )}
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t border-border pt-4">
              <h4 className="font-bold mb-3">Sản phẩm và lịch giao:</h4>
              <div className="space-y-3">
                {order.items?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <img
                        src={item.product?.image || "/placeholder.svg"}
                        alt={item.product?.name}
                        className="w-16 h-16 rounded object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.product?.name || "Sản phẩm đã bị xóa"}</p>
                        <p className="text-sm text-neutral-600">
                          Số lượng: {item.quantity} x {item.price.toLocaleString()}₫
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar size={14} className="text-primary" />
                          <span className="text-sm font-medium">
                            Giao ngày: {new Date(item.deliveryDate).toLocaleDateString("vi-VN")}
                          </span>
                          {item.isDelivered && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                              Đã giao
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-bold">{(item.quantity * item.price).toLocaleString()}₫</p>
                      </div>
                      {!item.isDelivered && new Date(item.deliveryDate) <= new Date() && (
                        <Button
                          size="sm"
                          onClick={() => handleMarkDelivered(item.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle size={16} className="mr-1" />
                          Đánh Dấu Đã Giao
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-neutral-600 bg-white rounded-lg border border-border">
            {searchTerm ? "Không tìm thấy đơn hàng nào" : "Chưa có đơn hàng định kỳ nào"}
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Trước
          </Button>
          <span className="px-4 py-2">
            Trang {page} / {data.pages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
            disabled={page === data.pages}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  )
}


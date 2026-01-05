"use client"

import { useState } from "react"
import { Search, Eye, CheckCircle, XCircle, Package, Truck } from "lucide-react"
import { authenticatedFetcher } from "@/lib/fetcher"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import useSWR from "swr"

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Chờ Xác Nhận", color: "bg-gray-100 text-gray-700" },
  CONFIRMED: { label: "Đã Xác Nhận", color: "bg-blue-100 text-blue-700" },
  PROCESSING: { label: "Đang Xử Lý", color: "bg-yellow-100 text-yellow-700" },
  SHIPPING: { label: "Đang Giao", color: "bg-purple-100 text-purple-700" },
  DELIVERED: { label: "Đã Giao", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Đã Hủy", color: "bg-red-100 text-red-700" },
  REJECTED: { label: "Bị Từ Chối", color: "bg-red-100 text-red-700" },
}

export default function AdminOrdersPage() {
  const { token, isAuthenticated } = useAuth()
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const { data, mutate } = useSWR(
    isAuthenticated && token
      ? [`/api/admin/orders?status=${statusFilter}&page=${page}&limit=20`, token]
      : null,
    ([url, token]) => authenticatedFetcher(url, token)
  )

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    if (!confirm(`Bạn có chắc muốn cập nhật trạng thái đơn hàng thành "${statusConfig[newStatus]?.label}"?`)) {
      return
    }

    try {
      const tokenString = String(token || "").trim()
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": tokenString,
        },
        body: JSON.stringify({ orderId, status: newStatus }),
      })

      if (response.ok) {
        // Tự động chuyển tab filter theo status mới
        if (newStatus !== statusFilter && statusFilter !== "all") {
          setStatusFilter(newStatus)
        }
        mutate()
        alert("Đã cập nhật trạng thái đơn hàng thành công")
      } else {
        const error = await response.json()
        alert(error.error || "Không thể cập nhật trạng thái")
      }
    } catch (error) {
      console.error("Error updating order:", error)
      alert("Có lỗi xảy ra khi cập nhật trạng thái")
    }
  }

  const filteredOrders = data?.orders?.filter((order: any) => {
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
        <h1 className="text-3xl font-bold">Quản Lý Đơn Hàng</h1>
        <div className="text-sm text-neutral-600">
          Tổng: {data?.total || 0} đơn hàng
        </div>
      </div>

      {/* Stats */}
      {data?.stats && (
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4 mb-6">
          <div className="bg-white rounded-lg p-4 border border-border text-center">
            <p className="text-2xl font-bold">{data.stats.total}</p>
            <p className="text-xs text-neutral-600">Tổng</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-border text-center">
            <p className="text-2xl font-bold text-gray-600">{data.stats.pending}</p>
            <p className="text-xs text-neutral-600">Chờ Xác Nhận</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-border text-center">
            <p className="text-2xl font-bold text-blue-600">{data.stats.confirmed}</p>
            <p className="text-xs text-neutral-600">Đã Xác Nhận</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-border text-center">
            <p className="text-2xl font-bold text-yellow-600">{data.stats.processing || 0}</p>
            <p className="text-xs text-neutral-600">Đang Xử Lý</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-border text-center">
            <p className="text-2xl font-bold text-purple-600">{data.stats.shipping}</p>
            <p className="text-xs text-neutral-600">Đang Giao</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-border text-center">
            <p className="text-2xl font-bold text-green-600">{data.stats.delivered}</p>
            <p className="text-xs text-neutral-600">Đã Giao</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-border text-center">
            <p className="text-2xl font-bold text-red-600">{data.stats.cancelled}</p>
            <p className="text-xs text-neutral-600">Đã Hủy</p>
          </div>
        </div>
      )}

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
            {["all", "PENDING", "CONFIRMED", "PROCESSING", "SHIPPING", "DELIVERED", "CANCELLED"].map((status) => (
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
      <div className="space-y-4">
        {filteredOrders.map((order: any) => (
          <div key={order.id} className="bg-white rounded-lg p-6 border border-border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-4 mb-2">
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
                  <p>Khách hàng: <strong>{order.user?.fullName}</strong> ({order.user?.email})</p>
                  <p>Điện thoại: {order.phone}</p>
                  <p>Địa chỉ: {order.shippingAddress}</p>
                  <p>Ngày đặt: {new Date(order.createdAt).toLocaleString("vi-VN")}</p>
                  {order.seller && (
                    <p>Người bán: {order.seller.fullName} ({order.seller.email})</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary mb-2">
                  {order.totalAmount.toLocaleString()}₫
                </p>
                <p className="text-sm text-neutral-600">
                  Phí ship: {order.shippingFee.toLocaleString()}₫
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t border-border pt-4 mb-4">
              <h4 className="font-bold mb-2">Sản phẩm:</h4>
              <div className="space-y-2">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product?.image || "/placeholder.svg"}
                        alt={item.product?.name}
                        className="w-12 h-12 rounded object-cover"
                      />
                      <div>
                        <p className="font-medium">{item.product?.name || "Sản phẩm đã bị xóa"}</p>
                        <p className="text-neutral-600">x{item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-bold">{(item.price * item.quantity).toLocaleString()}₫</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
              {order.status === "PENDING" && (
                <>
                  <Button
                    size="sm"
                    onClick={() => handleUpdateStatus(order.id, "CONFIRMED")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle size={16} className="mr-1" />
                    Xác Nhận
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleUpdateStatus(order.id, "CANCELLED")}
                    className="text-red-600"
                  >
                    <XCircle size={16} className="mr-1" />
                    Hủy Đơn
                  </Button>
                </>
              )}
              {order.status === "CONFIRMED" && (
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus(order.id, "PROCESSING")}
                  className="bg-yellow-600 hover:bg-yellow-700"
                >
                  <Package size={16} className="mr-1" />
                  Bắt Đầu Xử Lý
                </Button>
              )}
              {order.status === "PROCESSING" && (
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus(order.id, "SHIPPING")}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Truck size={16} className="mr-1" />
                  Giao Hàng
                </Button>
              )}
              {order.status === "SHIPPING" && (
                <Button
                  size="sm"
                  onClick={() => handleUpdateStatus(order.id, "DELIVERED")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle size={16} className="mr-1" />
                  Hoàn Thành
                </Button>
              )}
            </div>
          </div>
        ))}

        {filteredOrders.length === 0 && (
          <div className="text-center py-12 text-neutral-600">
            {searchTerm ? "Không tìm thấy đơn hàng nào" : "Chưa có đơn hàng nào"}
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


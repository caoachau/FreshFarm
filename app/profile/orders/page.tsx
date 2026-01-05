"use client"

import Link from "next/link"
import useSWR from "swr"
import { Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { fetcher } from "@/lib/fetcher"

const statusMap: Record<
  string,
  { label: string; color: string }
> = {
  PENDING: { label: "Đang xử lý", color: "bg-blue-50 text-blue-700 border-blue-200" },
  CONFIRMED: { label: "Đã xác nhận", color: "bg-blue-50 text-blue-700 border-blue-200" },
  PROCESSING: { label: "Đang chuẩn bị", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  SHIPPING: { label: "Đang giao", color: "bg-purple-50 text-purple-700 border-purple-200" },
  DELIVERED: { label: "Đã giao", color: "bg-green-50 text-green-700 border-green-200" },
  CANCELLED: { label: "Đã hủy", color: "bg-red-50 text-red-700 border-red-200" },
  REJECTED: { label: "Từ chối", color: "bg-red-50 text-red-700 border-red-200" },
}

export default function OrdersPage() {
  const { isAuthenticated } = useAuth()
  const { data: orders, isLoading } = useSWR(isAuthenticated ? "/api/orders" : null, fetcher)

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h1>
        <Link href="/auth/login">
          <Button className="bg-primary hover:bg-primary-dark text-white">Đăng Nhập</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Lịch Sử Đơn Hàng</h1>

      {!orders || orders.length === 0 ? (
        <div className="text-center py-12 bg-neutral-50 rounded-lg">
          <p className="text-neutral-600">
            {isLoading ? "Đang tải đơn hàng..." : "Bạn chưa có đơn hàng nào"}
          </p>
          <Link href="/products" className="text-primary hover:text-primary-dark mt-2 inline-block">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <div
              key={order.id}
              className="bg-white border border-border rounded-lg p-6 hover:shadow-md transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                {/* Order ID */}
                <div>
                  <p className="text-sm text-neutral-600">Mã Đơn</p>
                  <p className="font-bold">#{order.id.slice(-8)}</p>
                </div>

                {/* Date */}
                <div>
                  <p className="text-sm text-neutral-600">Ngày Đặt</p>
                  <p className="font-bold">
                    {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <p className="text-sm text-neutral-600 mb-1">Trạng Thái</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      statusMap[order.status]?.color || "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                  >
                    {statusMap[order.status]?.label || order.status}
                  </span>
                </div>

                {/* Total */}
                <div>
                  <p className="text-sm text-neutral-600">Tổng Cộng</p>
                  <p className="font-bold text-primary">
                    {order.totalAmount.toLocaleString()}₫
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button className="flex items-center gap-1 px-3 py-2 bg-primary hover:bg-primary-dark text-white rounded transition text-sm font-medium">
                    <Eye size={16} /> Chi Tiết
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

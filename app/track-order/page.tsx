"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search, Package, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

type ApiOrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPING"
  | "DELIVERED"
  | "CANCELLED"
  | "REJECTED"

const statusConfig: Record<
  ApiOrderStatus,
  { label: string; color: string }
> = {
  PENDING: { label: "Chờ Xác Nhận", color: "bg-gray-100 text-gray-700" },
  CONFIRMED: { label: "Đã Xác Nhận", color: "bg-blue-100 text-blue-700" },
  PROCESSING: { label: "Đang Xử Lý", color: "bg-yellow-100 text-yellow-700" },
  SHIPPING: { label: "Đang Giao", color: "bg-purple-100 text-purple-700" },
  DELIVERED: { label: "Đã Giao", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Đã Hủy", color: "bg-red-100 text-red-700" },
  REJECTED: { label: "Bị Từ Chối", color: "bg-red-100 text-red-700" },
}

export default function TrackOrderPage() {
  const searchParams = useSearchParams()
  const [searchPhone, setSearchPhone] = useState("")
  const [orders, setOrders] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    if (!searchPhone.trim()) return
    setIsSearching(true)
    setError(null)

    try {
      const res = await fetch(`/api/track-order?phone=${encodeURIComponent(searchPhone.trim())}`)
      const data = await res.json()
      if (!data.found || !data.orders || data.orders.length === 0) {
        setOrders([])
        setError("Không tìm thấy đơn hàng nào với số điện thoại này.")
      } else {
        setOrders(data.orders)
      }
    } catch (err) {
      console.error("Error tracking order:", err)
      setError("Không thể tra cứu đơn hàng, vui lòng thử lại.")
      setOrders([])
    } finally {
      setIsSearching(false)
    }
  }

  // Tự động tìm kiếm khi có query ?phone= trên URL
  useEffect(() => {
    const phone = searchParams.get("phone")
    if (phone) {
      setSearchPhone(phone)
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      handleSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2 text-center">Theo Dõi Đơn Hàng</h1>
      <p className="text-neutral-600 text-center mb-8">
        Nhập số điện thoại đã dùng khi đặt hàng để xem trạng thái đơn gần nhất
      </p>

      {/* Search section */}
      <div className="bg-white border border-border rounded-lg p-6 mb-8">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-3 text-neutral-400" />
            <input
              type="text"
              placeholder="Nhập số điện thoại đã đặt hàng"
              value={searchPhone}
              onChange={(e) => setSearchPhone(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              className="w-full pl-10 pr-4 py-3 border border-border rounded-lg outline-none focus:border-primary transition"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-primary hover:bg-primary-dark text-white px-6 font-bold"
          >
            {isSearching ? "Tìm kiếm..." : "Tìm Kiếm"}
          </Button>
        </div>
        <p className="text-xs text-neutral-500 mt-2">Mã đơn hàng được gửi qua email hoặc SMS sau khi đặt hàng</p>
      </div>

      {/* Error & empty state */}
      {error && (
        <div className="text-center py-4 text-red-600">
          {error}
        </div>
      )}

      {orders.length === 0 && !isSearching && !error && (
        <div className="text-center py-12 bg-neutral-50 rounded-lg">
          <Package size={64} className="mx-auto text-neutral-300 mb-4" />
          <p className="text-neutral-600">
            Chưa có kết quả. Hãy nhập số điện thoại để tìm kiếm đơn hàng.
          </p>
        </div>
      )}

      {/* Tracking info - Show all orders */}
      {orders.length > 0 && (
        <div className="space-y-6">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <p className="font-bold text-primary">
              Tìm thấy {orders.length} đơn hàng với số điện thoại này
            </p>
          </div>

          {orders.map((order) => (
            <div key={order.id} className="space-y-4">
          {/* Order header */}
          <div className="bg-white border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-neutral-600">Mã Đơn Hàng</p>
                    <p className="text-2xl font-bold">{order.id.slice(-8)}</p>
                <p className="text-sm text-neutral-600 mt-1">
                  Đặt lúc: {new Date(order.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>
              <div
                className={`px-4 py-2 rounded-lg font-bold text-sm ${
                  statusConfig[order.status as ApiOrderStatus]?.color || "bg-gray-100 text-gray-700"
                }`}
              >
                {statusConfig[order.status as ApiOrderStatus]?.label || order.status}
              </div>
            </div>
          </div>

          {/* Order items */}
          <div className="bg-white border border-border rounded-lg p-6">
            <h2 className="font-bold text-lg mb-4">Sản Phẩm Trong Đơn</h2>
            <div className="space-y-3">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.product?.name || "Sản phẩm"}</p>
                    <p className="text-sm text-neutral-600">
                      {item.quantity} x {item.price.toLocaleString()}₫
                    </p>
                  </div>
                  <p className="font-bold">
                    {(item.quantity * item.price).toLocaleString()}₫
                  </p>
                </div>
              ))}
            </div>
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Tổng cộng:</span>
                    <span className="text-2xl font-bold text-primary">
                      {order.totalAmount.toLocaleString()}₫
                    </span>
                  </div>
                </div>
          </div>

          {/* Delivery estimate */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <Clock size={24} className="text-primary" />
              <div>
                <p className="font-bold">Thời Gian Giao Dự Kiến</p>
                <p className="text-neutral-700">
                  Thông thường trong vòng 2-24 giờ kể từ khi đơn được xác nhận.
                </p>
              </div>
            </div>
          </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

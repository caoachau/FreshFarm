"use client"

import { useState } from "react"
import { X, Package, Truck, CheckCircle, Eye } from "lucide-react"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function BuyerOrdersPage() {
  const { data: orders, mutate } = useSWR("/api/buyer/orders", fetcher)
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null)

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Bạn có chắc muốn hủy đơn hàng này?")) return

    setCancellingOrderId(orderId)
    try {
      const response = await fetch(`/api/buyer/orders/${orderId}/cancel`, {
        method: "PATCH",
      })

      if (response.ok) {
        mutate()
      }
    } catch (error) {
      console.error("Error cancelling order:", error)
    } finally {
      setCancellingOrderId(null)
    }
  }

  const canCancel = (status: string) => {
    // Cho phép hủy đơn hàng khi chưa giao (trừ DELIVERED và CANCELLED)
    return ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPING"].includes(status)
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      PENDING: "Chờ Xác Nhận",
      CONFIRMED: "Đã Xác Nhận",
      PROCESSING: "Đang Xử Lý",
      SHIPPING: "Đang Giao",
      DELIVERED: "Đã Giao",
      CANCELLED: "Đã Hủy",
      REJECTED: "Từ Chối",
    }
    return labels[status] || status
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return <CheckCircle className="text-green-500" size={20} />
      case "SHIPPING":
        return <Truck className="text-blue-500" size={20} />
      case "CANCELLED":
        return <X className="text-red-500" size={20} />
      default:
        return <Package className="text-orange-500" size={20} />
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Đơn Hàng Của Tôi</h1>

      <div className="space-y-6">
        {orders?.map((order: any) => (
          <div key={order.id} className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(order.status)}
                <div>
                  <p className="font-bold">Đơn hàng #{order.id.slice(-8)}</p>
                  <p className="text-sm text-neutral-600">
                    {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === "DELIVERED" ? "bg-green-100 text-green-700" :
                  order.status === "CANCELLED" ? "bg-red-100 text-red-700" :
                  order.status === "SHIPPING" ? "bg-blue-100 text-blue-700" :
                  "bg-orange-100 text-orange-700"
                }`}>
                  {getStatusLabel(order.status)}
                </span>
                {canCancel(order.status) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCancelOrder(order.id)}
                    disabled={cancellingOrderId === order.id}
                    className="text-red-600"
                  >
                    <X size={16} className="mr-1" />
                    Hủy Đơn
                  </Button>
                )}
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-2">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.product?.name || "Sản phẩm"}</p>
                    <p className="text-sm text-neutral-600">
                      Số lượng: {item.quantity} x {item.price.toLocaleString()}₫
                    </p>
                  </div>
                  <p className="font-bold">
                    {(item.quantity * item.price).toLocaleString()}₫
                  </p>
                </div>
              ))}
            </div>

            <div className="border-t border-border pt-4 mt-4 flex items-center justify-between">
              <Link href={`/dashboard/buyer/orders/${order.id}`}>
                <Button variant="outline" size="sm">
                  <Eye size={16} className="mr-1" />
                  Xem Chi Tiết
                </Button>
              </Link>
              <div className="text-right">
                <p className="text-sm text-neutral-600">Tổng cộng:</p>
                <p className="text-2xl font-bold text-primary">
                  {order.totalAmount.toLocaleString()}₫
                </p>
              </div>
            </div>
          </div>
        ))}

        {(!orders || orders.length === 0) && (
          <div className="text-center py-12 text-neutral-600">
            Bạn chưa có đơn hàng nào
          </div>
        )}
      </div>
    </div>
  )
}


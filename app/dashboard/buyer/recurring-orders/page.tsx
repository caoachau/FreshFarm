"use client"

import { useState } from "react"
import { Calendar, Plus, Trash2, Package, Clock } from "lucide-react"
import useSWR from "swr"
import { authenticatedFetcher } from "@/lib/fetcher"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export default function BuyerRecurringOrdersPage() {
  const { token, isAuthenticated } = useAuth()
  const { data: recurringOrders, mutate } = useSWR(
    isAuthenticated && token ? ["/api/recurring-orders", token] : null,
    ([url, token]) => authenticatedFetcher(url, token)
  )
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa đơn hàng định kỳ này?")) return

    setDeletingId(id)
    try {
      const tokenString = String(token || "").trim()
      const response = await fetch(`/api/recurring-orders/${id}`, {
        method: "DELETE",
        headers: {
          "x-user-id": tokenString,
        },
      })

      if (response.ok) {
        mutate()
      }
    } catch (error) {
      console.error("Error deleting recurring order:", error)
    } finally {
      setDeletingId(null)
    }
  }

  const handlePause = async (id: string) => {
    if (!confirm("Bạn có chắc muốn tạm dừng đơn hàng định kỳ này?")) return

    try {
      const tokenString = String(token || "").trim()
      const response = await fetch(`/api/recurring-orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": tokenString,
        },
        body: JSON.stringify({ status: "PAUSED" }),
      })

      if (response.ok) {
        mutate()
      }
    } catch (error) {
      console.error("Error pausing recurring order:", error)
    }
  }

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      ACTIVE: "Đang Hoạt Động",
      PAUSED: "Tạm Dừng",
      CANCELLED: "Đã Hủy",
      COMPLETED: "Hoàn Thành",
    }
    return labels[status] || status
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ACTIVE: "bg-green-100 text-green-700",
      PAUSED: "bg-yellow-100 text-yellow-700",
      CANCELLED: "bg-red-100 text-red-700",
      COMPLETED: "bg-blue-100 text-blue-700",
    }
    return colors[status] || "bg-gray-100 text-gray-700"
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Giao Hàng Định Kỳ</h1>
        <Link href="/dashboard/buyer/recurring-orders/new">
          <Button className="bg-primary hover:bg-primary-dark">
            <Plus size={20} className="mr-2" />
            Tạo Đơn Hàng Định Kỳ
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {recurringOrders?.map((order: any) => (
          <div key={order.id} className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Package className="text-primary" size={24} />
                <div>
                  <p className="font-bold">Đơn hàng định kỳ #{order.id.slice(-8)}</p>
                  <p className="text-sm text-neutral-600">
                    Tạo ngày: {new Date(order.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
                {order.status === "ACTIVE" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePause(order.id)}
                    className="text-yellow-600"
                  >
                    <Clock size={16} className="mr-1" />
                    Tạm Dừng
                  </Button>
                )}
                {order.status !== "CANCELLED" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(order.id)}
                    disabled={deletingId === order.id}
                    className="text-red-600"
                  >
                    <Trash2 size={16} className="mr-1" />
                    Xóa
                  </Button>
                )}
              </div>
            </div>

            <div className="border-t border-border pt-4 space-y-3">
              <div className="text-sm text-neutral-600">
                <p><strong>Địa chỉ giao hàng:</strong> {order.shippingAddress}</p>
                <p><strong>Số điện thoại:</strong> {order.phone}</p>
              </div>

              <div>
                <h4 className="font-bold mb-2">Sản phẩm và lịch giao:</h4>
                <div className="space-y-2">
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
                          <p className="font-medium">{item.product?.name || "Sản phẩm"}</p>
                          <p className="text-sm text-neutral-600">
                            Số lượng: {item.quantity} x {item.price.toLocaleString()}₫
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Calendar size={14} className="text-primary" />
                            <span className="text-sm font-medium text-primary">
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
                      <div className="text-right">
                        <p className="font-bold">
                          {(item.quantity * item.price).toLocaleString()}₫
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}

        {(!recurringOrders || recurringOrders.length === 0) && (
          <div className="text-center py-12 bg-white rounded-lg border border-border">
            <Package size={48} className="mx-auto text-neutral-300 mb-4" />
            <p className="text-neutral-600 mb-4">Bạn chưa có đơn hàng định kỳ nào</p>
            <Link href="/dashboard/buyer/recurring-orders/new">
              <Button className="bg-primary hover:bg-primary-dark">
                <Plus size={20} className="mr-2" />
                Tạo Đơn Hàng Định Kỳ Đầu Tiên
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}


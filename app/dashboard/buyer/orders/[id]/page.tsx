"use client"

import { useParams, useRouter } from "next/navigation"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Package, Truck, CheckCircle, X } from "lucide-react"

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const { data: order, isLoading, mutate } = useSWR(`/api/buyer/orders/${orderId}`, fetcher)

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED":
        return "bg-green-100 text-green-700"
      case "CANCELLED":
      case "REJECTED":
        return "bg-red-100 text-red-700"
      case "SHIPPING":
        return "bg-blue-100 text-blue-700"
      case "PROCESSING":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-orange-100 text-orange-700"
    }
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600">Đang tải thông tin đơn hàng...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Không tìm thấy đơn hàng</p>
        <Link href="/dashboard/buyer/orders">
          <Button variant="outline">Quay lại danh sách đơn hàng</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Quay lại
        </Button>
        <h1 className="text-3xl font-bold">Chi Tiết Đơn Hàng</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-sm text-neutral-600">Mã đơn hàng</p>
                <p className="text-xl font-bold">#{order.id.slice(-8)}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-neutral-600">Ngày đặt hàng</p>
                <p className="font-medium">{new Date(order.createdAt).toLocaleString("vi-VN")}</p>
              </div>
              <div>
                <p className="text-neutral-600">Phương thức thanh toán</p>
                <p className="font-medium">
                  {order.paymentMethod === "COD" ? "Thanh toán khi nhận hàng" : 
                   order.paymentMethod === "VIETQR" ? "VietQR" : 
                   order.paymentMethod}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-lg font-bold mb-4">Địa Chỉ Giao Hàng</h2>
            <p className="text-neutral-700">{order.shippingAddress}</p>
            <p className="text-neutral-600 mt-2">Điện thoại: {order.phone}</p>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-lg font-bold mb-4">Sản Phẩm</h2>
            <div className="space-y-4">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-0">
                  <img
                    src={item.product?.image || "/placeholder.svg"}
                    alt={item.product?.name}
                    className="w-20 h-20 rounded object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item.product?.name || "Sản phẩm đã bị xóa"}</h3>
                    <p className="text-sm text-neutral-600 mt-1">
                      Số lượng: {item.quantity} x {item.price.toLocaleString()}₫
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {(item.quantity * item.price).toLocaleString()}₫
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-border p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-4">Tóm Tắt Đơn Hàng</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-600">Tạm tính:</span>
                <span className="font-medium">
                  {(order.totalAmount - order.shippingFee + order.discount).toLocaleString()}₫
                </span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá:</span>
                  <span>-{order.discount.toLocaleString()}₫</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-600">Phí giao hàng:</span>
                <span className="font-medium">{order.shippingFee.toLocaleString()}₫</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between text-lg font-bold text-primary">
                <span>Tổng cộng:</span>
                <span>{order.totalAmount.toLocaleString()}₫</span>
              </div>
            </div>

            {order.cancelledAt && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded">
                <p className="text-sm font-medium text-red-700">Đơn hàng đã bị hủy</p>
                <p className="text-xs text-red-600 mt-1">
                  Lý do: {order.cancelledReason || "Không có lý do"}
                </p>
                <p className="text-xs text-red-600">
                  Thời gian: {new Date(order.cancelledAt).toLocaleString("vi-VN")}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


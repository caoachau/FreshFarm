"use client"

import { Package, ShoppingCart, DollarSign, TrendingUp } from "lucide-react"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"

export default function SellerDashboard() {
  const { data: stats } = useSWR("/api/seller/stats", fetcher)

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard Người Bán</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm">Tổng Sản Phẩm</p>
              <p className="text-3xl font-bold mt-2">{stats?.totalProducts || 0}</p>
            </div>
            <Package className="text-primary" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm">Đơn Chờ Xác Nhận</p>
              <p className="text-3xl font-bold mt-2">{stats?.pendingOrders || 0}</p>
            </div>
            <ShoppingCart className="text-orange-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm">Doanh Thu Tháng</p>
              <p className="text-3xl font-bold mt-2">{(stats?.monthlyRevenue || 0).toLocaleString()}₫</p>
            </div>
            <DollarSign className="text-green-500" size={32} />
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-neutral-600 text-sm">Đánh Giá Trung Bình</p>
              <p className="text-3xl font-bold mt-2">{stats?.averageRating?.toFixed(1) || "0.0"}</p>
            </div>
            <TrendingUp className="text-blue-500" size={32} />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg p-6 border border-border">
        <h2 className="text-xl font-bold mb-4">Đơn Hàng Gần Đây</h2>
        <div className="space-y-4">
          <p className="text-neutral-600">Chức năng đang được phát triển...</p>
        </div>
      </div>
    </div>
  )
}


"use client"

import { useEffect, useState } from "react"
import { Users, Package, AlertTriangle, TrendingUp, Star, DollarSign, ShoppingCart } from "lucide-react"
import useSWR from "swr"
import { authenticatedFetcher } from "@/lib/fetcher"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export default function AdminDashboard() {
  const { token, isAuthenticated } = useAuth()
  const { data: stats } = useSWR(
    isAuthenticated && token ? ["/api/admin/stats", token] : null,
    ([url, token]) => authenticatedFetcher(url, token)
  )

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Link href="/dashboard/admin/users">
          <div className="bg-white rounded-lg p-6 border border-border hover:shadow-md transition cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm">Tổng Người Dùng</p>
                <p className="text-3xl font-bold mt-2">{stats?.totalUsers || 0}</p>
                <p className="text-xs text-neutral-500 mt-1">Hoạt động: {stats?.activeUsers || 0}</p>
              </div>
              <Users className="text-primary" size={32} />
            </div>
          </div>
        </Link>

        <Link href="/dashboard/admin/products">
          <div className="bg-white rounded-lg p-6 border border-border hover:shadow-md transition cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm">Tổng Sản Phẩm</p>
                <p className="text-3xl font-bold mt-2">{stats?.totalProducts || 0}</p>
                <p className="text-xs text-orange-600 mt-1">Chờ duyệt: {stats?.pendingProducts || 0}</p>
              </div>
              <Package className="text-orange-500" size={32} />
            </div>
          </div>
        </Link>

        <Link href="/dashboard/admin/orders">
          <div className="bg-white rounded-lg p-6 border border-border hover:shadow-md transition cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm">Tổng Đơn Hàng</p>
                <p className="text-3xl font-bold mt-2">{stats?.totalOrders || 0}</p>
                <p className="text-xs text-green-600 mt-1">
                  Doanh thu: {(stats?.totalRevenue || 0).toLocaleString()}₫
                </p>
              </div>
              <ShoppingCart className="text-green-500" size={32} />
            </div>
          </div>
        </Link>

        <Link href="/dashboard/admin/reviews">
          <div className="bg-white rounded-lg p-6 border border-border hover:shadow-md transition cursor-pointer">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-neutral-600 text-sm">Tổng Đánh Giá</p>
                <p className="text-3xl font-bold mt-2">{stats?.totalReviews || 0}</p>
              </div>
              <Star className="text-yellow-500" size={32} />
            </div>
          </div>
        </Link>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Cảnh Báo</h2>
            <Link href="/dashboard/admin/warnings">
              <Button variant="outline" size="sm">Xem Tất Cả</Button>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <AlertTriangle className="text-red-500" size={48} />
            <div>
              <p className="text-4xl font-bold text-red-600">{stats?.warnings || 0}</p>
              <p className="text-sm text-neutral-600">Cảnh báo chưa đọc</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Doanh Thu</h2>
            <TrendingUp className="text-green-500" size={24} />
          </div>
          <div className="flex items-center gap-4">
            <DollarSign className="text-green-500" size={48} />
            <div>
              <p className="text-4xl font-bold text-green-600">
                {(stats?.totalRevenue || 0).toLocaleString()}₫
              </p>
              <p className="text-sm text-neutral-600">Tổng doanh thu đã giao</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 border border-border">
        <h2 className="text-xl font-bold mb-4">Thao Tác Nhanh</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/dashboard/admin/products?status=PENDING">
            <Button className="w-full" variant="outline">
              <Package size={16} className="mr-2" />
              Duyệt Sản Phẩm
            </Button>
          </Link>
          <Link href="/dashboard/admin/users">
            <Button className="w-full" variant="outline">
              <Users size={16} className="mr-2" />
              Quản Lý Người Dùng
            </Button>
          </Link>
          <Link href="/dashboard/admin/orders">
            <Button className="w-full" variant="outline">
              <ShoppingCart size={16} className="mr-2" />
              Quản Lý Đơn Hàng
            </Button>
          </Link>
          <Link href="/dashboard/admin/reviews">
            <Button className="w-full" variant="outline">
              <Star size={16} className="mr-2" />
              Quản Lý Đánh Giá
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}


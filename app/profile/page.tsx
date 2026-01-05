"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, Edit2, MapPin, Heart, History } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, updateProfile, isAuthenticated } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  })

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

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleSaveProfile = () => {
    updateProfile({
      name: formData.name,
      phone: formData.phone,
    })
    setIsEditing(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tài Khoản Của Tôi</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-border rounded-lg p-4 space-y-2">
            <a href="/profile" className="block px-4 py-2 bg-primary text-white rounded-lg font-medium">
              Thông Tin Cá Nhân
            </a>
            <a href="/profile/addresses" className="block px-4 py-2 hover:bg-neutral-100 rounded-lg transition">
              Địa Chỉ Giao Hàng
            </a>
            <a href="/profile/orders" className="block px-4 py-2 hover:bg-neutral-100 rounded-lg transition">
              Lịch Sử Đơn Hàng
            </a>
            <a href="/profile/wishlist" className="block px-4 py-2 hover:bg-neutral-100 rounded-lg transition">
              Sản Phẩm Yêu Thích
            </a>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 rounded-lg transition font-medium flex items-center gap-2"
            >
              <LogOut size={18} /> Đăng Xuất
            </button>
          </div>

          {/* Loyalty points */}
          <div className="mt-6 bg-gradient-to-br from-primary to-primary-dark text-white rounded-lg p-6">
            <p className="text-sm mb-2">Điểm tích lũy</p>
            <p className="text-4xl font-bold">{user?.loyaltyPoints || 0}</p>
            <p className="text-xs mt-2 opacity-90">Có thể dùng cho lần mua tiếp theo</p>
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile info card */}
          <div className="bg-white border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Thông Tin Cá Nhân</h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition"
                >
                  <Edit2 size={16} /> Chỉnh Sửa
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Họ và tên</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2 border border-border rounded-lg bg-neutral-100 text-neutral-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Số điện thoại</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary transition"
                  />
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleSaveProfile} className="flex-1 bg-primary hover:bg-primary-dark text-white">
                    Lưu Lại
                  </Button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 border border-border rounded-lg hover:bg-neutral-100 transition font-medium"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Họ và tên</p>
                    <p className="font-bold text-lg">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Email</p>
                    <p className="font-bold text-lg">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600 mb-1">Số điện thoại</p>
                    <p className="font-bold text-lg">{user?.phone || "Chưa cập nhật"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/profile/addresses"
              className="bg-white border border-border rounded-lg p-4 hover:shadow-md transition text-center"
            >
              <MapPin size={32} className="mx-auto mb-2 text-primary" />
              <p className="font-bold">Địa Chỉ</p>
              <p className="text-xs text-neutral-600">Quản lý địa chỉ</p>
            </Link>
            <Link
              href="/profile/orders"
              className="bg-white border border-border rounded-lg p-4 hover:shadow-md transition text-center"
            >
              <History size={32} className="mx-auto mb-2 text-primary" />
              <p className="font-bold">Đơn Hàng</p>
              <p className="text-xs text-neutral-600">Xem lịch sử</p>
            </Link>
            <Link
              href="/profile/wishlist"
              className="bg-white border border-border rounded-lg p-4 hover:shadow-md transition text-center"
            >
              <Heart size={32} className="mx-auto mb-2 text-primary" />
              <p className="font-bold">Yêu Thích</p>
              <p className="text-xs text-neutral-600">Sản phẩm yêu thích</p>
            </Link>
          </div>

          {/* Account security */}
          <div className="bg-white border border-border rounded-lg p-6">
            <h3 className="font-bold text-lg mb-4">Bảo Mật Tài Khoản</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-4 py-2 border border-border rounded-lg hover:bg-neutral-50 transition font-medium">
                Đổi Mật Khẩu
              </button>
              <button className="w-full text-left px-4 py-2 border border-border rounded-lg hover:bg-neutral-50 transition font-medium">
                Xác Thực 2 Lớp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  MessageSquare,
  Star,
  AlertTriangle,
  Settings,
  LogOut,
  Store,
  FileText,
  TrendingUp,
  Calendar,
  Ticket,
  Mail
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  role: "ADMIN" | "SELLER" | "BUYER"
}

export default function DashboardSidebar({ role }: SidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()

  const adminMenu = [
    { href: "/dashboard/admin", label: "Tổng Quan", icon: LayoutDashboard },
    { href: "/dashboard/admin/users", label: "Quản Lý Người Dùng", icon: Users },
    { href: "/dashboard/admin/products", label: "Quản Lý Sản Phẩm", icon: Package },
    { href: "/dashboard/admin/orders", label: "Quản Lý Đơn Hàng", icon: ShoppingCart },
    { href: "/dashboard/admin/recurring-orders", label: "Đơn Hàng Giao Định Kỳ", icon: Calendar },
    { href: "/dashboard/admin/coupons", label: "Quản Lý Mã Giảm Giá", icon: Ticket },
    { href: "/dashboard/admin/reviews", label: "Quản Lý Đánh Giá", icon: Star },
    { href: "/dashboard/admin/warnings", label: "Cảnh Báo", icon: AlertTriangle },
    { href: "/dashboard/admin/newsletter-subscriptions", label: "Đăng Ký Khuyến Mãi", icon: Mail },
  ]

  const sellerMenu = [
    { href: "/dashboard/seller", label: "Tổng Quan", icon: LayoutDashboard },
    { href: "/dashboard/seller/products", label: "Sản Phẩm", icon: Package },
    { href: "/dashboard/seller/orders", label: "Đơn Hàng", icon: ShoppingCart },
    { href: "/dashboard/seller/revenue", label: "Doanh Thu", icon: DollarSign },
    { href: "/dashboard/seller/reviews", label: "Đánh Giá", icon: Star },
    { href: "/dashboard/seller/messages", label: "Tin Nhắn", icon: MessageSquare },
  ]

  const buyerMenu = [
    { href: "/dashboard/buyer", label: "Tổng Quan", icon: LayoutDashboard },
    { href: "/dashboard/buyer/orders", label: "Đơn Hàng", icon: ShoppingCart },
    { href: "/dashboard/buyer/recurring-orders", label: "Giao Hàng Định Kỳ", icon: Calendar },
    { href: "/dashboard/buyer/reviews", label: "Đánh Giá Của Tôi", icon: Star },
    { href: "/dashboard/buyer/messages", label: "Tin Nhắn", icon: MessageSquare },
  ]

  const menuItems = role === "ADMIN" ? adminMenu : role === "SELLER" ? sellerMenu : buyerMenu

  return (
    <aside className="w-64 bg-white border-r border-border min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-primary">
          {role === "ADMIN" && "Admin Dashboard"}
          {role === "SELLER" && "Người Bán"}
          {role === "BUYER" && "Tài Khoản"}
        </h2>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                isActive
                  ? "bg-primary text-white"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-8 pt-8 border-t border-border">
        <Link
          href="/profile"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-neutral-700 hover:bg-neutral-100 transition"
        >
          <Settings size={20} />
          <span className="font-medium">Cài Đặt</span>
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition mt-2"
        >
          <LogOut size={20} />
          <span className="font-medium">Đăng Xuất</span>
        </button>
      </div>
    </aside>
  )
}


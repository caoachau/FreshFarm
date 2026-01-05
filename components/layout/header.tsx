"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { ShoppingCart, Search, User, Menu, X, Phone, Info, FileText, HelpCircle, Shield, Truck, CreditCard, Package, TrendingUp, Star, Tag, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "")
  const [phoneQuery, setPhoneQuery] = useState("")
  const { isAuthenticated, user } = useAuth()
  const { items } = useCart()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      const params = new URLSearchParams(searchParams.toString())
      params.set("search", searchTerm.trim())
      params.delete("page")
      router.push(`/products?${params.toString()}`)
    }
  }

  const handleQuickTracking = (e: React.FormEvent) => {
    e.preventDefault()
    if (!phoneQuery.trim()) return
    const params = new URLSearchParams()
    params.set("phone", phoneQuery.trim())
    router.push(`/track-order?${params.toString()}`)
  }

  const cartItemCount = items?.length || 0
  const { data: categories } = useSWR("/api/categories", fetcher)

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/")

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      {/* Top bar - Promotional info */}
      <div className="bg-gradient-to-r from-primary to-primary-dark text-white py-2">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-xs md:text-sm text-center">🚚 Miễn phí giao hàng từ 300.000đ | ⏱ Giao hàng nhanh 2H</p>
        </div>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4">
        {/* Row 1: 2 cột - Logo trái, Search/Menu/Account/Cart phải */}
        <div className="flex items-center justify-between gap-4 py-3">
          {/* Cột trái: Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 group">
            <img 
              src="/logo2.jpg" 
              alt="FreshFarm Logo" 
              className="h-10 sm:h-12 object-contain group-hover:scale-105 transition-transform"
            />
            <span className="font-bold text-lg text-primary hidden sm:inline">FreshFarm</span>
          </Link>

          {/* Cột phải: Search, Menu thông tin, Account, Cart */}
          <div className="flex items-center gap-3">
            {/* Search bar */}
            <form
              onSubmit={handleSearch}
              className="hidden lg:flex items-center bg-neutral-50 border border-neutral-200 rounded-full px-4 py-2 hover:border-primary/50 focus-within:border-primary transition-colors"
            >
              <Search size={18} className="text-neutral-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent ml-2 outline-none w-40 text-sm text-neutral-700 placeholder:text-neutral-400"
              />
            </form>

            {/* Menu thông tin - 3 gạch */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="flex items-center justify-center p-2 hover:bg-neutral-100 rounded-full transition-colors group"
                  title="Thông tin"
                >
                  <div className="flex flex-col gap-1">
                    <span className="w-4 h-0.5 bg-neutral-700 group-hover:bg-primary transition-colors"></span>
                    <span className="w-4 h-0.5 bg-neutral-700 group-hover:bg-primary transition-colors"></span>
                    <span className="w-4 h-0.5 bg-neutral-700 group-hover:bg-primary transition-colors"></span>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Thông Tin</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/shipping" className="flex items-center gap-2 cursor-pointer">
                    <Truck size={16} className="text-neutral-500" />
                    <span>Chính Sách Giao Hàng</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/return-policy" className="flex items-center gap-2 cursor-pointer">
                    <CreditCard size={16} className="text-neutral-500" />
                    <span>Chính Sách Đổi Trả</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/privacy" className="flex items-center gap-2 cursor-pointer">
                    <Shield size={16} className="text-neutral-500" />
                    <span>Chính Sách Bảo Mật</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/terms" className="flex items-center gap-2 cursor-pointer">
                    <FileText size={16} className="text-neutral-500" />
                    <span>Điều Khoản Sử Dụng</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/guide" className="flex items-center gap-2 cursor-pointer">
                    <Info size={16} className="text-neutral-500" />
                    <span>Hướng Dẫn Mua Hàng</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/faq" className="flex items-center gap-2 cursor-pointer">
                    <HelpCircle size={16} className="text-neutral-500" />
                    <span>Câu Hỏi Thường Gặp</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Account */}
            <Link
              href={isAuthenticated ? "/profile" : "/auth/login"}
              className="hidden sm:flex items-center justify-center p-2 hover:bg-neutral-100 rounded-full transition-colors group"
              title={isAuthenticated ? user?.fullName || "Tài khoản" : "Đăng nhập"}
            >
              <User size={20} className="text-neutral-700 group-hover:text-primary transition-colors" />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative flex items-center justify-center p-2 hover:bg-neutral-100 rounded-full transition-colors group"
              title="Giỏ hàng"
            >
              <ShoppingCart size={20} className="text-neutral-700 group-hover:text-primary transition-colors" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full min-w-[18px] h-4.5 flex items-center justify-center px-1 shadow-md">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden flex items-center justify-center p-2 hover:bg-neutral-100 rounded-full transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? <X size={20} className="text-neutral-700" /> : <Menu size={20} className="text-neutral-700" />}
            </button>
          </div>
        </div>

        {/* Row 2: Categories Menu and Navigation */}
        <div className="hidden md:flex items-center gap-4 pb-3 border-t border-neutral-100 pt-3">
          {/* Categories & Tags Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 bg-white hover:bg-neutral-50 border border-neutral-200 h-9 text-sm"
              >
                <Package size={16} />
                <span className="font-medium">Danh Mục</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64 max-h-[80vh] overflow-y-auto">
              <DropdownMenuLabel>Danh Mục Sản Phẩm</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories?.map((category: any) => (
                <DropdownMenuItem key={category.id} asChild>
                  <Link 
                    href={`/products?category=${category.id}`}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Package size={16} className="text-neutral-500" />
                    <span>{category.name}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Sản Phẩm Nổi Bật</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link 
                  href="/products?sort=bestselling"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <TrendingUp size={16} className="text-neutral-500" />
                  <span>🔥 Hàng Bán Chạy</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link 
                  href="/products?sort=rating&minRating=4"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Star size={16} className="text-neutral-500" />
                  <span>⭐ Sản Phẩm Đánh Giá Cao</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link 
                  href="/products?discounted=true"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Tag size={16} className="text-neutral-500" />
                  <span>💰 Đang Khuyến Mãi</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link 
                  href="/products?sort=newest"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles size={16} className="text-neutral-500" />
                  <span>✨ Sản Phẩm Mới</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Desktop menu - Navigation */}
          <nav className="flex items-center gap-1 flex-1">
            <Link 
              href="/products" 
              className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
                isActive("/products")
                  ? "bg-primary text-white shadow-sm"
                  : "text-neutral-700 hover:text-primary hover:bg-neutral-50"
              }`}
            >
              Sản Phẩm
            </Link>
            <Link 
              href="/cart" 
              className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
                isActive("/cart")
                  ? "bg-primary text-white shadow-sm"
                  : "text-neutral-700 hover:text-primary hover:bg-neutral-50"
              }`}
            >
              Giỏ Hàng
            </Link>
            <Link 
              href="/track-order" 
              className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
                isActive("/track-order")
                  ? "bg-primary text-white shadow-sm"
                  : "text-neutral-700 hover:text-primary hover:bg-neutral-50"
              }`}
            >
              Tra Cứu Đơn
            </Link>
            <Link 
              href="/about" 
              className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
                isActive("/about")
                  ? "bg-primary text-white shadow-sm"
                  : "text-neutral-700 hover:text-primary hover:bg-neutral-50"
              }`}
            >
              Về Chúng Tôi
            </Link>
            <Link 
              href="/news" 
              className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
                isActive("/news")
                  ? "bg-primary text-white shadow-sm"
                  : "text-neutral-700 hover:text-primary hover:bg-neutral-50"
              }`}
            >
              Tin Tức
            </Link>
            <Link 
              href="/contact" 
              className={`px-3 py-1.5 rounded-lg font-medium text-sm transition-all ${
                isActive("/contact")
                  ? "bg-primary text-white shadow-sm"
                  : "text-neutral-700 hover:text-primary hover:bg-neutral-50"
              }`}
            >
              Liên Hệ
            </Link>
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <nav className="md:hidden border-t border-border bg-neutral-50 px-4 py-4 flex flex-col gap-4">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="flex items-center bg-white rounded-lg px-4 py-2 border border-border">
            <Search size={18} className="text-neutral-400" />
            <input
              type="text"
              placeholder="Tìm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent ml-2 outline-none w-full text-sm"
            />
          </form>

          {/* Quick tracking by phone */}
          <form
            onSubmit={handleQuickTracking}
            className="flex items-center bg-white rounded-lg px-4 py-2 border border-border"
          >
            <Phone size={18} className="text-neutral-400" />
            <input
              type="tel"
              placeholder="Tra cứu đơn theo SĐT"
              value={phoneQuery}
              onChange={(e) => setPhoneQuery(e.target.value)}
              className="bg-transparent ml-2 outline-none w-full text-sm"
            />
          </form>
          
          <Link href="/products" className="text-neutral-700 hover:text-primary transition font-medium">
            Sản Phẩm
          </Link>
          <Link 
            href="/cart" 
            className="text-neutral-700 hover:text-primary transition font-medium"
          >
            Giỏ Hàng
          </Link>
          <Link href="/track-order" className="text-neutral-700 hover:text-primary transition font-medium">
            Tra Cứu Đơn
          </Link>
          <Link href="/about" className="text-neutral-700 hover:text-primary transition font-medium">
            Về Chúng Tôi
          </Link>
          <Link href="/news" className="text-neutral-700 hover:text-primary transition font-medium">
            Tin Tức
          </Link>
          <Link href="/contact" className="text-neutral-700 hover:text-primary transition font-medium">
            Liên Hệ
          </Link>
          <Link href={isAuthenticated ? "/profile" : "/auth/login"}>
            <Button className="w-full bg-primary hover:bg-primary-dark">
              {isAuthenticated ? user?.fullName || "Tài Khoản" : "Đăng Nhập"}
            </Button>
          </Link>
        </nav>
      )}
    </header>
  )
}

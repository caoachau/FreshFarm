"use client"

import { Button } from "@/components/ui/button"
import { Sprout, Truck, Home, DollarSign, Leaf, ShoppingBag, Sparkles } from "lucide-react"
import Link from "next/link"

export default function HeroBanner() {
  return (
    <div className="relative w-full bg-white via-emerald-50 to-lime-50 rounded-lg overflow-hidden border-2 border-green-100 shadow-lg">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Decorative blur elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-300 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-lime-300 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Main Content */}
          <div className="text-center lg:text-left space-y-6 z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 rounded-full text-green-700 font-medium text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              <span>100% Nông Sản Tươi Sạch</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 leading-tight">
              Nông Sản Việt
            </h1>
            
            <p className="text-3xl sm:text-4xl font-bold text-green-800 flex items-center justify-center lg:justify-start gap-3">
              <Leaf className="w-8 h-8 text-green-600" />
              An Tâm Cho Gia Đình
            </p>
            
            <p className="text-lg text-gray-700 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Tươi ngon từ nông trại đến bàn ăn. Nguồn gốc rõ ràng, chất lượng đảm bảo, 
              <span className="font-semibold text-green-700"> giá tốt nhất thị trường</span>.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-6 max-w-md mx-auto lg:mx-0">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-700">100+</p>
                <p className="text-sm text-gray-600">Sản phẩm</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-700">5K+</p>
                <p className="text-sm text-gray-600">Khách hàng</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-700">⭐4.9</p>
                <p className="text-sm text-gray-600">Đánh giá</p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link href="/products">
                <Button size="lg" className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 px-8 py-6">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Xem Sản Phẩm
                </Button>
              </Link>
              
              <Link href="/products?discounted=true">
                <Button size="lg" variant="outline" className="border-2 border-green-600 text-green-700 hover:bg-green-50 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 px-8 py-6">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Khuyến Mãi Hot 🔥
                </Button>
              </Link>
            </div>
          </div>

          {/* Right: Image Grid */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              {/* Large image */}
              <div className="col-span-2 relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=600&h=400&fit=crop" 
                  alt="Rau củ tươi"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              
              {/* Small images */}
              <div className="rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=300&h=300&fit=crop" 
                  alt="Trái cây tươi"
                  className="w-full h-48 object-cover"
                />
              </div>
              
              <div className="rounded-2xl overflow-hidden shadow-xl transform hover:scale-105 transition-transform duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=300&h=300&fit=crop" 
                  alt="Rau xanh"
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>

            {/* Floating discount badge */}
            <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-amber-400 to-orange-500 text-white px-6 py-4 rounded-2xl shadow-xl transform rotate-3 hover:rotate-0 transition-transform cursor-pointer">
              <p className="text-2xl font-black">GIẢM</p>
              <p className="text-3xl font-black">30%</p>
              <p className="text-xs font-semibold">Hôm nay</p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-green-100 shadow-md hover:shadow-lg transition">
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 rounded-full p-3 mb-3">
                <Sprout className="text-green-600" size={32} />
              </div>
              <h3 className="font-bold text-green-800 mb-2 text-sm sm:text-base">100% Tự Nhiên</h3>
              <p className="text-xs sm:text-sm text-neutral-600">Hữu cơ</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-green-100 shadow-md hover:shadow-lg transition">
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 rounded-full p-3 mb-3">
                <Truck className="text-green-600" size={32} />
              </div>
              <h3 className="font-bold text-green-800 mb-2 text-sm sm:text-base">Giao Hàng Nhanh</h3>
              <p className="text-xs sm:text-sm text-neutral-600">Toàn quốc</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-green-100 shadow-md hover:shadow-lg transition">
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 rounded-full p-3 mb-3">
                <Home className="text-green-600" size={32} />
              </div>
              <h3 className="font-bold text-green-800 mb-2 text-sm sm:text-base">Nguồn Gốc Rõ Ràng</h3>
              <p className="text-xs sm:text-sm text-neutral-600">Nông trại uy tín</p>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 sm:p-6 border border-green-100 shadow-md hover:shadow-lg transition">
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 rounded-full p-3 mb-3">
                <DollarSign className="text-green-600" size={32} />
              </div>
              <h3 className="font-bold text-green-800 mb-2 text-sm sm:text-base">Giá Tốt Tại Vườn</h3>
              <p className="text-xs sm:text-sm text-neutral-600">Tiết kiệm hơn</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave decoration at bottom */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 120" className="w-full h-12 fill-white">
          <path d="M0,64 C480,120 960,0 1440,64 L1440,120 L0,120 Z"></path>
        </svg>
      </div>
    </div>
  )
}
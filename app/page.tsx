"use client"
import { useState } from "react"
import useSWR from "swr"

import BannerSlider from "@/components/home/banner-slider"
import HeroBanner from "@/components/home/hero-banner"
import ServiceInfo from "@/components/home/service-info"
import CategoryShowcase from "@/components/home/category-showcase"
import ProductGrid from "@/components/home/product-grid"
import { fetcher } from "@/lib/fetcher"
import { Button } from "@/components/ui/button"

function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email.trim()) return

    setIsSubmitting(true)
    setMessage("")

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message || "Đăng ký thành công! Cảm ơn bạn đã quan tâm.")
        setEmail("")
      } else {
        setMessage(data.error || "Có lỗi xảy ra. Vui lòng thử lại sau.")
      }
    } catch {
      setMessage("Có lỗi xảy ra. Vui lòng thử lại sau.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 rounded-xl p-5 sm:p-7 my-8 border border-green-100 shadow-md">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-green-200 rounded-full blur-3xl opacity-20 -mr-24 -mt-24" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-200 rounded-full blur-3xl opacity-20 -ml-24 -mb-24" />

      <div className="relative z-10 max-w-xl mx-auto text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md mb-4 transform hover:scale-110 transition-transform">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-600 mb-3">
          Nhận Thông Tin Khuyến Mãi
        </h2>

        <p className="text-gray-600 text-sm sm:text-base mb-5 max-w-lg mx-auto">
          Đăng ký nhận email để cập nhật các
          <span className="font-semibold text-green-700"> khuyến mãi độc quyền</span> và
          <span className="font-semibold text-green-700"> ưu đãi đặc biệt</span> mới nhất
        </p>

        {/* Form */}
        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto mb-3">
          <div className="flex-1 relative">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all text-gray-800 placeholder:text-gray-400 shadow-sm text-sm"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-bold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Đang xử lý...
              </span>
            ) : (
              "Đăng Ký Ngay"
            )}
          </Button>
        </form>

        {/* Message */}
        {message && (
          <div
            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-xs sm:text-sm ${
              message.includes("thành công")
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {message.includes("thành công") ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
            {message}
          </div>
        )}

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-4 mt-6 text-xs sm:text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Bảo mật thông tin</span>
          </div>

          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span>Không spam</span>
          </div>
        </div>
      </div>
    </section>
  )
} // ✅ QUAN TRỌNG: đóng NewsletterSection ở đây

export default function Home() {
  const { data: bestSellingData, error: bestSellingError } = useSWR(
    "/api/products?sort=bestselling&page=1&limit=8",
    fetcher
  )

  const { data: promotionsData, error: promotionsError } = useSWR(
    "/api/products?discounted=true&page=1&limit=8",
    fetcher
  )

  const bestSelling = bestSellingData?.products || []
  const promotions = promotionsData?.products || []

  if (!bestSellingData && !bestSellingError)
    return <div className="text-center py-20">Đang tải sản phẩm...</div>

  if (bestSellingError || promotionsError)
    return (
      <div className="text-center py-20 text-red-600">
        Lỗi tải dữ liệu. Vui lòng kiểm tra server API (
        {bestSellingError?.status || promotionsError?.status}).
      </div>
    )

  return (
    <div className="w-full">
      <div className="mb-8">
        <HeroBanner />
      </div>

      <BannerSlider />

      <CategoryShowcase />

      {bestSelling.length > 0 && <ProductGrid title="🔥 Sản Phẩm Bán Chạy" products={bestSelling} />}

      {promotions.length > 0 && <ProductGrid title="💰 Khuyến Mãi Đặc Biệt" products={promotions} />}

      <NewsletterSection />

      <ServiceInfo />
    </div>
  )
}

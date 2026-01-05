"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Slide {
  id: number
  title: string
  subtitle: string
  image: string
  cta: string
}

const slides: Slide[] = [
  {
    id: 1,
    title: "Nông Sản Sạch Hàng Ngày",
    subtitle: "Giao hàng nhanh 2 giờ - Giá tốt nhất",
    image: "/fresh-vegetables-market.jpg",
    cta: "Mua Ngay",
  },
  {
    id: 2,
    title: "Giảm Tới 40%",
    subtitle: "Khuyến mãi đặc biệt cho sản phẩm hữu cơ",
    image: "/sale-discount-banner.jpg",
    cta: "Xem Khuyến Mãi",
  },
  {
    id: 3,
    title: "Trái Cây Nhập Khẩu",
    subtitle: "Chất lượng quốc tế - Giá Việt",
    image: "/fresh-imported-fruits.jpg",
    cta: "Khám Phá",
  },
]

export default function BannerSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  const next = () => setCurrent((prev) => (prev + 1) % slides.length)

  return (
    <div className="relative h-32 sm:h-40 lg:h-48 rounded-lg overflow-hidden bg-neutral-200 group">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
          style={{
            backgroundImage: `url('${slide.image}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative h-full flex flex-col items-center justify-center text-center text-white px-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-1 text-balance">{slide.title}</h2>
            <p className="text-sm sm:text-base mb-3 text-neutral-100">{slide.subtitle}</p>
            <Button size="sm" className="bg-primary hover:bg-primary-dark text-white text-sm px-4 py-2">{slide.cta}</Button>
          </div>
        </div>
      ))}

      {/* Navigation buttons */}
      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-1.5 rounded-full transition opacity-0 group-hover:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft size={18} className="text-neutral-800" />
      </button>
      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-1.5 rounded-full transition opacity-0 group-hover:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight size={18} className="text-neutral-800" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-1.5 h-1.5 rounded-full transition ${index === current ? "bg-white w-4" : "bg-white/60"}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

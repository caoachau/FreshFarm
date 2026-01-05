"use client"

import Link from "next/link"
import { useState } from "react"
import { Heart, ShoppingCart, Star, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    image: string
    discount?: number
    originalPrice?: number | null
    rating?: number
    reviews?: number | any[]
    brand?: string
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    setIsAddingToCart(true)
    try {
      await addToCart(product.id, 1)
    } catch (error: any) {
      console.error("Error adding to cart:", error)
      alert(error?.message || "Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.")
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }

    await toggleWishlist(product.id)
  }

  const inWishlist = isInWishlist(product.id)
  const reviewCount = typeof product.reviews === 'number' ? product.reviews : product.reviews?.length || 0

  return (
    <Link href={`/products/${product.id}`} className="block">
      <div className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-300 h-full flex flex-col">
        
        {/* Image Container */}
        <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            } group-hover:scale-110`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
          
          {/* Quick View Button - appears on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
            <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all">
              <Eye size={16} className="text-green-600" />
              <span className="text-sm font-semibold text-gray-800">Xem nhanh</span>
            </div>
          </div>

          {/* Discount Badge */}
          {product.discount && (
            <div className="absolute top-3 right-3 z-10">
              <div className="bg-gradient-to-br from-red-500 to-pink-600 text-white px-3 py-1.5 rounded-lg shadow-lg transform rotate-2 hover:rotate-0 transition-transform">
                <span className="text-xs font-black">-{product.discount}%</span>
              </div>
            </div>
          )}

          {/* Wishlist Button */}
          <button
            className={`absolute top-3 left-3 z-10 p-2.5 rounded-full transition-all duration-300 shadow-lg ${
              inWishlist
                ? "bg-red-500 text-white scale-100"
                : "bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-500 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100"
            }`}
            onClick={handleToggleWishlist}
            title={inWishlist ? "Đã yêu thích" : "Thêm vào yêu thích"}
          >
            <Heart 
              size={18} 
              className={`transition-all ${inWishlist ? "fill-current" : ""}`}
            />
          </button>
        </div>

        {/* Content Container */}
        <div className="flex flex-col flex-grow p-4 space-y-3">
          
          {/* Brand */}
          {product.brand && (
            <span className="text-xs font-semibold text-green-600 uppercase tracking-wide">
              {product.brand}
            </span>
          )}

          {/* Product Name */}
          <h3 className="font-bold text-base text-gray-800 line-clamp-2 leading-snug group-hover:text-green-600 transition-colors min-h-[2.5rem]">
            {product.name}
          </h3>

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={`${
                      i < Math.floor(product.rating!)
                        ? "fill-amber-400 text-amber-400"
                        : "fill-gray-200 text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {product.rating.toFixed(1)} ({reviewCount})
              </span>
            </div>
          )}

          {/* Spacer to push price and button to bottom */}
          <div className="flex-grow" />

          {/* Price Section */}
          <div className="flex items-baseline gap-2 pt-2">
            <span className="text-2xl font-black text-green-600">
              {product.price.toLocaleString()}₫
            </span>
            {product.originalPrice && (
              <div className="flex flex-col">
                <span className="text-sm text-gray-400 line-through">
                  {product.originalPrice.toLocaleString()}₫
                </span>
              </div>
            )}
          </div>

          {/* Add to Cart Button */}
          <Button
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <span className="flex items-center justify-center gap-2">
                <svg 
                  className="animate-spin h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span className="font-bold">Đang thêm...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <ShoppingCart size={18} strokeWidth={2.5} />
                <span>Thêm Vào Giỏ</span>
              </span>
            )}
          </Button>
        </div>
      </div>
    </Link>
  )
}
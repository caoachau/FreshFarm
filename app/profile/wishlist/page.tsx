"use client"

import Link from "next/link"
import { Trash2, ShoppingCart, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/hooks/use-wishlist"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import { useState, useEffect } from "react"
import type { Product } from "@/data/products"

export default function WishlistPage() {
  const { isAuthenticated } = useAuth()
  const { items, removeFromWishlist, isLoaded } = useWishlist()
  const { addToCart } = useCart()
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([])

  useEffect(() => {
    if (isLoaded && items.length > 0) {
      // Fetch products for wishlist items
      Promise.all(
        items.map((productId: string) =>
          fetch(`/api/products/${productId}`)
            .then((res) => {
              if (!res.ok) {
                return null
              }
              return res.json()
            })
            .then((data) => data?.product || null)
            .catch(() => null)
        )
      ).then((products) => {
        setWishlistProducts(products.filter((p: Product | null): p is Product => p !== null && p !== undefined && typeof p.id !== 'undefined'))
      })
    } else if (isLoaded && items.length === 0) {
      // Clear products when wishlist is empty; avoid redundant state updates
      setWishlistProducts((prev) => (prev.length ? [] : prev))
    }
  }, [items, isLoaded])

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

  if (!isLoaded) {
    return <div className="text-center py-12">Đang tải...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sản Phẩm Yêu Thích</h1>

      {wishlistProducts.length === 0 ? (
        <div className="text-center py-12 bg-neutral-50 rounded-lg">
          <Heart size={64} className="mx-auto text-neutral-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Danh sách yêu thích trống</h2>
          <p className="text-neutral-600 mb-6">Hãy thêm những sản phẩm bạn thích vào đây</p>
          <Link href="/products">
            <Button className="bg-primary hover:bg-primary-dark text-white">Tiếp Tục Mua Sắm</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistProducts.map((product: Product) => (
            <div
              key={product.id}
              className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-md transition"
            >
              <Link href={`/products/${product.id}`}>
                <div className="relative bg-neutral-100 h-48 overflow-hidden group">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                  {product.discount && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded font-bold text-sm">
                      -{product.discount}%
                    </div>
                  )}
                </div>
              </Link>

              <div className="p-4">
                <Link href={`/products/${product.id}`}>
                  <h3 className="font-bold line-clamp-2 hover:text-primary transition mb-2">{product.name}</h3>
                </Link>

                <div className="flex items-center gap-1 mb-3">
                  <div className="flex text-yellow-400 text-sm">{"★".repeat(Math.floor(product.rating || 0))}</div>
                  <span className="text-xs text-neutral-600">
                    {product.rating?.toFixed(1) || '0.0'} ({Array.isArray(product.reviews) ? product.reviews.length : (product.votes || product.reviews || 0)})
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-4">
                  <span className="font-bold text-lg text-primary">{product.price.toLocaleString()}₫</span>
                  {product.originalPrice && (
                    <span className="text-xs text-neutral-500 line-through">
                      {product.originalPrice.toLocaleString()}₫
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      removeFromWishlist(product.id)
                    }}
                    className="flex-1 py-2 border border-border rounded-lg hover:bg-red-50 transition font-medium flex items-center justify-center gap-2 text-sm"
                  >
                    <Trash2 size={16} /> Xóa
                  </button>
                  <button
                    onClick={async (e) => {
                      e.preventDefault()
                      if (!isAuthenticated) {
                        alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng")
                        return
                      }
                      setAddingToCart(product.id)
                      try {
                        await addToCart(product.id, 1)
                        alert(`Đã thêm "${product.name}" vào giỏ hàng!`)
                      } catch (error: any) {
                        alert(error?.message || "Không thể thêm sản phẩm vào giỏ hàng")
                      } finally {
                        setAddingToCart(null)
                      }
                    }}
                    disabled={addingToCart === product.id}
                    className="flex-1 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition font-medium flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                  >
                    <ShoppingCart size={16} /> 
                    {addingToCart === product.id ? "Đang thêm..." : "Thêm Giỏ"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

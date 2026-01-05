"use client"

import Link from "next/link"
import { Heart, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductListViewProps {
  products: Array<{
    id: string
    name: string
    description?: string
    price: number
    image: string
    discount?: number
    originalPrice?: number | null
    rating?: number
    reviews?: number | any[]
    brand?: string
  }>
}

export default function ProductListView({ products }: ProductListViewProps) {
  return (
    <div className="space-y-4">
      {products.map((product) => (
        <Link key={product.id} href={`/products/${product.id}`}>
          <div className="bg-white rounded-lg border border-border p-4 hover:shadow-md transition group cursor-pointer flex gap-4">
            {/* Image */}
            <div className="relative bg-neutral-100 w-32 h-32 sm:w-40 sm:h-40 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
              />
              {product.discount && (
                <div className="absolute top-2 right-2 bg-accent text-white px-2 py-1 rounded font-bold text-sm">
                  -{product.discount}%
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                {product.brand && <p className="text-sm text-neutral-500 mb-1">{product.brand}</p>}
                <h3 className="font-bold text-lg group-hover:text-primary transition mb-2">{product.name}</h3>
                <p className="text-neutral-600 text-sm line-clamp-2 mb-3">{product.description}</p>

                {/* Rating */}
                {product.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex text-yellow-400">{"★".repeat(Math.floor(product.rating))}</div>
                    <span className="text-sm text-neutral-600">
                      {product.rating} ({typeof product.reviews === 'number' ? product.reviews : product.reviews?.length || 0} đánh giá)
                    </span>
                  </div>
                )}
              </div>

              {/* Footer - Price and buttons */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-baseline gap-2">
                  <span className="font-bold text-xl text-primary">{product.price.toLocaleString()}₫</span>
                  {product.originalPrice && (
                    <span className="text-sm text-neutral-500 line-through">
                      {product.originalPrice.toLocaleString()}₫
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    className="p-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition"
                    onClick={(e) => {
                      e.preventDefault()
                    }}
                  >
                    <Heart size={18} className="text-neutral-600" />
                  </button>
                  <Button
                    className="bg-primary hover:bg-primary-dark text-white"
                    onClick={(e) => {
                      e.preventDefault()
                    }}
                  >
                    <ShoppingCart size={18} className="mr-2" />
                    Thêm Giỏ
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { Button } from "@/components/ui/button"

export default function SellerProductsPage() {
  const { data: products, mutate } = useSWR("/api/seller/products", fetcher)
  const [showAddForm, setShowAddForm] = useState(false)

  const handleToggleStatus = async (productId: string, currentStatus: string) => {
    try {
      const response = await fetch(`/api/seller/products/${productId}/toggle`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: currentStatus === "HIDDEN" ? "APPROVED" : "HIDDEN",
        }),
      })

      if (response.ok) {
        mutate()
      }
    } catch (error) {
      console.error("Error toggling product:", error)
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này?")) return

    try {
      const response = await fetch(`/api/seller/products/${productId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        mutate()
      }
    } catch (error) {
      console.error("Error deleting product:", error)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Quản Lý Sản Phẩm</h1>
        <Link href="/dashboard/seller/products/new">
          <Button className="bg-primary hover:bg-primary-dark">
            <Plus size={16} className="mr-2" />
            Thêm Sản Phẩm Mới
          </Button>
        </Link>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((product: any) => (
          <div key={product.id} className="bg-white rounded-lg border border-border overflow-hidden">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{product.name}</h3>
              <p className="text-sm text-neutral-600 mb-2 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-bold text-primary">
                  {product.price.toLocaleString()}₫
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  product.status === "APPROVED" ? "bg-green-100 text-green-700" :
                  product.status === "PENDING" ? "bg-orange-100 text-orange-700" :
                  product.status === "REJECTED" ? "bg-red-100 text-red-700" :
                  "bg-gray-100 text-gray-700"
                }`}>
                  {product.status === "APPROVED" ? "Đang Bán" :
                   product.status === "PENDING" ? "Chờ Duyệt" :
                   product.status === "REJECTED" ? "Từ Chối" :
                   "Ẩn"}
                </span>
              </div>
              <div className="flex gap-2">
                <Link href={`/dashboard/seller/products/${product.id}/edit`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Edit size={16} className="mr-1" />
                    Sửa
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleStatus(product.id, product.status)}
                  className={product.status === "HIDDEN" ? "text-green-600" : "text-gray-600"}
                >
                  {product.status === "HIDDEN" ? <Eye size={16} /> : <EyeOff size={16} />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                  className="text-red-600"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {(!products || products.length === 0) && (
          <div className="col-span-full text-center py-12 text-neutral-600">
            Chưa có sản phẩm nào. Hãy thêm sản phẩm đầu tiên!
          </div>
        )}
      </div>
    </div>
  )
}


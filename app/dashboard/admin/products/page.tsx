"use client"

import { useState } from "react"
import { CheckCircle, XCircle, Eye, Plus, Edit } from "lucide-react"
import useSWR from "swr"
import { authenticatedFetcher } from "@/lib/fetcher"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function AdminProductsPage() {
  const router = useRouter()
  const { token, isAuthenticated } = useAuth()
  const [filter, setFilter] = useState<"PENDING" | "APPROVED" | "REJECTED" | "all">("PENDING")
  const { data, mutate } = useSWR(
    isAuthenticated && token
      ? [`/api/admin/products?status=${filter === "all" ? "" : filter}`, token]
      : null,
    ([url, token]) => authenticatedFetcher(url, token)
  )

  const handleApprove = async (productId: string) => {
    if (!confirm("Bạn có chắc muốn duyệt sản phẩm này?")) return

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/admin/products/${productId}/approve`, {
        method: "PATCH",
        headers: {
          "x-user-id": token || "",
        },
      })

      if (response.ok) {
        alert("Đã duyệt sản phẩm thành công")
        mutate()
      } else {
        const error = await response.json()
        alert(error.error || "Không thể duyệt sản phẩm")
      }
    } catch (error) {
      console.error("Error approving product:", error)
      alert("Có lỗi xảy ra khi duyệt sản phẩm")
    }
  }

  const handleReject = async (productId: string) => {
    if (!confirm("Bạn có chắc muốn từ chối sản phẩm này?")) return

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/admin/products/${productId}/reject`, {
        method: "PATCH",
        headers: {
          "x-user-id": token || "",
        },
      })

      if (response.ok) {
        alert("Đã từ chối sản phẩm")
        mutate()
      } else {
        const error = await response.json()
        alert(error.error || "Không thể từ chối sản phẩm")
      }
    } catch (error) {
      console.error("Error rejecting product:", error)
      alert("Có lỗi xảy ra khi từ chối sản phẩm")
    }
  }

  const handleDelete = async (productId: string) => {
    if (!confirm("Bạn có chắc muốn xóa sản phẩm này? Hành động này không thể hoàn tác.")) return

    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
        headers: {
          "x-user-id": token || "",
        },
      })

      if (response.ok) {
        alert("Đã xóa sản phẩm thành công")
        mutate()
      } else {
        const error = await response.json()
        alert(error.error || "Không thể xóa sản phẩm")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Có lỗi xảy ra khi xóa sản phẩm")
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Quản Lý Sản Phẩm</h1>
        <Button 
          onClick={() => router.push("/dashboard/admin/products/new")}
          className="bg-primary hover:bg-primary-dark text-white"
        >
          <Plus size={16} className="mr-2" />
          Thêm Sản Phẩm
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { value: "PENDING", label: "Chờ Duyệt", count: data?.pendingCount || 0 },
          { value: "APPROVED", label: "Đã Duyệt", count: data?.approvedCount || 0 },
          { value: "REJECTED", label: "Từ Chối", count: data?.rejectedCount || 0 },
          { value: "all", label: "Tất Cả", count: data?.totalCount || 0 },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value as any)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === tab.value
                ? "bg-primary text-white"
                : "bg-white text-neutral-700 hover:bg-neutral-100"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Products List */}
      <div className="space-y-4">
        {data?.products?.map((product: any) => (
          <div key={product.id} className="bg-white rounded-lg p-6 border border-border">
            <div className="flex gap-6">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-24 h-24 rounded object-cover"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold">{product.name}</h3>
                    <p className="text-sm text-neutral-600 mt-1">{product.description}</p>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm">
                      <span>Giá: <strong>{product.price.toLocaleString()}₫</strong></span>
                      <span>Tồn kho: <strong>{product.stock}</strong></span>
                      <span>Đã bán: <strong>{product.sold || 0}</strong></span>
                      <span>Danh mục: <strong>{product.category?.name || "N/A"}</strong></span>
                      <span>Người bán: <strong>{product.seller?.fullName || "N/A"}</strong></span>
                      <span>Ngày tạo: <strong>{new Date(product.createdAt).toLocaleDateString("vi-VN")}</strong></span>
                    </div>
                    <div className="mt-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        product.status === "APPROVED" ? "bg-green-100 text-green-700" :
                        product.status === "REJECTED" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {product.status === "APPROVED" ? "Đã Duyệt" :
                         product.status === "REJECTED" ? "Từ Chối" :
                         "Chờ Duyệt"}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {product.status === "PENDING" && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(product.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle size={16} className="mr-1" />
                          Duyệt
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleReject(product.id)}
                          className="text-red-600"
                        >
                          <XCircle size={16} className="mr-1" />
                          Từ Chối
                        </Button>
                      </>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/dashboard/admin/products/${product.id}/edit`)}
                    >
                      <Edit size={16} className="mr-1" />
                      Sửa
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600"
                    >
                      Xóa
                    </Button>
                    <Link href={`/products/${product.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye size={16} className="mr-1" />
                        Xem
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {(!data?.products || data.products.length === 0) && (
          <div className="text-center py-12 text-neutral-600">
            Không có sản phẩm nào
          </div>
        )}
      </div>
    </div>
  )
}


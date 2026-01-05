"use client"

import { useState } from "react"
import { Search, Trash2, Star, Eye } from "lucide-react"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export default function AdminReviewsPage() {
  const { token, isAuthenticated } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const { data, mutate } = useSWR(
    isAuthenticated && token ? [`/api/admin/reviews?page=${page}&limit=20`, token] : null,
    ([url, token]) => authenticatedFetcher(url, token)
  )

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Bạn có chắc muốn xóa đánh giá này?")) return

    try {
      const tokenString = String(token || "").trim()
      const response = await fetch("/api/admin/reviews", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": tokenString,
        },
        body: JSON.stringify({ reviewId }),
      })

      if (response.ok) {
        mutate()
        alert("Đã xóa đánh giá thành công")
      } else {
        const error = await response.json()
        alert(error.error || "Không thể xóa đánh giá")
      }
    } catch (error) {
      console.error("Error deleting review:", error)
      alert("Có lỗi xảy ra khi xóa đánh giá")
    }
  }

  const filteredReviews = data?.reviews?.filter((review: any) => {
    if (!searchTerm) return true
    const search = searchTerm.toLowerCase()
    return (
      review.product?.name?.toLowerCase().includes(search) ||
      review.user?.fullName?.toLowerCase().includes(search) ||
      review.content?.toLowerCase().includes(search)
    )
  }) || []

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Quản Lý Đánh Giá</h1>
        <div className="text-sm text-neutral-600">
          Tổng: {data?.total || 0} đánh giá
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg p-4 border border-border mb-6">
        <div className="flex items-center gap-2">
          <Search size={20} className="text-neutral-400" />
          <input
            type="text"
            placeholder="Tìm kiếm theo sản phẩm, người dùng hoặc nội dung..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none"
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review: any) => (
          <div key={review.id} className="bg-white rounded-lg p-6 border border-border">
            <div className="flex gap-4">
              <Link href={`/products/${review.product?.id}`}>
                <img
                  src={review.product?.image || "/placeholder.svg"}
                  alt={review.product?.name}
                  className="w-20 h-20 rounded object-cover cursor-pointer hover:opacity-80"
                />
              </Link>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <Link href={`/products/${review.product?.id}`}>
                      <h3 className="font-bold text-lg hover:text-primary transition cursor-pointer">
                        {review.product?.name || "Sản phẩm đã bị xóa"}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex text-yellow-400">
                        {"★".repeat(review.rating)}
                        {"☆".repeat(5 - review.rating)}
                      </div>
                      <span className="text-sm text-neutral-600">
                        bởi {review.user?.fullName || "Người dùng"}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <p className="text-neutral-700 mt-3">{review.content}</p>
                    {review.reply && (
                      <div className="mt-3 p-3 bg-primary/10 rounded-lg">
                        <p className="text-sm font-medium text-primary mb-1">Phản hồi từ người bán:</p>
                        <p className="text-sm text-neutral-700">{review.reply}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/products/${review.product?.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye size={16} className="mr-1" />
                        Xem Sản Phẩm
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(review.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Xóa
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredReviews.length === 0 && (
          <div className="text-center py-12 text-neutral-600">
            {searchTerm ? "Không tìm thấy đánh giá nào" : "Chưa có đánh giá nào"}
          </div>
        )}
      </div>

      {/* Pagination */}
      {data && data.pages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Trước
          </Button>
          <span className="px-4 py-2">
            Trang {page} / {data.pages}
          </span>
          <Button
            variant="outline"
            onClick={() => setPage((p) => Math.min(data.pages, p + 1))}
            disabled={page === data.pages}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  )
}


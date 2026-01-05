"use client"

import { useState } from "react"
import { Star, Edit, Trash2, X } from "lucide-react"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"

export default function UserReviewsPage() {
  const { token } = useAuth()
  const [editingReview, setEditingReview] = useState<string | null>(null)
  const [editRating, setEditRating] = useState(5)
  const [editContent, setEditContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: reviews, mutate } = useSWR("/api/user/reviews", fetcher)

  const handleEdit = (review: any) => {
    setEditingReview(review.id)
    setEditRating(review.rating)
    setEditContent(review.content)
  }

  const handleCancelEdit = () => {
    setEditingReview(null)
    setEditRating(5)
    setEditContent("")
  }

  const handleSaveEdit = async (reviewId: string) => {
    if (editContent.trim().length === 0) {
      alert("Vui lòng nhập nội dung đánh giá")
      return
    }

    setIsSubmitting(true)
    try {
      const tokenString = String(token || "").trim()
      const response = await fetch("/api/user/reviews", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": tokenString,
        },
        body: JSON.stringify({
          reviewId,
          rating: editRating,
          content: editContent.trim(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Không thể cập nhật đánh giá")
      }

      alert("Đã cập nhật đánh giá thành công!")
      setEditingReview(null)
      mutate()
    } catch (error: any) {
      alert(error?.message || "Có lỗi xảy ra khi cập nhật đánh giá")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (reviewId: string) => {
    if (!confirm("Bạn có chắc muốn xóa đánh giá này?")) return

    try {
      const tokenString = String(token || "").trim()
      const response = await fetch("/api/user/reviews", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": tokenString,
        },
        body: JSON.stringify({ reviewId }),
      })

      if (response.ok) {
        alert("Đã xóa đánh giá thành công")
        mutate()
      } else {
        const error = await response.json()
        alert(error.error || "Không thể xóa đánh giá")
      }
    } catch (error) {
      console.error("Error deleting review:", error)
      alert("Có lỗi xảy ra khi xóa đánh giá")
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Đánh Giá Của Tôi</h1>
        <div className="text-sm text-neutral-600">
          Tổng: {reviews?.length || 0} đánh giá
        </div>
      </div>

      {!reviews || reviews.length === 0 ? (
        <div className="text-center py-12 bg-neutral-50 rounded-lg">
          <Star size={64} className="mx-auto text-neutral-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Chưa có đánh giá nào</h2>
          <p className="text-neutral-600 mb-6">Hãy mua sản phẩm và viết đánh giá để chia sẻ trải nghiệm của bạn</p>
          <Link href="/products">
            <Button className="bg-primary hover:bg-primary-dark text-white">Xem Sản Phẩm</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review: any) => (
            <div key={review.id} className="bg-white rounded-lg p-6 border border-border">
              {editingReview === review.id ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-lg">Chỉnh Sửa Đánh Giá</h3>
                    <button
                      onClick={handleCancelEdit}
                      className="text-neutral-500 hover:text-neutral-700"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Đánh giá</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setEditRating(star)}
                          className="focus:outline-none"
                        >
                          <Star
                            size={32}
                            className={star <= editRating ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Nội dung</label>
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary min-h-[120px]"
                      rows={5}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSaveEdit(review.id)}
                      disabled={isSubmitting || editContent.trim().length === 0}
                      className="bg-primary hover:bg-primary-dark text-white"
                    >
                      {isSubmitting ? "Đang lưu..." : "Lưu Thay Đổi"}
                    </Button>
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Hủy
                    </Button>
                  </div>
                </div>
              ) : (
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(review)}
                        >
                          <Edit size={16} className="mr-1" />
                          Sửa
                        </Button>
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
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


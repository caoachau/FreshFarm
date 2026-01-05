"use client"

import { useState, useMemo } from "react"
import { useAuth } from "@/hooks/use-auth"
import { X, Star } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Review {
  id: string
  author: string
  rating: number
  date: string
  comment: string
  helpful: number
  user?: {
    fullName: string
    avatar?: string
  }
}

interface ProductReviewsProps {
  rating: number
  reviews: number
  reviews_data?: Review[]
  productId?: string
}

const mockReviews: Review[] = [
  {
    id: "1",
    author: "Nguyễn Văn A",
    rating: 5,
    date: "2 ngày trước",
    comment: "Sản phẩm rất tốt, tươi, giao hàng nhanh. Sẽ tiếp tục mua ở đây.",
    helpful: 24,
  },
  {
    id: "2",
    author: "Trần Thị B",
    rating: 4,
    date: "5 ngày trước",
    comment: "Chất lượng tốt nhưng giá hơi cao so với chợ.",
    helpful: 12,
  },
  {
    id: "3",
    author: "Lê Văn C",
    rating: 5,
    date: "1 tuần trước",
    comment: "Tuyệt vời! Chất lượng hữu cơ thật sự đáng giá từng đồng.",
    helpful: 18,
  },
]

export default function ProductReviews({ rating, reviews, reviews_data = mockReviews, productId }: ProductReviewsProps) {
  const [showAllReviews, setShowAllReviews] = useState(false)
  const [sortBy, setSortBy] = useState("helpful")
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewContent, setReviewContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isAuthenticated, token } = useAuth()

  // Calculate rating distribution from actual reviews data
  const ratingDistribution = useMemo(() => {
    if (!reviews_data || reviews_data.length === 0) {
      return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    }
    
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews_data.forEach((review) => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating as keyof typeof distribution]++
      }
    })
    
    const total = reviews_data.length
    return {
      5: total > 0 ? (distribution[5] / total) * 100 : 0,
      4: total > 0 ? (distribution[4] / total) * 100 : 0,
      3: total > 0 ? (distribution[3] / total) * 100 : 0,
      2: total > 0 ? (distribution[2] / total) * 100 : 0,
      1: total > 0 ? (distribution[1] / total) * 100 : 0,
    }
  }, [reviews_data])

  // Sort reviews based on sortBy
  const sortedReviews = useMemo(() => {
    if (!reviews_data) return []
    
    const sorted = [...reviews_data]
    switch (sortBy) {
      case "recent":
        return sorted.sort((a, b) => {
          const dateA = new Date(a.date).getTime()
          const dateB = new Date(b.date).getTime()
          return dateB - dateA
        })
      case "highest":
        return sorted.sort((a, b) => b.rating - a.rating)
      case "lowest":
        return sorted.sort((a, b) => a.rating - b.rating)
      case "helpful":
      default:
        return sorted.sort((a, b) => b.helpful - a.helpful)
    }
  }, [reviews_data, sortBy])

  const displayedReviews = showAllReviews ? sortedReviews : sortedReviews.slice(0, 2)

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Đánh Giá Sản Phẩm</h2>

        {/* Rating summary */}
        <div className="bg-neutral-50 rounded-lg p-6 mb-6 flex flex-col sm:flex-row items-center gap-8">
          <div className="text-center">
            <div className="text-5xl font-bold text-primary mb-2">{rating.toFixed(1)}</div>
            <div className="flex justify-center text-yellow-400 mb-2">{"★".repeat(Math.floor(rating))}</div>
            <p className="text-neutral-600">{reviews} đánh giá</p>
          </div>

          {/* Rating distribution */}
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center gap-2">
                <span className="text-sm text-neutral-600 w-12">{stars} ★</span>
                <div className="flex-1 bg-neutral-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all" 
                    style={{ width: `${ratingDistribution[stars as keyof typeof ratingDistribution]}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sort reviews */}
        <div className="mb-6 flex items-center gap-2">
          <label className="text-sm font-medium">Sắp xếp theo:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg outline-none focus:border-primary transition text-sm"
          >
            <option value="helpful">Hữu Ích Nhất</option>
            <option value="recent">Gần Đây Nhất</option>
            <option value="highest">Đánh Giá Cao Nhất</option>
            <option value="lowest">Đánh Giá Thấp Nhất</option>
          </select>
        </div>

        {/* Reviews list */}
        <div className="space-y-4">
          {displayedReviews.map((review) => (
            <div key={review.id} className="border border-border rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-sm">{review.author}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex text-yellow-400 text-sm">{"★".repeat(review.rating)}</div>
                    <span className="text-xs text-neutral-500">{review.date}</span>
                  </div>
                </div>
              </div>
              <p className="text-neutral-700 text-sm mb-3">{review.comment}</p>
              <button className="text-sm text-neutral-600 hover:text-primary transition">
                👍 Hữu ích ({review.helpful})
              </button>
            </div>
          ))}
        </div>

        {/* Show more button */}
        {reviews_data.length > 2 && !showAllReviews && (
          <button
            onClick={() => setShowAllReviews(true)}
            className="w-full mt-6 py-3 border border-border rounded-lg hover:bg-neutral-100 transition font-medium"
          >
            Xem Tất Cả {reviews} Đánh Giá
          </button>
        )}
      </div>

      {/* Write review CTA */}
      {!showReviewForm ? (
        <div className="bg-primary/10 rounded-lg p-6 text-center">
          <h3 className="font-bold text-lg mb-2">Hãy Chia Sẻ Kinh Nghiệm</h3>
          <p className="text-neutral-600 mb-4">Bạn đã mua sản phẩm này? Hãy viết đánh giá của bạn</p>
          <Button
            onClick={() => {
              if (!isAuthenticated) {
                alert("Vui lòng đăng nhập để viết đánh giá")
                return
              }
              setShowReviewForm(true)
            }}
            className="px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition font-medium"
          >
            Viết Đánh Giá
          </Button>
        </div>
      ) : (
        <div className="bg-white border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Viết Đánh Giá</h3>
            <button
              onClick={() => {
                setShowReviewForm(false)
                setReviewRating(5)
                setReviewContent("")
              }}
              className="text-neutral-500 hover:text-neutral-700"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Đánh giá của bạn</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      size={32}
                      className={star <= reviewRating ? "fill-yellow-400 text-yellow-400" : "text-neutral-300"}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nội dung đánh giá</label>
              <textarea
                value={reviewContent}
                onChange={(e) => setReviewContent(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:border-primary min-h-[120px]"
                rows={5}
              />
            </div>

            <Button
              onClick={async () => {
                if (!productId) {
                  alert("Không tìm thấy thông tin sản phẩm")
                  return
                }

                if (reviewContent.trim().length === 0) {
                  alert("Vui lòng nhập nội dung đánh giá")
                  return
                }

                setIsSubmitting(true)
                try {
                  const tokenString = String(token || "").trim()
                  const response = await fetch(`/api/products/${productId}/reviews`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "x-user-id": tokenString,
                    },
                    body: JSON.stringify({
                      rating: reviewRating,
                      content: reviewContent.trim(),
                    }),
                  })

                  const data = await response.json()

                  if (!response.ok) {
                    throw new Error(data.error || "Không thể gửi đánh giá")
                  }

                  alert("Cảm ơn bạn đã đánh giá sản phẩm!")
                  setShowReviewForm(false)
                  setReviewRating(5)
                  setReviewContent("")
                  // Reload page to show new review
                  window.location.reload()
                } catch (error: any) {
                  alert(error?.message || "Có lỗi xảy ra khi gửi đánh giá")
                } finally {
                  setIsSubmitting(false)
                }
              }}
              disabled={isSubmitting || reviewContent.trim().length === 0}
              className="w-full bg-primary hover:bg-primary-dark text-white"
            >
              {isSubmitting ? "Đang gửi..." : "Gửi Đánh Giá"}
            </Button>
          </div>
        </div>
      )}
    </section>
  )
}

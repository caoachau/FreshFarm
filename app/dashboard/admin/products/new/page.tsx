"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { useAuth } from "@/hooks/use-auth"

export default function NewProductPage() {
  const router = useRouter()
  const { token } = useAuth()
  const { data: categories } = useSWR("/api/categories", fetcher)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    discount: "0",
    image: "",
    images: [] as string[],
    stock: "100",
    categoryId: "",
    variety: "",
    season: "",
    certification: "",
    status: "APPROVED",
  })
  const [imageUrl, setImageUrl] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const tokenString = String(token || "").trim()
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": tokenString,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
          discount: parseInt(formData.discount),
          stock: parseInt(formData.stock),
          images: formData.images.length > 0 ? formData.images : [formData.image],
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Không thể tạo sản phẩm")
      }

      alert("Đã tạo sản phẩm thành công!")
      router.push("/dashboard/admin/products")
    } catch (error: any) {
      console.error("Error creating product:", error)
      setError(error.message || "Có lỗi xảy ra khi tạo sản phẩm")
    } finally {
      setIsSubmitting(false)
    }
  }

  const addImage = () => {
    if (imageUrl && !formData.images.includes(imageUrl)) {
      setFormData({ ...formData, images: [...formData.images, imageUrl] })
      setImageUrl("")
    }
  }

  const removeImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Thêm Sản Phẩm Mới</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6 border border-border space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Tên Sản Phẩm *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Mô Tả *</label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Giá Bán (₫) *</label>
            <input
              type="number"
              required
              min="0"
              step="1000"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Giá Gốc (₫)</label>
            <input
              type="number"
              min="0"
              step="1000"
              value={formData.originalPrice}
              onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Giảm Giá (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={formData.discount}
              onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Tồn Kho *</label>
            <input
              type="number"
              required
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Danh Mục *</label>
          <select
            required
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
          >
            <option value="">Chọn danh mục</option>
            {categories?.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Giống</label>
            <input
              type="text"
              value={formData.variety}
              onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
              placeholder="VD: Giống F1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Mùa Vụ</label>
            <input
              type="text"
              value={formData.season}
              onChange={(e) => setFormData({ ...formData, season: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
              placeholder="VD: Vụ Đông Xuân"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Chứng Nhận</label>
            <input
              type="text"
              value={formData.certification}
              onChange={(e) => setFormData({ ...formData, certification: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
              placeholder="VD: VietGAP, Organic"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Trạng Thái</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
          >
            <option value="APPROVED">Đã Duyệt</option>
            <option value="PENDING">Chờ Duyệt</option>
            <option value="REJECTED">Từ Chối</option>
            <option value="HIDDEN">Ẩn</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Hình Ảnh Chính *</label>
          <input
            type="url"
            required
            value={formData.image}
            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
            placeholder="URL hình ảnh"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Thêm Hình Ảnh Phụ</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="flex-1 px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
              placeholder="URL hình ảnh"
            />
            <Button type="button" onClick={addImage} variant="outline">
              Thêm
            </Button>
          </div>
          {formData.images.length > 0 && (
            <div className="mt-2 flex gap-2 flex-wrap">
              {formData.images.map((img, idx) => (
                <span key={idx} className="px-2 py-1 bg-neutral-100 rounded text-sm flex items-center gap-2">
                  {img.substring(0, 30)}...
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="text-red-600 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button 
            type="submit" 
            className="bg-primary hover:bg-primary-dark text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang tạo..." : "Tạo Sản Phẩm"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Hủy
          </Button>
        </div>
      </form>
    </div>
  )
}


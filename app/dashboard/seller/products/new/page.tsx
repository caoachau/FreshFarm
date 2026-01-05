"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"

export default function NewProductPage() {
  const router = useRouter()
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
  })
  const [imageUrl, setImageUrl] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/seller/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
          discount: parseInt(formData.discount),
          stock: parseInt(formData.stock),
          images: formData.images.length > 0 ? formData.images : [formData.image],
        }),
      })

      if (response.ok) {
        router.push("/dashboard/seller/products")
      }
    } catch (error) {
      console.error("Error creating product:", error)
    }
  }

  const addImage = () => {
    if (imageUrl && !formData.images.includes(imageUrl)) {
      setFormData({ ...formData, images: [...formData.images, imageUrl] })
      setImageUrl("")
    }
  }

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Thêm Sản Phẩm Mới</h1>

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
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Giá Gốc (₫)</label>
            <input
              type="number"
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
                <span key={idx} className="px-2 py-1 bg-neutral-100 rounded text-sm">
                  {img.substring(0, 30)}...
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button type="submit" className="bg-primary hover:bg-primary-dark">
            Tạo Sản Phẩm
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


"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, CheckCircle, XCircle, Calendar } from "lucide-react"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export default function AdminCouponsPage() {
  const { token } = useAuth()
  const { data: coupons, mutate } = useSWR("/api/admin/coupons", fetcher)
  const [showForm, setShowForm] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<any>(null)
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    type: "PERCENTAGE" as "PERCENTAGE" | "FIXED",
    value: "" as string | number,
    minOrderValue: "",
    maxDiscount: "",
    usageLimit: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE" | "EXPIRED",
    startDate: "",
    endDate: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "value" || name === "minOrderValue" || name === "maxDiscount" || name === "usageLimit"
        ? value === "" ? "" : Number(value)
        : value,
    }))
  }

  const handleEdit = (coupon: any) => {
    setEditingCoupon(coupon)
      setFormData({
        code: coupon.code,
        name: coupon.name,
        description: coupon.description || "",
        type: coupon.type,
        value: coupon.value,
        minOrderValue: coupon.minOrderValue || "",
        maxDiscount: coupon.maxDiscount || "",
        usageLimit: coupon.usageLimit || "",
        status: coupon.status,
        startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split("T")[0] : "",
        endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().split("T")[0] : "",
      })
    setShowForm(true)
  }

  const handleDelete = async (couponId: string) => {
    if (!confirm("Bạn có chắc muốn xóa mã giảm giá này?")) return

    try {
      const tokenString = String(token || "").trim()
      const response = await fetch(`/api/admin/coupons/${couponId}`, {
        method: "DELETE",
        headers: {
          "x-user-id": tokenString,
        },
      })

      if (response.ok) {
        alert("Đã xóa mã giảm giá thành công")
        mutate()
      } else {
        const error = await response.json()
        alert(error.error || "Không thể xóa mã giảm giá")
      }
    } catch (error) {
      console.error("Error deleting coupon:", error)
      alert("Có lỗi xảy ra khi xóa mã giảm giá")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    // Validate required fields
    if (!formData.code || !formData.name || formData.value === "" || formData.value === null || formData.value === undefined) {
      setError("Vui lòng điền đầy đủ các trường bắt buộc: Mã, Tên, và Giá trị")
      setIsSubmitting(false)
      return
    }

    const numValue = Number(formData.value)
    if (isNaN(numValue)) {
      setError("Giá trị phải là một số hợp lệ")
      setIsSubmitting(false)
      return
    }

    if (formData.type === "PERCENTAGE" && (numValue < 0 || numValue > 100)) {
      setError("Giá trị phần trăm phải từ 0 đến 100")
      setIsSubmitting(false)
      return
    }

    if (formData.type === "FIXED" && numValue <= 0) {
      setError("Giá trị số tiền phải lớn hơn 0")
      setIsSubmitting(false)
      return
    }

    try {
      const tokenString = String(token || "").trim()
      const url = editingCoupon
        ? `/api/admin/coupons/${editingCoupon.id}`
        : "/api/admin/coupons"
      const method = editingCoupon ? "PATCH" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-user-id": tokenString,
        },
        body: JSON.stringify({
          ...formData,
          value: numValue,
          minOrderValue: (formData.minOrderValue === "" || formData.minOrderValue === 0 || !formData.minOrderValue)
            ? null 
            : Number(formData.minOrderValue) > 0 
              ? Number(formData.minOrderValue) 
              : null,
          maxDiscount: (formData.maxDiscount === "" || formData.maxDiscount === 0 || !formData.maxDiscount)
            ? null
            : Number(formData.maxDiscount) > 0
              ? Number(formData.maxDiscount)
              : null,
          usageLimit: (formData.usageLimit === "" || formData.usageLimit === 0 || !formData.usageLimit)
            ? null
            : Number(formData.usageLimit) > 0
              ? Number(formData.usageLimit)
              : null,
          startDate: formData.startDate ? formData.startDate : null,
          endDate: formData.endDate ? formData.endDate : null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `Không thể lưu mã giảm giá (${response.status})`)
      }

      alert(editingCoupon ? "Đã cập nhật mã giảm giá thành công" : "Đã tạo mã giảm giá thành công")
      setShowForm(false)
      setEditingCoupon(null)
      setFormData({
        code: "",
        name: "",
        description: "",
        type: "PERCENTAGE",
        value: "",
        minOrderValue: "",
        maxDiscount: "",
        usageLimit: "",
        status: "ACTIVE",
        startDate: "",
        endDate: "",
      })
      mutate()
    } catch (error: any) {
      console.error("Error saving coupon:", error)
      const errorMessage = error.message || "Có lỗi xảy ra khi lưu mã giảm giá"
      setError(errorMessage)
      alert(errorMessage) // Hiển thị alert để user thấy lỗi rõ hơn
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingCoupon(null)
    setFormData({
      code: "",
      name: "",
      description: "",
      type: "PERCENTAGE",
      value: "",
      minOrderValue: "",
      maxDiscount: "",
      usageLimit: "",
      status: "ACTIVE",
      startDate: "",
      endDate: "",
    })
    setError(null)
  }

  const isCouponExpired = (coupon: any) => {
    if (!coupon.endDate) return false
    return new Date() > new Date(coupon.endDate)
  }

  const isCouponActive = (coupon: any) => {
    if (coupon.status !== "ACTIVE") return false
    if (isCouponExpired(coupon)) return false
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) return false
    return true
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Quản Lý Mã Giảm Giá</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="bg-primary hover:bg-primary-dark text-white">
            <Plus size={16} className="mr-2" />
            Tạo Mã Mới
          </Button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-border rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">
            {editingCoupon ? "Chỉnh Sửa Mã Giảm Giá" : "Tạo Mã Giảm Giá Mới"}
          </h2>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Mã Giảm Giá *</label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  required
                  disabled={!!editingCoupon}
                  className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
                  placeholder="VD: SAVE10"
                />
                {editingCoupon && (
                  <p className="text-xs text-neutral-500 mt-1">Không thể thay đổi mã sau khi tạo</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Tên Mã *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
                  placeholder="VD: Giảm 10%"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Mô Tả</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={2}
                  className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary resize-none"
                  placeholder="Mô tả về mã giảm giá..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Loại *</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
                >
                  <option value="PERCENTAGE">Phần Trăm (%)</option>
                  <option value="FIXED">Số Tiền Cố Định (₫)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Giá Trị * ({formData.type === "PERCENTAGE" ? "%" : "₫"})
                </label>
                <input
                  type="number"
                  name="value"
                  value={formData.value}
                  onChange={handleInputChange}
                  required
                  min={formData.type === "PERCENTAGE" ? 0 : 1}
                  max={formData.type === "PERCENTAGE" ? 100 : undefined}
                  step={formData.type === "PERCENTAGE" ? 0.01 : 1000}
                  className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
                />
              </div>

              {formData.type === "PERCENTAGE" && (
                <div>
                  <label className="block text-sm font-medium mb-1">Giảm Tối Đa (₫)</label>
                  <input
                    type="number"
                    name="maxDiscount"
                    value={formData.maxDiscount}
                    onChange={handleInputChange}
                    min={0}
                    step={1000}
                    className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
                    placeholder="Để trống = không giới hạn"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Đơn Hàng Tối Thiểu (₫)</label>
                <input
                  type="number"
                  name="minOrderValue"
                  value={formData.minOrderValue}
                  onChange={handleInputChange}
                  min={0}
                  step={1000}
                  className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
                  placeholder="Để trống = không yêu cầu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Số Lần Sử Dụng Tối Đa</label>
                <input
                  type="number"
                  name="usageLimit"
                  value={formData.usageLimit}
                  onChange={handleInputChange}
                  min={0}
                  className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
                  placeholder="Để trống = không giới hạn"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Trạng Thái</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
                >
                  <option value="ACTIVE">Hoạt Động</option>
                  <option value="INACTIVE">Không Hoạt Động</option>
                  <option value="EXPIRED">Hết Hạn</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ngày Bắt Đầu</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ngày Kết Thúc</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary hover:bg-primary-dark text-white"
              >
                {isSubmitting ? "Đang lưu..." : editingCoupon ? "Cập Nhật" : "Tạo Mã"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel}>
                Hủy
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons List */}
      <div className="bg-white border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700">Mã</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700">Tên</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700">Loại</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700">Giá Trị</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700">Đã Dùng</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700">Trạng Thái</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-neutral-700">Thao Tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {coupons?.map((coupon: any) => (
              <tr key={coupon.id} className="hover:bg-neutral-50">
                <td className="px-6 py-4">
                  <span className="font-mono font-bold text-primary">{coupon.code}</span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium">{coupon.name}</p>
                    {coupon.description && (
                      <p className="text-xs text-neutral-500">{coupon.description}</p>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-700">
                    {coupon.type === "PERCENTAGE" ? "Phần Trăm" : "Số Tiền"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="font-medium">
                    {coupon.type === "PERCENTAGE" ? `${coupon.value}%` : `${coupon.value.toLocaleString()}₫`}
                  </span>
                  {coupon.type === "PERCENTAGE" && coupon.maxDiscount && (
                    <p className="text-xs text-neutral-500">
                      Tối đa: {coupon.maxDiscount.toLocaleString()}₫
                    </p>
                  )}
                  {coupon.minOrderValue > 0 && (
                    <p className="text-xs text-neutral-500">
                      Tối thiểu: {coupon.minOrderValue.toLocaleString()}₫
                    </p>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm">
                    {coupon.usedCount} / {coupon.usageLimit || "∞"}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        isCouponActive(coupon)
                          ? "bg-green-100 text-green-700"
                          : coupon.status === "INACTIVE"
                          ? "bg-gray-100 text-gray-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {isCouponActive(coupon) ? (
                        <span className="flex items-center gap-1">
                          <CheckCircle size={12} />
                          Hoạt Động
                        </span>
                      ) : coupon.status === "INACTIVE" ? (
                        "Không Hoạt Động"
                      ) : (
                        "Hết Hiệu Lực"
                      )}
                    </span>
                    {coupon.startDate || coupon.endDate ? (
                      <p className="text-xs text-neutral-500">
                        {coupon.startDate && (
                          <span>Từ: {new Date(coupon.startDate).toLocaleDateString("vi-VN")}</span>
                        )}
                        {coupon.startDate && coupon.endDate && " • "}
                        {coupon.endDate && (
                          <span>Đến: {new Date(coupon.endDate).toLocaleDateString("vi-VN")}</span>
                        )}
                      </p>
                    ) : null}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(coupon)}
                    >
                      <Edit size={16} className="mr-1" />
                      Sửa
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(coupon.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} className="mr-1" />
                      Xóa
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!coupons || coupons.length === 0) && (
          <div className="text-center py-12 text-neutral-600">
            Chưa có mã giảm giá nào. Hãy tạo mã mới!
          </div>
        )}
      </div>
    </div>
  )
}


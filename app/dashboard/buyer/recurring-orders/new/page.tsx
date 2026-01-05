"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Plus, X, Calendar, ShoppingCart } from "lucide-react"
import useSWR from "swr"
import { fetcher, authenticatedFetcher } from "@/lib/fetcher"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

interface SelectedProduct {
  productId: string
  product: any
  quantity: number
  deliveryDate: string
}

export default function NewRecurringOrderPage() {
  const router = useRouter()
  const { token, user, isAuthenticated } = useAuth()
  const { data: products } = useSWR("/api/products?limit=100", fetcher)
  const { data: addresses } = useSWR(
    isAuthenticated && token ? ["/api/user/addresses", token] : null,
    ([url, token]) => authenticatedFetcher(url, token)
  )

  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([])
  const [shippingAddress, setShippingAddress] = useState("")
  const [phone, setPhone] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user?.phone) {
      setPhone(user.phone)
    }
    if (addresses && addresses.length > 0) {
      const defaultAddress = addresses.find((addr: any) => addr.isDefault) || addresses[0]
      if (defaultAddress) {
        setShippingAddress(
          `${defaultAddress.street}, ${defaultAddress.ward}, ${defaultAddress.district}, ${defaultAddress.city}`
        )
        setPhone(defaultAddress.phone)
      }
    }
  }, [user, addresses])

  const handleAddProduct = () => {
    if (products?.products && products.products.length > 0) {
      const firstProduct = products.products[0]
      setSelectedProducts([
        ...selectedProducts,
        {
          productId: firstProduct.id,
          product: firstProduct,
          quantity: 1,
          deliveryDate: new Date().toISOString().split("T")[0],
        },
      ])
    }
  }

  const handleRemoveProduct = (index: number) => {
    setSelectedProducts(selectedProducts.filter((_, i) => i !== index))
  }

  const handleProductChange = (index: number, field: string, value: any) => {
    const updated = [...selectedProducts]
    if (field === "productId") {
      const product = products?.products?.find((p: any) => p.id === value)
      updated[index] = {
        ...updated[index],
        productId: value,
        product: product,
      }
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value,
      }
    }
    setSelectedProducts(updated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedProducts.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm")
      return
    }

    if (!shippingAddress || !phone) {
      alert("Vui lòng điền đầy đủ thông tin giao hàng")
      return
    }

    setIsSubmitting(true)
    try {
      const tokenString = String(token || "").trim()
      const response = await fetch("/api/recurring-orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": tokenString,
        },
        body: JSON.stringify({
          items: selectedProducts.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            deliveryDate: item.deliveryDate,
          })),
          shippingAddress,
          phone,
          notes,
        }),
      })

      if (response.ok) {
        router.push("/dashboard/buyer/recurring-orders")
      } else {
        let error: any = {}
        try {
          error = await response.json()
        } catch (e) {
          // Nếu không parse được JSON, dùng error mặc định
          error = { error: `Server error: ${response.status} ${response.statusText}` }
        }
        
        console.error("API Error:", error)
        
        // Hiển thị error message chi tiết
        let errorMessage = error.error || "Không thể tạo đơn hàng định kỳ"
        if (error.details) {
          errorMessage += `\n\nChi tiết: ${error.details}`
        }
        
        // Nếu là lỗi về database schema
        if (error.error?.includes("Database schema not updated") || error.error?.includes("recurringOrder")) {
          errorMessage = "Lỗi: Database chưa được cập nhật.\n\nVui lòng chạy:\nnpm run db:generate && npm run db:push\n\nSau đó restart server và thử lại."
        }
        
        alert(errorMessage)
      }
    } catch (error: any) {
      console.error("Error creating recurring order:", error)
      alert(`Có lỗi xảy ra khi tạo đơn hàng định kỳ: ${error.message || "Unknown error"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const totalAmount = selectedProducts.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  )

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Tạo Đơn Hàng Định Kỳ</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Shipping Info */}
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-xl font-bold mb-4">Thông Tin Giao Hàng</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Địa chỉ giao hàng *</label>
              <textarea
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                required
                className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
                rows={3}
                placeholder="Nhập địa chỉ giao hàng đầy đủ"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Số điện thoại *</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
                placeholder="Nhập số điện thoại"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Ghi chú (tùy chọn)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
                rows={2}
                placeholder="Ghi chú cho đơn hàng"
              />
            </div>
          </div>
        </div>

        {/* Products Selection */}
        <div className="bg-white rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Sản Phẩm và Lịch Giao</h2>
            <Button type="button" onClick={handleAddProduct} variant="outline">
              <Plus size={20} className="mr-2" />
              Thêm Sản Phẩm
            </Button>
          </div>

          <div className="space-y-4">
            {selectedProducts.map((item, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-start gap-4">
                  <img
                    src={item.product?.image || "/placeholder.svg"}
                    alt={item.product?.name}
                    className="w-20 h-20 rounded object-cover"
                  />
                  <div className="flex-1 space-y-3">
                    <div>
                      <label className="block text-sm font-medium mb-2">Sản phẩm *</label>
                      <select
                        value={item.productId}
                        onChange={(e) => handleProductChange(index, "productId", e.target.value)}
                        required
                        className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
                      >
                        <option value="">Chọn sản phẩm</option>
                        {products?.products?.map((product: any) => (
                          <option key={product.id} value={product.id}>
                            {product.name} - {product.price.toLocaleString()}₫
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Số lượng *</label>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) =>
                            handleProductChange(index, "quantity", Number.parseInt(e.target.value) || 1)
                          }
                          required
                          className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Ngày giao *</label>
                        <input
                          type="date"
                          value={item.deliveryDate}
                          onChange={(e) => handleProductChange(index, "deliveryDate", e.target.value)}
                          required
                          min={new Date().toISOString().split("T")[0]}
                          className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                    {item.product && (
                      <div className="text-sm text-neutral-600">
                        Giá: {item.product.price.toLocaleString()}₫ x {item.quantity} ={" "}
                        {(item.product.price * item.quantity).toLocaleString()}₫
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveProduct(index)}
                    className="text-red-600"
                  >
                    <X size={16} />
                  </Button>
                </div>
              </div>
            ))}

            {selectedProducts.length === 0 && (
              <div className="text-center py-8 text-neutral-600">
                <ShoppingCart size={48} className="mx-auto text-neutral-300 mb-4" />
                <p>Chưa có sản phẩm nào. Nhấn "Thêm Sản Phẩm" để bắt đầu.</p>
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        {selectedProducts.length > 0 && (
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">Tổng cộng:</span>
              <span className="text-2xl font-bold text-primary">{totalAmount.toLocaleString()}₫</span>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || selectedProducts.length === 0}
            className="flex-1 bg-primary hover:bg-primary-dark"
          >
            {isSubmitting ? "Đang tạo..." : "Tạo Đơn Hàng Định Kỳ"}
          </Button>
        </div>
      </form>
    </div>
  )
}


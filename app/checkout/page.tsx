"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Check } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"

interface CartItemWithProduct {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    image: string
  }
}

export default function CheckoutPage() {
  const { items, clearCart, isLoaded } = useCart()
  const { token, isAuthenticated } = useAuth()
  const [step, setStep] = useState<"shipping" | "payment" | "confirm">("shipping")
  const [useSavedInfo, setUseSavedInfo] = useState(false)
  const [userInfo, setUserInfo] = useState<{ 
    fullName?: string
    phone?: string
    address?: {
      street: string
      ward: string
      district: string
      city: string
    }
  } | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    ward: "",
    district: "",
    city: "TP. Hồ Chí Minh",
  })
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "vietqr">("cod")
  const [coupon, setCoupon] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [vietqrImage, setVietqrImage] = useState<string | null>(null)
  const [qrScanned, setQrScanned] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)

  const cartWithDetails = (items as CartItemWithProduct[])
    .filter((item) => item.product)

  const subtotal = cartWithDetails.reduce((sum: number, item: CartItemWithProduct) => sum + item.product.price * item.quantity, 0)
  const shipping = 30000
  const total = subtotal + shipping

  // Fetch user info and addresses when authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      const tokenString = String(token).trim()
      
      // Fetch user info
      fetch("/api/auth/me", {
        headers: {
          "x-user-id": tokenString,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.fullName || data.phone) {
            const defaultAddress = data.addresses && data.addresses.length > 0 ? data.addresses[0] : null
            
            setUserInfo({
              fullName: data.fullName || "",
              phone: data.phone || "",
              address: defaultAddress ? {
                street: defaultAddress.street || "",
                ward: defaultAddress.ward || "",
                district: defaultAddress.district || "",
                city: defaultAddress.city || "",
              } : undefined,
            })
            
            // Auto-fill if user has saved info and useSavedInfo is true
            if (useSavedInfo) {
              setFormData((prev) => ({
                ...prev,
                name: data.fullName || prev.name,
                phone: data.phone || prev.phone,
                address: defaultAddress?.street || prev.address,
                ward: defaultAddress?.ward || prev.ward,
                district: defaultAddress?.district || prev.district,
                city: defaultAddress?.city || prev.city,
              }))
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching user info:", error)
        })
    }
  }, [isAuthenticated, token])
  
  // Auto-fill when useSavedInfo changes
  useEffect(() => {
    if (useSavedInfo && userInfo) {
      setFormData((prev) => ({
        ...prev,
        name: userInfo.fullName || prev.name,
        phone: userInfo.phone || prev.phone,
        address: userInfo.address?.street || prev.address,
        ward: userInfo.address?.ward || prev.ward,
        district: userInfo.address?.district || prev.district,
        city: userInfo.address?.city || prev.city,
      }))
    }
  }, [useSavedInfo, userInfo])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleApplyCoupon = () => {
    if (!coupon.trim()) {
      alert("Vui lòng nhập mã giảm giá")
      return
    }
    alert("Tính năng mã giảm giá đang được phát triển. Vui lòng quay lại sau!")
    setCoupon("")
  }
  const validateShipping = () => {
    if (!formData.name || !formData.phone || !formData.address || !formData.ward || !formData.district || !formData.city) {
      setErrorMessage("Vui lòng nhập đầy đủ thông tin giao hàng (họ tên, SĐT, địa chỉ, phường/xã, quận/huyện, tỉnh/thành).")
      return false
    }
    setErrorMessage(null)
    return true
  }

  const handleGenerateVietQR = async () => {
    try {
      const res = await fetch("/api/payments/qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          addInfo: `THANH TOAN DON HANG - ${formData.phone || formData.name || ""}`.slice(0, 60),
        }),
      })
      if (!res.ok) return
      const data = await res.json()
      if (data.qrImage) {
        setVietqrImage(data.qrImage)
      }
    } catch (error) {
      console.error("Error generating VietQR:", error)
    }
  }

  const handleCompleteOrder = async () => {
    if (!isAuthenticated || !token) {
      setErrorMessage("Vui lòng đăng nhập trước khi đặt hàng.")
      return
    }

    if (!validateShipping()) return

    // Validate QR scan for VietQR payment
    if (paymentMethod === "vietqr" && !qrScanned) {
      setErrorMessage("Vui lòng quét mã QR và chuyển khoản trước khi hoàn thành đơn hàng.")
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const shippingAddress = `${formData.address}, ${formData.ward}, ${formData.district}, ${formData.city}`
      const orderItems = cartWithDetails.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.product.price,
      }))

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": token,
        },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress,
          phone: formData.phone,
          paymentMethod: paymentMethod === "vietqr" ? "VIETQR" : "COD",
          discount: 0,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || "Không thể tạo đơn hàng, vui lòng thử lại.")
      }

      const orderData = await res.json()
      setOrderId(orderData.id)

      // Save address if user is authenticated and wants to save
      if (isAuthenticated && token && !useSavedInfo) {
        try {
          const tokenString = String(token).trim()
          await fetch("/api/user/addresses", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-user-id": tokenString,
            },
            body: JSON.stringify({
              fullName: formData.name,
              phone: formData.phone,
              street: formData.address,
              ward: formData.ward,
              district: formData.district,
              city: formData.city,
              isDefault: true, // Set as default address
            }),
          })
        } catch (error) {
          console.error("Error saving address:", error)
          // Don't fail the order if address save fails
        }
      }

      clearCart()
      setStep("confirm")
    } catch (error: any) {
      console.error("Error creating order:", error)
      setErrorMessage(error.message || "Có lỗi xảy ra khi tạo đơn hàng.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full">
      <h1 className="text-3xl font-bold mb-8">Thanh Toán</h1>

      {!isLoaded ? (
        <div>Đang tải...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Progress steps */}
            <div className="flex items-center mb-8">
              {(["shipping", "payment", "confirm"] as const).map((s, index) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${
                      s === step
                        ? "bg-primary text-white"
                        : step === "confirm" || ["shipping", "payment"].indexOf(step) >= index
                          ? "bg-primary text-white"
                          : "bg-neutral-200 text-neutral-600"
                    }`}
                  >
                    {["shipping", "payment", "confirm"].indexOf(step) > index ? <Check size={20} /> : index + 1}
                  </div>
                  <div className="ml-3">
                    <p className="font-bold">
                      {s === "shipping" && "Địa Chỉ Giao Hàng"}
                      {s === "payment" && "Phương Thức Thanh Toán"}
                      {s === "confirm" && "Xác Nhận"}
                    </p>
                  </div>
                  {index < 2 && <div className="h-1 w-12 mx-4 bg-neutral-200" />}
                </div>
              ))}
            </div>

            {/* Shipping info step */}
            {step === "shipping" && (
              <div className="bg-white border border-border rounded-lg p-6 space-y-4">
                <h2 className="font-bold text-lg">Thông Tin Giao Hàng</h2>

                {errorMessage && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
                    {errorMessage}
                  </p>
                )}

                {/* Option to use saved info or enter new */}
                {isAuthenticated && userInfo && (userInfo.fullName || userInfo.phone || userInfo.address) && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        checked={useSavedInfo}
                        onChange={(e) => {
                          setUseSavedInfo(e.target.checked)
                        }}
                        className="cursor-pointer"
                      />
                      <div>
                        <p className="font-medium">Sử dụng thông tin từ tài khoản</p>
                        <p className="text-sm text-neutral-600">
                          {userInfo.fullName && `Tên: ${userInfo.fullName}`}
                          {userInfo.fullName && userInfo.phone && " • "}
                          {userInfo.phone && `SĐT: ${userInfo.phone}`}
                          {userInfo.address && (
                            <>
                              <br />
                              Địa chỉ: {userInfo.address.street}, {userInfo.address.ward}, {userInfo.address.district}, {userInfo.address.city}
                            </>
                          )}
                        </p>
                      </div>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer mt-3">
                      <input
                        type="radio"
                        checked={!useSavedInfo}
                        onChange={(e) => {
                          setUseSavedInfo(!e.target.checked)
                          // Clear form when switching to new info
                          if (e.target.checked) {
                            setFormData({
                              name: "",
                              phone: "",
                              address: "",
                              ward: "",
                              district: "",
                              city: "TP. Hồ Chí Minh",
                            })
                          }
                        }}
                        className="cursor-pointer"
                      />
                      <div>
                        <p className="font-medium">Nhập thông tin mới</p>
                        <p className="text-sm text-neutral-600">Điền thông tin giao hàng khác</p>
                      </div>
                    </label>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Họ và tên"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-border rounded-lg outline-none focus:border-primary transition"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Số điện thoại"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-border rounded-lg outline-none focus:border-primary transition"
                  />
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-border rounded-lg outline-none focus:border-primary transition"
                  >
                    <option>TP. Hồ Chí Minh</option>
                    <option>Hà Nội</option>
                    <option>Đà Nẵng</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="district"
                    placeholder="Quận/Huyện"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-border rounded-lg outline-none focus:border-primary transition"
                  />
                  <input
                    type="text"
                    name="ward"
                    placeholder="Phường/Xã"
                    value={formData.ward}
                    onChange={handleInputChange}
                    className="px-4 py-2 border border-border rounded-lg outline-none focus:border-primary transition"
                  />
                </div>

                <textarea
                  name="address"
                  placeholder="Số nhà, tên đường"
                  value={formData.address}
                  onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary transition resize-none"
                />

                <Button
                  onClick={() => {
                    if (validateShipping()) {
                      setStep("payment")
                    }
                  }}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-3 font-bold"
                >
                  Tiếp Tục
                </Button>
              </div>
            )}

            {/* Payment step */}
            {step === "payment" && (
              <div className="bg-white border border-border rounded-lg p-6 space-y-4">
                <h2 className="font-bold text-lg">Phương Thức Thanh Toán</h2>
                {errorMessage && (
                  <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2">
                    {errorMessage}
                  </p>
                )}

                <div className="space-y-3">
                  <label
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                      paymentMethod === "cod"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-neutral-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value as any)}
                      className="mr-3 cursor-pointer"
                    />
                    <span className="ml-2">
                      🚚 Thanh toán khi nhận hàng (COD)
                    </span>
                  </label>

                  <label
                    className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                      paymentMethod === "vietqr"
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-neutral-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="vietqr"
                      checked={paymentMethod === "vietqr"}
                      onChange={(e) => {
                        setPaymentMethod(e.target.value as any)
                        setQrScanned(false) // Reset QR scan status when switching payment method
                        if (e.target.value === "vietqr") {
                          handleGenerateVietQR()
                        }
                      }}
                      className="mr-3 cursor-pointer"
                    />
                    <span className="ml-2">
                      🧾 Thanh toán qua VietQR (chuyển khoản nhanh)
                    </span>
                  </label>
                </div>

                {paymentMethod === "vietqr" && (
                  <div className="mt-4 border border-dashed border-primary rounded-lg p-4 text-center space-y-3">
                    <p className="font-medium">Quét mã VietQR để thanh toán</p>
                    {vietqrImage ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={vietqrImage}
                          alt="VietQR"
                          className="mx-auto max-h-64"
                        />
                        <p className="text-xs text-neutral-500">
                          Nội dung chuyển khoản: <strong>THANH TOAN DON HANG FRESHFARM</strong>
                        </p>
                        <div className="pt-3 border-t border-border">
                          <label className="flex items-center justify-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={qrScanned}
                              onChange={(e) => setQrScanned(e.target.checked)}
                              className="cursor-pointer w-4 h-4"
                            />
                            <span className="text-sm">
                              Tôi đã quét mã và chuyển khoản thành công
                            </span>
                          </label>
                          {!qrScanned && (
                            <p className="text-xs text-red-600 mt-2">
                              Vui lòng quét mã và chuyển khoản trước khi hoàn thành đơn hàng
                            </p>
                          )}
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-neutral-600">
                        Đang tạo mã VietQR, vui lòng chờ trong giây lát...
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button onClick={() => setStep("shipping")} variant="outline" className="flex-1 py-3 font-bold">
                    Quay Lại
                  </Button>
                  <Button
                    onClick={handleCompleteOrder}
                    className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 font-bold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Đang tạo đơn hàng..." : "Hoàn Thành Đơn Hàng"}
                  </Button>
                </div>
              </div>
            )}

            {/* Confirm step */}
            {step === "confirm" && (
              <div className="text-center py-12 bg-white border border-border rounded-lg">
                <div className="text-6xl mb-4">✓</div>
                <h2 className="text-2xl font-bold mb-2">Đơn Hàng Của Bạn Đã Được Tạo!</h2>
                <p className="text-neutral-600 mb-6">
                  Cảm ơn bạn đã mua sắm. Bạn sẽ nhận được email xác nhận trong vài phút.
                </p>
                <div className="flex gap-4 justify-center">
                  {orderId && (
                    <Link href={`/dashboard/buyer/orders/${orderId}`}>
                      <Button className="bg-primary hover:bg-primary-dark text-white">Xem Chi Tiết Đơn Hàng</Button>
                    </Link>
                  )}
                  <Link href="/dashboard/buyer/orders">
                    <Button variant="outline" className="bg-transparent">Xem Tất Cả Đơn Hàng</Button>
                  </Link>
                  <Link href="/">
                    <Button variant="outline" className="bg-transparent">Quay Lại Trang Chủ</Button>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-border rounded-lg p-6 space-y-4 sticky top-24">
              <h2 className="font-bold text-lg">Tóm Tắt Đơn Hàng</h2>

              {/* Items list */}
              <div className="space-y-2 max-h-64 overflow-y-auto border-b border-border pb-4">
                {cartWithDetails.map((item: CartItemWithProduct) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="line-clamp-1">
                      {item.product?.name} x {item.quantity}
                    </span>
                    <span className="font-bold flex-shrink-0">
                      {(item.product.price * item.quantity).toLocaleString()}₫
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon */}
              {step !== "confirm" && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Mã giảm giá"
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    className="flex-1 px-3 py-2 border border-border rounded outline-none focus:border-primary transition text-sm"
                  />
                  <Button onClick={handleApplyCoupon} variant="outline" className="px-3 py-2 text-sm bg-transparent">
                    Áp Dụng
                  </Button>
                </div>
              )}


              {/* Summary */}
              <div className="space-y-2 text-sm border-b border-border pb-4">
                <div className="flex justify-between">
                  <span>Tạm tính:</span>
                  <span>{subtotal.toLocaleString()}₫</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí giao hàng:</span>
                  <span>{shipping.toLocaleString()}₫</span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between text-lg font-bold text-primary">
                <span>Tổng cộng:</span>
                <span>{total.toLocaleString()}₫</span>
              </div>

              {/* Checkout button */}
              {step !== "confirm" && (
                <Button
                  onClick={handleCompleteOrder}
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-3 font-bold"
                >
                  {step === "payment"
                    ? isSubmitting
                      ? "Đang tạo đơn hàng..."
                      : "Hoàn Thành Đơn Hàng"
                    : "Tiếp Tục"}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

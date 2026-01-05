"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { X, ShoppingCart, Minus, Plus, Trash2 } from "lucide-react"
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

interface CartSidebarProps {
  isOpen: boolean
  onClose: () => void
  cartItems: CartItemWithProduct[]
}

export default function CartSidebar({ isOpen, onClose, cartItems }: CartSidebarProps) {
  const [cartWithDetails, setCartWithDetails] = useState<CartItemWithProduct[]>([])

  useEffect(() => {
    const details = cartItems.filter((item) => item.product)
    setCartWithDetails(details)
  }, [cartItems])

  const subtotal = cartWithDetails.reduce((sum: number, item: CartItemWithProduct) => sum + item.product.price * item.quantity, 0)
  const shipping = subtotal > 300000 ? 0 : 30000
  const total = subtotal + shipping

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 transition" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg z-50 transition-transform duration-300 overflow-y-auto ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} />
            <h2 className="font-bold text-lg">Giỏ Hàng ({cartItems.length})</h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-neutral-100 rounded transition">
            <X size={20} />
          </button>
        </div>

        {/* Cart items */}
        <div className="p-4 space-y-4 min-h-96">
          {cartWithDetails.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart size={48} className="mx-auto text-neutral-300 mb-4" />
              <p className="text-neutral-600 mb-4">Giỏ hàng của bạn còn trống</p>
              <Link href="/products" onClick={onClose} className="text-primary hover:text-primary-dark">
                Tiếp tục mua sắm
              </Link>
            </div>
          ) : (
            cartWithDetails.map((item: CartItemWithProduct) => (
              <div key={item.productId} className="border border-border rounded-lg p-3">
                <div className="flex gap-3 mb-3">
                  <img
                    src={item.product.image || "/placeholder.svg"}
                    alt={item.product.name}
                    className="w-16 h-16 rounded object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-bold text-sm line-clamp-2">{item.product.name}</p>
                    <p className="text-primary font-bold">{(item.product.price * item.quantity).toLocaleString()}₫</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-border rounded">
                    <button className="p-1 hover:bg-neutral-100">
                      <Minus size={14} />
                    </button>
                    <span className="px-2 py-1 text-sm font-bold">{item.quantity}</span>
                    <button className="p-1 hover:bg-neutral-100">
                      <Plus size={14} />
                    </button>
                  </div>
                  <button className="p-1 hover:bg-red-50 rounded transition">
                    <Trash2 size={16} className="text-red-500" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Summary and checkout */}
        {cartWithDetails.length > 0 && (
          <div className="sticky bottom-0 border-t border-border bg-white p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tạm tính:</span>
                <span>{subtotal.toLocaleString()}₫</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Phí giao hàng:</span>
                <span className={shipping === 0 ? "text-primary" : ""}>
                  {shipping === 0 ? "Miễn phí" : shipping.toLocaleString() + "₫"}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
                <span>Tổng cộng:</span>
                <span className="text-primary">{total.toLocaleString()}₫</span>
              </div>
            </div>

            <Link href="/checkout" onClick={onClose} className="block">
              <Button className="w-full bg-primary hover:bg-primary-dark text-white py-3 font-bold">Thanh Toán</Button>
            </Link>
            <button
              onClick={onClose}
              className="w-full py-3 border border-border rounded-lg hover:bg-neutral-100 transition font-medium"
            >
              Tiếp Tục Mua Sắm
            </button>
          </div>
        )}
      </div>
    </>
  )
}

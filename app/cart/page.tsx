"use client"

import { useEffect, useState, useMemo, useRef } from "react"
import Link from "next/link"
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"

interface CartItemWithProduct {
  id: string
  productId: string
  quantity: number
  product: {
    id: string
    name: string
    price: number
    image: string
    brand?: string
  }
}

const EMPTY_CART_ITEMS: CartItemWithProduct[] = [];

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, isLoaded } = useCart()
  const [cartWithDetails, setCartWithDetails] = useState<CartItemWithProduct[]>([])

  const filteredItems = useMemo(() => {
    if (!isLoaded || !Array.isArray(items)) return EMPTY_CART_ITEMS;
    return (items as CartItemWithProduct[]).filter((item) => item.product);
  }, [items, isLoaded]);

  const prevFilteredItemsRef = useRef<string>('');

  useEffect(() => {
    const currentItemsStr = JSON.stringify(filteredItems);
    const contentsChanged = currentItemsStr !== prevFilteredItemsRef.current;
    if (contentsChanged) {
      prevFilteredItemsRef.current = currentItemsStr;
      setCartWithDetails(filteredItems);
    }
  }, [filteredItems])

  if (!isLoaded) {
    return <div className="text-center py-12">Đang tải...</div>
  }

  const subtotal = cartWithDetails.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = subtotal > 300000 ? 0 : 30000
  const discount = subtotal * 0.05 // 5% loyalty discount
  const total = subtotal + shipping - discount

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Giỏ Hàng</h1>

      {cartWithDetails.length === 0 ? (
        <div className="text-center py-12 bg-neutral-50 rounded-lg">
          <ShoppingCart size={64} className="mx-auto text-neutral-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Giỏ hàng của bạn còn trống</h2>
          <p className="text-neutral-600 mb-6">Thêm các sản phẩm vào giỏ để tiếp tục</p>
          <Link href="/products">
            <Button className="bg-primary hover:bg-primary-dark text-white">Tiếp Tục Mua Sắm</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <div className="lg:col-span-2 space-y-4">
            {cartWithDetails.map((item) => (
              <div key={item.productId} className="bg-white border border-border rounded-lg p-4 flex gap-4">
                {/* Product image */}
                <Link href={`/products/${item.productId}`}>
                  <img
                    src={item.product.image || "/placeholder.svg"}
                    alt={item.product.name}
                    className="w-24 h-24 rounded object-cover hover:opacity-80 transition"
                  />
                </Link>

                {/* Product details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <Link href={`/products/${item.productId}`}>
                      <h3 className="font-bold hover:text-primary transition">{item.product.name}</h3>
                    </Link>
                    <p className="text-neutral-600 text-sm mt-1">{item.product.brand}</p>
                  </div>

                  <div className="flex items-center justify-between">
                    {/* Quantity */}
                    <div className="flex items-center border border-border rounded">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-neutral-100 transition"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="px-4 py-1 font-bold text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-neutral-100 transition"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="text-primary font-bold">{(item.product.price * item.quantity).toLocaleString()}₫</p>
                      <p className="text-xs text-neutral-500">
                        {item.product.price.toLocaleString()}₫ x {item.quantity}
                      </p>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 hover:bg-red-50 rounded transition"
                    >
                      <Trash2 size={18} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Continue shopping */}
            <Link href="/products">
              <Button variant="outline" className="w-full bg-transparent">
                Tiếp Tục Mua Sắm
              </Button>
            </Link>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-border rounded-lg p-6 space-y-4 sticky top-24">
              <h2 className="font-bold text-lg">Tóm Tắt Đơn Hàng</h2>

              {/* Summary lines */}
              <div className="space-y-3 text-sm border-b border-border pb-4">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Tạm tính:</span>
                  <span className="font-bold">{subtotal.toLocaleString()}₫</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Phí giao hàng:</span>
                  <span className={`font-bold ${shipping === 0 ? "text-primary" : ""}`}>
                    {shipping === 0 ? "Miễn phí" : shipping.toLocaleString() + "₫"}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-green-600">Giảm giá:</span>
                    <span className="font-bold text-green-600">-{discount.toLocaleString()}₫</span>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between text-lg font-bold text-primary pt-2">
                <span>Tổng cộng:</span>
                <span>{total.toLocaleString()}₫</span>
              </div>

              {/* Checkout button */}
              <Link href="/checkout" className="block">
                <Button className="w-full bg-primary hover:bg-primary-dark text-white py-3 font-bold">
                  Thanh Toán Ngay
                </Button>
              </Link>

              {/* Trust info */}
              <div className="bg-neutral-50 rounded-lg p-3 text-xs text-neutral-600 space-y-2">
                <p>✓ Giao hàng nhanh trong 2 giờ</p>
                <p>✓ Thanh toán an toàn 100%</p>
                <p>✓ Hoàn tiền 30 ngày nếu không hài lòng</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

"use client"

import { useState } from "react"
import { AlertTriangle, Send } from "lucide-react"
import useSWR from "swr"
import { fetcher } from "@/lib/fetcher"
import { Button } from "@/components/ui/button"

export default function AdminWarningsPage() {
  const [productId, setProductId] = useState("")
  const [sellerId, setSellerId] = useState("")
  const [message, setMessage] = useState("")
  const [severity, setSeverity] = useState<"warning" | "critical">("warning")
  const { data: warnings, mutate } = useSWR("/api/admin/warnings", fetcher)

  const handleCreateWarning = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!productId || !sellerId || !message) return

    try {
      const response = await fetch("/api/admin/warnings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, sellerId, message, severity }),
      })

      if (response.ok) {
        mutate()
        setProductId("")
        setSellerId("")
        setMessage("")
      }
    } catch (error) {
      console.error("Error creating warning:", error)
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Cảnh Báo Người Bán</h1>

      {/* Create Warning Form */}
      <div className="bg-white rounded-lg p-6 border border-border mb-6">
        <h2 className="text-xl font-bold mb-4">Tạo Cảnh Báo Mới</h2>
        <form onSubmit={handleCreateWarning} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Product ID</label>
              <input
                type="text"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
                placeholder="Nhập Product ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Seller ID</label>
              <input
                type="text"
                value={sellerId}
                onChange={(e) => setSellerId(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
                placeholder="Nhập Seller ID"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Mức Độ</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as any)}
              className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
            >
              <option value="warning">Cảnh Báo</option>
              <option value="critical">Nghiêm Trọng</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Nội Dung Cảnh Báo</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary"
              placeholder="Nhập nội dung cảnh báo..."
            />
          </div>
          <Button type="submit" className="bg-primary hover:bg-primary-dark">
            <Send size={16} className="mr-2" />
            Gửi Cảnh Báo
          </Button>
        </form>
      </div>

      {/* Warnings List */}
      <div className="bg-white rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-bold">Danh Sách Cảnh Báo</h2>
        </div>
        <div className="divide-y divide-border">
          {warnings?.map((warning: any) => (
            <div key={warning.id} className="p-6">
              <div className="flex items-start gap-4">
                <AlertTriangle
                  className={`mt-1 ${
                    warning.severity === "critical" ? "text-red-500" : "text-orange-500"
                  }`}
                  size={24}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-medium">Sản phẩm: {warning.product?.name || "N/A"}</p>
                      <p className="text-sm text-neutral-600">
                        Người bán: {warning.seller?.fullName || "N/A"}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        warning.severity === "critical"
                          ? "bg-red-100 text-red-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {warning.severity === "critical" ? "Nghiêm Trọng" : "Cảnh Báo"}
                    </span>
                  </div>
                  <p className="text-neutral-700 mb-2">{warning.message}</p>
                  <p className="text-xs text-neutral-500">
                    {new Date(warning.createdAt).toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>
            </div>
          ))}

          {(!warnings || warnings.length === 0) && (
            <div className="text-center py-12 text-neutral-600">
              Chưa có cảnh báo nào
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


"use client"

import { useState } from "react"
import Link from "next/link"
import { MapPin, Edit2, Trash2, Plus, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

interface Address {
  id: string
  label: string
  fullAddress: string
  isDefault: boolean
}

export default function AddressesPage() {
  const { user, updateProfile, isAuthenticated } = useAuth()
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      label: "Nhà Riêng",
      fullAddress: "123 Đường ABC, Quận 1, TP.HCM",
      isDefault: true,
    },
    {
      id: "2",
      label: "Công Ty",
      fullAddress: "456 Đường XYZ, Quận 7, TP.HCM",
      isDefault: false,
    },
  ])
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    label: "",
    fullAddress: "",
  })

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Vui lòng đăng nhập</h1>
        <Link href="/auth/login">
          <Button className="bg-primary hover:bg-primary-dark text-white">Đăng Nhập</Button>
        </Link>
      </div>
    )
  }

  const handleAddAddress = () => {
    if (formData.label && formData.fullAddress) {
      const newAddress: Address = {
        id: Date.now().toString(),
        label: formData.label,
        fullAddress: formData.fullAddress,
        isDefault: addresses.length === 0,
      }
      setAddresses([...addresses, newAddress])
      setFormData({ label: "", fullAddress: "" })
      setIsAdding(false)
    }
  }

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id))
  }

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      })),
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Địa Chỉ Giao Hàng</h1>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition"
          >
            <Plus size={18} /> Thêm Địa Chỉ
          </button>
        )}
      </div>

      {/* Add address form */}
      {isAdding && (
        <div className="bg-white border border-border rounded-lg p-6 mb-6">
          <h2 className="font-bold text-lg mb-4">Thêm Địa Chỉ Mới</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Tên Địa Chỉ</label>
              <input
                type="text"
                placeholder="Nhà riêng, Công ty, v.v..."
                value={formData.label}
                onChange={(e) => setFormData((prev) => ({ ...prev, label: e.target.value }))}
                className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Địa Chỉ Đầy Đủ</label>
              <textarea
                placeholder="Số nhà, tên đường, phường, quận, thành phố"
                value={formData.fullAddress}
                onChange={(e) => setFormData((prev) => ({ ...prev, fullAddress: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary transition resize-none"
              />
            </div>
            <div className="flex gap-3">
              <Button onClick={handleAddAddress} className="flex-1 bg-primary hover:bg-primary-dark text-white">
                Lưu Địa Chỉ
              </Button>
              <button
                onClick={() => {
                  setIsAdding(false)
                  setFormData({ label: "", fullAddress: "" })
                }}
                className="flex-1 border border-border rounded-lg hover:bg-neutral-100 transition font-medium"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Addresses list */}
      {addresses.length === 0 ? (
        <div className="text-center py-12 bg-neutral-50 rounded-lg">
          <MapPin size={64} className="mx-auto text-neutral-300 mb-4" />
          <p className="text-neutral-600">Bạn chưa có địa chỉ nào</p>
        </div>
      ) : (
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`border-2 rounded-lg p-6 transition ${
                address.isDefault ? "border-primary bg-primary/5" : "border-border"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <MapPin size={24} className="text-primary flex-shrink-0" />
                  <div>
                    <p className="font-bold text-lg">{address.label}</p>
                    <p className="text-neutral-600 text-sm">{address.fullAddress}</p>
                  </div>
                </div>
                {address.isDefault && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-primary text-white rounded-full text-xs font-bold">
                    <Check size={14} /> Mặc Định
                  </span>
                )}
              </div>

              <div className="flex gap-2">
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="flex-1 py-2 border border-border rounded-lg hover:bg-neutral-100 transition font-medium text-sm"
                  >
                    Đặt Làm Mặc Định
                  </button>
                )}
                <button className="px-4 py-2 border border-border rounded-lg hover:bg-neutral-100 transition font-medium text-sm flex items-center gap-2">
                  <Edit2 size={16} /> Sửa
                </button>
                <button
                  onClick={() => handleDeleteAddress(address.id)}
                  className="px-4 py-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition font-medium text-sm flex items-center gap-2"
                >
                  <Trash2 size={16} /> Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

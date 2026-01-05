"use client"

import { useEffect, useState } from "react"
import { Mail, Download, Search } from "lucide-react"
import useSWR from "swr"
import { authenticatedFetcher } from "@/lib/fetcher"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"

export default function NewsletterSubscriptionsPage() {
  const { token, isAuthenticated } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  
  const { data, error, isLoading, mutate } = useSWR(
    isAuthenticated && token ? ["/api/admin/newsletter-subscriptions", token] : null,
    ([url, token]) => authenticatedFetcher(url, token)
  )

  const subscriptions = data?.subscriptions || []
  const total = data?.total || 0

  // Filter subscriptions based on search term
  const filteredSubscriptions = subscriptions.filter((sub: any) =>
    sub.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleExportCSV = () => {
    const headers = ["Email", "Ngày Đăng Ký"]
    const rows = filteredSubscriptions.map((sub: any) => [
      sub.email,
      new Date(sub.createdAt).toLocaleDateString("vi-VN"),
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map((row: any[]) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `newsletter-subscriptions-${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (!isAuthenticated) {
    return <div className="text-center py-20">Vui lòng đăng nhập để xem trang này.</div>
  }

  if (isLoading) {
    return <div className="text-center py-20">Đang tải dữ liệu...</div>
  }

  if (error) {
    return <div className="text-center py-20 text-red-600">Lỗi tải dữ liệu. Vui lòng thử lại sau.</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Đăng Ký Nhận Khuyến Mãi</h1>
          <p className="text-neutral-600">Danh sách email đã đăng ký nhận thông tin khuyến mãi</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-white rounded-lg border border-border px-4 py-2">
            <Search size={20} className="text-neutral-400" />
            <input
              type="text"
              placeholder="Tìm kiếm email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none text-sm"
            />
          </div>
          <Button onClick={handleExportCSV} variant="outline" className="flex items-center gap-2">
            <Download size={18} />
            Xuất CSV
          </Button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-lg p-6 border border-border mb-6">
        <div className="flex items-center gap-4">
          <div className="bg-green-100 rounded-full p-4">
            <Mail className="text-green-600" size={32} />
          </div>
          <div>
            <p className="text-3xl font-bold text-green-600">{total}</p>
            <p className="text-sm text-neutral-600">Tổng số email đăng ký</p>
          </div>
        </div>
      </div>

      {/* Subscriptions List */}
      <div className="bg-white rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-border">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">STT</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-neutral-700">Ngày Đăng Ký</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-neutral-500">
                    {searchTerm ? "Không tìm thấy email nào." : "Chưa có email nào đăng ký."}
                  </td>
                </tr>
              ) : (
                filteredSubscriptions.map((subscription: any, index: number) => (
                  <tr key={subscription.id} className="hover:bg-neutral-50 transition">
                    <td className="px-6 py-4 text-sm text-neutral-600">{index + 1}</td>
                    <td className="px-6 py-4 text-sm font-medium text-neutral-800">{subscription.email}</td>
                    <td className="px-6 py-4 text-sm text-neutral-600">
                      {new Date(subscription.createdAt).toLocaleDateString("vi-VN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}


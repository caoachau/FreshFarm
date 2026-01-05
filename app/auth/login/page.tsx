"use client"
import React, { useState } from "react"
import { useRouter } from "next/navigation"

import { Eye, EyeOff, Mail, Lock, User, CheckCircle2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({ email: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      setError("Vui lòng điền tất cả các trường")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data?.error || "Email hoặc mật khẩu không đúng")
        return
      }

      // dự án bạn có header x-user-id để client gửi lên các API khác
      const userId = res.headers.get("x-user-id")
      if (userId) {
        localStorage.setItem("userId", userId)
      }

      // lưu user để hiển thị UI / useAuth
      localStorage.setItem("user", JSON.stringify(data))

      // nhớ đăng nhập (tuỳ bạn): nếu không tick remember thì có thể dùng sessionStorage
      if (!rememberMe) {
        // ví dụ: chỉ giữ userId trong session (tuỳ kiến trúc bạn muốn)
        // sessionStorage.setItem("userId", userId || "")
        // localStorage.removeItem("userId")
      }

      router.push("/")
      router.refresh()
    } catch (err) {
      setError("Không thể kết nối máy chủ. Vui lòng thử lại.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-white text-black">
            <div className="flex items-center justify-center mb-4">
              <div className="backdrop-blur-sm p-2 rounded-full">
                <img src="/logo2.jpg" alt="FreshFarm Logo" className="h-20 w-20 object-contain" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-center mb-2">FreshFarm</h1>
            <h4 className="text-xl font-bold text-center mb-2">Đăng Nhập</h4>
            <p className="text-center text-gray-500 text-sm">Chào mừng bạn quay lại</p>
          </div>

          <div className="p-8">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-sm text-gray-600">Ghi nhớ tôi</span>
                </label>
                <a href="#" className="text-sm text-emerald-600 hover:text-emerald-700 font-medium transition">
                  Quên mật khẩu?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-lg font-medium hover:from-emerald-600 hover:to-green-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Đang xử lý..." : "Đăng Nhập"}
              </button>
            </form>

            <p className="text-center mt-6 text-sm text-gray-600">
              Chưa có tài khoản?{" "}
              <a href="/auth/signup" className="text-emerald-600 hover:text-emerald-700 font-semibold transition">
                Đăng ký ngay
              </a>
            </p>
            
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 text-center">
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600 font-medium">Miễn phí</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600 font-medium">Bảo mật</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
            <p className="text-xs text-gray-600 font-medium">Nhanh chóng</p>
          </div>
        </div>
      </div>
    </div>
  )
}

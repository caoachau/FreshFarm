import Link from "next/link"
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white mt-16">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About */}
        <div>
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <img 
              src="/logo2.jpg" 
              alt="FreshFarm Logo" 
              className="h-10 sm:h-12 object-contain"
            />
            <span className="hidden sm:inline">FreshFarm</span>
          </h3>
          <p className="text-neutral-400 text-sm">
            Cung cấp nông sản tươi sạch, hữu cơ với giá cạnh tranh nhất tại thị trường.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="font-bold mb-4">Liên Kết Nhanh</h4>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li>
              <Link href="/" className="hover:text-white transition">
                Trang Chủ
              </Link>
            </li>
            <li>
              <Link href="/products" className="hover:text-white transition">
                Sản Phẩm
              </Link>
            </li>
            <li>
              <Link href="/news" className="hover:text-white transition">
                Tin Tức
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white transition">
                Về Chúng Tôi
              </Link>
            </li>
          </ul>
        </div>

        {/* Policies */}
        <div>
          <h4 className="font-bold mb-4">Chính Sách</h4>
          <ul className="space-y-2 text-sm text-neutral-400">
            <li>
              <Link href="/privacy" className="hover:text-white transition">
                Chính Sách Bảo Mật
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white transition">
                Điều Khoản Dịch Vụ
              </Link>
            </li>
            <li>
              <Link href="/shipping" className="hover:text-white transition">
                Chính Sách Vận Chuyển
              </Link>
            </li>
            <li>
              <Link href="/return" className="hover:text-white transition">
                Chính Sách Đổi Trả
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold mb-4">Liên Hệ</h4>
          <ul className="space-y-3 text-sm text-neutral-400">
            <li className="flex gap-2">
              <Phone size={16} className="flex-shrink-0 text-primary" />
              <span>1900 1234</span>
            </li>
            <li className="flex gap-2">
              <Mail size={16} className="flex-shrink-0 text-primary" />
              <span>support@freshfarm.vn</span>
            </li>
            <li className="flex gap-2">
              <MapPin size={16} className="flex-shrink-0 text-primary" />
              <span>123 Đường ABC, TP.HCM</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Social media */}
      <div className="border-t border-neutral-700 px-4 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-neutral-400">© 2025 FreshFarm. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="https://www.facebook.com/chau.cao.39395033" className="text-neutral-400 hover:text-primary transition">
              <Facebook size={20} />
            </a>
            <a href="https://www.instagram.com/cao_a_chau/" className="text-neutral-400 hover:text-primary transition">
              <Instagram size={20} />
            </a>
            <a href="https://www.youtube.com/@CaoAChau4325" className="text-neutral-400 hover:text-primary transition">
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

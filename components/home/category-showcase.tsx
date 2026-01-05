import Link from "next/link"
import useSWR from 'swr' // ⬅️ Thêm SWR
import { fetcher } from "@/lib/fetcher" // ⬅️ Giả định fetcher đã được tạo

// import { categories } from "@/data/products" // ⬅️ Xóa import dữ liệu tĩnh

interface Category {
  id: string | number;
  name: string;
  slug: string;
  image: string;
  // icon?: string; // Uncomment if you use icon
}

export default function CategoryShowcase() {
  
  // Gọi API để lấy danh sách danh mục
  const { data: categoriesData, error } = useSWR(
    '/api/categories', // ⬅️ Endpoint API giả định để lấy danh mục
    fetcher
  )

  // Xử lý Loading và Error State
  if (error) return (
    <section className="py-8 text-red-600">
      Lỗi tải danh mục: Vui lòng kiểm tra API /api/categories.
    </section>
  )
  
  // Nếu chưa có dữ liệu và không có lỗi, đang tải
  if (!categoriesData) return <section className="py-8 text-center">Đang tải danh mục...</section>

  // Lấy danh sách danh mục (API trả về array categories)
  const categories = categoriesData || []

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl sm:text-4xl font-black text-gray-800 mb-2">
            Danh Mục Sản Phẩm
          </h2>
          <p className="text-gray-600">Khám phá các loại nông sản tươi ngon</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
        {categories.map((category: Category) => (
          <Link
            key={category.id} 
            href={`/products?category=${category.slug}`}
            className="group relative h-48 sm:h-52 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 transition-transform duration-500 group-hover:scale-110"
              style={{
                backgroundImage: `url('${category.image}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent group-hover:from-black/80 transition-all duration-300" />
            
            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/30 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Content */}
            <div className="relative h-full flex flex-col items-center justify-end p-4 sm:p-5">
              {/* Icon/Badge (nếu có) */}
              {category.icon && (
                <div className="mb-3 text-4xl sm:text-5xl transform group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg">
                  {category.icon}
                </div>
              )}
              
              {/* Category Name */}
              <h3 className="font-bold text-white text-sm sm:text-base text-center leading-tight mb-2 transform group-hover:translate-y-0 transition-transform">
                {category.name}
              </h3>
              
              {/* View More Indicator */}
              <div className="flex items-center gap-1 text-white/80 text-xs opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <span className="font-medium">Xem thêm</span>
                <svg className="w-4 h-4 animate-bounce-x" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Shine effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        @keyframes bounce-x {
          0%, 100% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(4px);
          }
        }
        .animate-bounce-x {
          animation: bounce-x 1s ease-in-out infinite;
        }
      `}</style>
    </section>
  )
}


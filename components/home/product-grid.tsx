import Link from "next/link"
import ProductCard from "@/components/products/product-card"
// import { products } from "@/data/products" // ⬅️ Xóa import dữ liệu tĩnh

// Cấu trúc sản phẩm nên phản ánh dữ liệu từ API (ví dụ: product object)
// Nếu sử dụng TypeScript/TSX, bạn có thể định nghĩa lại ProductType
interface Product {
  id: string
  name: string
  price: number
  image: string
  rating?: number
  votes?: number
  discount?: number
  // Thêm các trường khác cần thiết cho ProductCard
}

interface ProductGridProps {
  title: string
  // Chỉ nhận danh sách sản phẩm đã được fetch
  products?: Product[] 
  limit?: number
}

// Chú ý: productsData sẽ là dữ liệu đã được fetch từ API,
// ví dụ: productsData = bestSelling (từ useSWR)
export default function ProductGrid({ title, products: productsData = [], limit = 8 }: ProductGridProps) {
    
  // Xử lý trường hợp không có dữ liệu (khi đang tải hoặc API trả về mảng rỗng)
  if (!productsData || productsData.length === 0) {
    // Tùy chọn: hiển thị skeleton loading hoặc thông báo rỗng
    return null; // Hoặc một placeholder
  }
  
  return (
    <section className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        {/* URL 'Xem Tất Cả' có thể cần được chỉnh sửa để trỏ đến danh mục cụ thể nếu có */}
        <Link href="/products" className="text-primary hover:text-primary-dark font-medium">
          Xem Tất Cả →
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {/* Dữ liệu sản phẩm (productsData) đã được lọc/sắp xếp từ API, 
            nên việc .slice(0, limit) ở đây chỉ là biện pháp an toàn cuối cùng. */}
        {productsData.slice(0, limit).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
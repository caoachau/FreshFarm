import ProductCard from "./product-card"
// import { products } from "@/data/products" // ⬅️ Xóa import dữ liệu tĩnh

// Định nghĩa lại props để nhận mảng sản phẩm liên quan đã được fetch
interface RelatedProduct {
  id: string
  name: string
  price: number
  image: string
  // Thêm các trường khác cần thiết cho ProductCard
}

interface RelatedProductsProps {
  currentProductId: string
  // Thay đổi để nhận mảng sản phẩm đã được fetch
  relatedProducts: RelatedProduct[] 
}

// Chú ý: Component này không cần tự fetch, chỉ render dữ liệu được truyền vào
export default function RelatedProducts({ relatedProducts }: RelatedProductsProps) {
  
  // Dữ liệu đã được fetch, lọc, và giới hạn số lượng (thường là 4) từ trang cha (ProductDetailPage)

  if (!relatedProducts || relatedProducts.length === 0) {
    return null
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Sản Phẩm Liên Quan</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {relatedProducts.map((product) => (
          // Không cần slice() vì dữ liệu đã được giới hạn từ API hoặc trang cha
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
"use client"

import React, { useState, useEffect } from "react"
import { Heart, Share2, ShoppingCart, Minus, Plus } from "lucide-react"
// import { products } from "@/data/products" // ⬅️ Xóa import dữ liệu tĩnh
import { Button } from "@/components/ui/button"
import ImageGallery from "@/components/products/image-gallery"
import ProductReviews from "@/components/products/product-reviews"
import RelatedProducts from "@/components/products/related-products"
import useSWR from 'swr' // ⬅️ Thêm SWR
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"

// Giả định fetcher có khả năng xử lý JSON
const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
    // Fix: Handle both Promise and non-Promise params for Next.js 13+
    const [productId, setProductId] = useState<string | null>(null)
    
    useEffect(() => {
        if (params instanceof Promise) {
            params.then((resolved) => setProductId(resolved.id))
        } else {
            setProductId(params.id)
        }
    }, [params])
    
    const id = productId 

    // 1. FETCH DỮ LIỆU CHI TIẾT SẢN PHẨM TỪ API
    const { data: productData, error, isLoading } = useSWR(
        id ? `/api/products/${id}` : null, 
        fetcher
    )
    
    // Lấy chi tiết sản phẩm và sản phẩm liên quan từ response
    const product = productData?.product
    const relatedProducts = productData?.relatedProducts || []

    const [quantity, setQuantity] = useState(1)
    const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({})
    
    // Fix: Use useWishlist hook instead of manual API calls
    const { isAuthenticated } = useAuth()
    const { addToCart } = useCart()
    const { isInWishlist, toggleWishlist } = useWishlist()
    const isWishlisted = product ? isInWishlist(product.id) : false

    if (!id || isLoading) {
        return <div className="max-w-7xl mx-auto px-4 py-12 text-center">Đang tải sản phẩm...</div>
    }

    if (error || !product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Sản phẩm không tồn tại hoặc lỗi tải dữ liệu</h1>
                <a href="/products" className="text-primary hover:text-primary-dark">
                    Quay lại trang sản phẩm
                </a>
            </div>
        )
    }

    const productImages = [product.image, ...(product.images || [])]
    const totalPrice = product.price * quantity
    const savingsAmount = product.originalPrice ? (product.originalPrice - product.price) * quantity : 0

    // --------------------------------------------------------
    // 2. LOGIC GỌI API ADD TO CART
    // --------------------------------------------------------
    const handleAddToCart = async () => {
        if (!isAuthenticated) {
            alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
            return;
        }

        if (!product) return;

        try {
            await addToCart(
                product.id,
                quantity,
                Object.keys(selectedVariants).length > 0 
                    ? JSON.stringify(selectedVariants) 
                    : undefined
            );
            alert(`Đã thêm ${quantity} sản phẩm '${product.name}' vào giỏ hàng!`);
        } catch (err: any) {
            alert(`Thất bại: ${err.message || 'Lỗi thêm sản phẩm vào giỏ hàng'}`);
        }
    }

    // --------------------------------------------------------
    // 3. LOGIC GỌI API TOGGLE WISHLIST
    // --------------------------------------------------------
    const handleWishlist = async () => {
        if (!isAuthenticated) {
            alert("Vui lòng đăng nhập để quản lý danh sách yêu thích.");
            return;
        }

        if (!product) return;

        try {
            await toggleWishlist(product.id);
        } catch (err: any) {
            alert(`Thất bại: ${err.message || 'Lỗi xử lý Wishlist'}`);
        }
    }

    // Chú ý: Cấu trúc data.reviews trong API có thể khác data.reviews trong code tĩnh
    // API: "reviews": [ { "id": "...", "rating": 5, "content": "...", "user": { "fullName": "..." } } ]
    // Code tĩnh: product.reviews là số lượng đánh giá.
    // Ta giả định API đã trả về 'product.reviews' là một mảng đánh giá.
    const productReviews = Array.isArray(product.reviews) ? product.reviews : []; 
    
    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 text-sm text-neutral-600 mb-8">
                <a href="/" className="hover:text-primary">
                    Trang chủ
                </a>
                <span>/</span>
                <a href="/products" className="hover:text-primary">
                    Sản phẩm
                </a>
                <span>/</span>
                <span className="text-neutral-800">{product.name}</span>
            </div>

            {/* Main product section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Image Gallery */}
                <div>
                    <ImageGallery images={productImages} productName={product.name} />
                </div>

                {/* Product info */}
                <div className="space-y-6">
                    {/* Header */}
                    <div>
                        {product.brand && <p className="text-sm text-neutral-500 mb-2">{product.brand}</p>}
                        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

                        <div className="flex items-center gap-3 mb-4">
                            <div className="flex text-yellow-400">
                                {Array.from({ length: Math.floor(product.rating) }).map((_, i) => (
                                    <span key={i}>★</span>
                                ))}
                            </div>
                            <span className="text-sm text-neutral-600">
                                {product.rating} / 5.0 ({product.votes || (productReviews ? productReviews.length : 0)} đánh giá)
                            </span>
                        </div>

                        {/* Stock status (Sử dụng 'stock' từ API) */}
                        <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${product.stock > 0 ? "bg-primary" : "bg-red-500"}`} />
                            <span className={`font-medium ${product.stock > 0 ? "text-primary" : "text-red-500"}`}>
                                {product.stock > 0 ? `Còn Hàng (${product.stock})` : "Hết Hàng"}
                            </span>
                        </div>
                    </div>

                    {/* Pricing */}
                    <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-bold text-primary">{product.price.toLocaleString()}₫</span>
                            {product.originalPrice && (
                                <span className="text-lg text-neutral-500 line-through">{product.originalPrice.toLocaleString()}₫</span>
                            )}
                        </div>
                        {product.discount && (
                            <p className="text-sm text-green-600 font-medium">
                                Tiết kiệm: {savingsAmount.toLocaleString()}₫ ({product.discount}%)
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <p className="text-neutral-700 leading-relaxed">{product.description}</p>
                    </div>

                    {/* Product Origin Information */}
                    {(product.variety || product.season || product.certification) && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-4">
                            <h3 className="text-lg font-bold text-green-800 mb-4">Thông Tin Nông Sản</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {product.variety && (
                                    <div>
                                        <p className="text-sm font-semibold text-green-700 mb-1">🌱 Giống:</p>
                                        <p className="text-neutral-700">{product.variety}</p>
                                    </div>
                                )}
                                {product.season && (
                                    <div>
                                        <p className="text-sm font-semibold text-green-700 mb-1">📅 Mùa Vụ:</p>
                                        <p className="text-neutral-700">{product.season}</p>
                                    </div>
                                )}
                                {product.certification && (
                                    <div className="sm:col-span-2">
                                        <p className="text-sm font-semibold text-green-700 mb-1">🏆 Chứng Nhận:</p>
                                        <p className="text-neutral-700">{product.certification}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Variants (Giữ nguyên logic client-side vì không có thông tin API cho variants) */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="space-y-4">
                            {product.variants.map((variant: any) => ( // Cần typing cho variant
                                <div key={variant.id}>
                                    <label className="block font-medium mb-2">{variant.type}</label>
                                    <div className="flex flex-wrap gap-2">
                                        {variant.options.map((option: any) => (
                                            <button
                                                key={option}
                                                onClick={() =>
                                                    setSelectedVariants((prev) => ({
                                                        ...prev,
                                                        [variant.id]: option,
                                                    }))
                                                }
                                                className={`px-4 py-2 rounded-lg border-2 transition ${
                                                    selectedVariants[variant.id] === option
                                                        ? "border-primary bg-primary/10"
                                                        : "border-border hover:border-primary"
                                                }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Quantity selector */}
                    <div className="flex items-center gap-4">
                        <label className="font-medium">Số lượng:</label>
                        <div className="flex items-center border border-border rounded-lg">
                            <button
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                className="p-2 hover:bg-neutral-100 transition"
                            >
                                <Minus size={18} />
                            </button>
                            <span className="px-6 py-2 font-bold">{quantity}</span>
                            <button 
                                onClick={() => setQuantity(quantity + 1)} 
                                className="p-2 hover:bg-neutral-100 transition"
                                disabled={quantity >= product.stock} // Ngăn chặn vượt quá stock
                            >
                                <Plus size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-3">
                        <Button
                            onClick={handleAddToCart}
                            className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 font-bold text-lg"
                            disabled={product.stock <= 0} // Dựa vào stock từ API
                        >
                            <ShoppingCart size={20} className="mr-2" />
                            Thêm Vào Giỏ
                        </Button>
                        <button
                            onClick={handleWishlist}
                            className={`px-6 py-3 rounded-lg border-2 font-bold transition ${
                                isWishlisted ? "border-accent bg-accent/10 text-accent" : "border-border hover:border-accent"
                            }`}
                        >
                            <Heart size={20} className={isWishlisted ? "fill-current" : ""} />
                        </button>
                        <button
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: product.name,
                                        text: product.description || `Xem sản phẩm ${product.name} trên FreshFarm`,
                                        url: window.location.href,
                                    }).catch((err) => {
                                        console.log('Error sharing:', err)
                                    })
                                } else {
                                    // Fallback: Copy link to clipboard
                                    navigator.clipboard.writeText(window.location.href).then(() => {
                                        alert('Đã sao chép link sản phẩm!')
                                    }).catch(() => {
                                        // Fallback for older browsers
                                        const textArea = document.createElement('textarea')
                                        textArea.value = window.location.href
                                        document.body.appendChild(textArea)
                                        textArea.select()
                                        document.execCommand('copy')
                                        document.body.removeChild(textArea)
                                        alert('Đã sao chép link sản phẩm!')
                                    })
                                }
                            }}
                            className="px-6 py-3 rounded-lg border-2 border-border hover:border-primary transition font-bold"
                            title="Chia sẻ sản phẩm"
                        >
                            <Share2 size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 bg-neutral-50 rounded-lg p-4">
                        <div className="text-center text-sm">
                            <p className="font-bold">🚚 Giao Hàng Nhanh</p>
                            <p className="text-neutral-600 text-xs">Trong 2 giờ</p>
                        </div>
                        <div className="text-center text-sm">
                            <p className="font-bold">✓ Hàng Chính Hãng</p>
                            <p className="text-neutral-600 text-xs">100% Guarantee</p>
                        </div>
                        <div className="text-center text-sm">
                            <p className="font-bold">💰 Hoàn Tiền</p>
                            <p className="text-neutral-600 text-xs">30 ngày</p>
                        </div>
                        <div className="text-center text-sm">
                            <p className="font-bold">🛡️ An Toàn</p>
                            <p className="text-neutral-600 text-xs">Thanh toán bảo mật</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reviews section */}
            <div className="mb-12">
                <ProductReviews 
                    rating={product.rating} 
                    reviews={productReviews?.length || product.votes || 0} 
                    reviews_data={productReviews.map((r: any) => ({
                        id: r.id,
                        author: r.user?.fullName || 'Người dùng',
                        rating: r.rating,
                        date: new Date(r.createdAt).toLocaleDateString('vi-VN'),
                        comment: r.content,
                        helpful: 0,
                        user: r.user
                    }))} 
                    productId={product.id} 
                />
            </div>

            {/* Related products */}
            <div>
                {/* Truyền relatedProducts đã fetch từ API vào component RelatedProducts */}
                <RelatedProducts currentProductId={product.id} relatedProducts={relatedProducts} /> 
            </div>
        </div>
    )
}
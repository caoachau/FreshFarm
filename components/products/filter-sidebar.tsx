"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
// import { categories } from "@/data/products" // ⬅️ Xóa import dữ liệu tĩnh
import useSWR from 'swr' // ⬅️ Thêm SWR
import { fetcher } from "@/lib/fetcher" // ⬅️ Giả định fetcher đã được tạo

interface FilterSidebarProps {
    onCategoryChange: (category: string | null) => void
    onPriceChange: (min: number, max: number) => void
    onRatingChange: (minRating: number) => void
    // Giả định selectedCategory là slug danh mục
    selectedCategory?: string 
}

export default function FilterSidebar({
    onCategoryChange,
    onPriceChange,
    onRatingChange,
    selectedCategory,
}: FilterSidebarProps) {
    const [expandedSections, setExpandedSections] = useState<string[]>(["category", "price", "rating"])
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 150000])
    const [selectedRating, setSelectedRating] = useState<number>(0)

    // 1. FETCH DỮ LIỆU DANH MỤC TỪ API
    const { data: categoriesData, error: categoriesError, isLoading: isLoadingCategories } = useSWR(
        '/api/categories', // ⬅️ Endpoint API giả định để lấy danh mục
        fetcher
    )
    
    const categories = categoriesData || []

    const toggleSection = (section: string) => {
        setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
    }

    const handlePriceChange = (min: number, max: number) => {
        setPriceRange([min, max])
        onPriceChange(min, max)
    }

    const handleRatingChange = (rating: number) => {
        setSelectedRating(rating)
        onRatingChange(rating)
    }
    
    if (categoriesError) {
        // Tùy chọn: Xử lý lỗi tải danh mục
        return <aside className="w-full lg:w-64 bg-white rounded-lg border border-border p-4 h-fit text-red-500">
            Lỗi tải danh mục.
        </aside>
    }

    return (
        <aside className="w-full lg:w-64 bg-white rounded-lg border border-border p-4 h-fit">
            
            {/* Category Filter */}
            <div className="mb-6">
                <button
                    onClick={() => toggleSection("category")}
                    className="w-full flex items-center justify-between font-bold text-lg mb-3 hover:text-primary transition"
                >
                    <span>Danh Mục</span>
                    <ChevronDown
                        size={20}
                        className={`transition ${expandedSections.includes("category") ? "rotate-180" : ""}`}
                    />
                </button>
                {expandedSections.includes("category") && (
                    <div className="space-y-2">
                        {isLoadingCategories && <span className="text-sm text-neutral-500">Đang tải...</span>}
                        
                        {/* Option: Tất Cả Sản Phẩm */}
                        <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition">
                            <input
                                type="radio"
                                name="category"
                                value=""
                                checked={!selectedCategory}
                                onChange={(e) => onCategoryChange(null)}
                                className="cursor-pointer"
                            />
                            <span className="text-sm">Tất Cả Sản Phẩm</span>
                        </label>
                        
                        {/* Danh sách danh mục từ API */}
                        {categories.map((cat: any) => ( // Cần typing cho cat
                            <label key={cat.id} className="flex items-center gap-2 cursor-pointer hover:text-primary transition">
                                <input
                                    type="radio"
                                    name="category"
                                    // 2. Sử dụng cat.slug để lọc sản phẩm
                                    value={cat.slug} 
                                    checked={selectedCategory === cat.slug} // ⬅️ Dùng cat.slug
                                    onChange={(e) => onCategoryChange(e.target.value)}
                                    className="cursor-pointer"
                                />
                                <span className="text-sm">{cat.name}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>

            {/* Price Filter (Không thay đổi, logic client-side) */}
            <div className="mb-6 pb-6 border-b border-border">
                <button
                    onClick={() => toggleSection("price")}
                    className="w-full flex items-center justify-between font-bold text-lg mb-3 hover:text-primary transition"
                >
                    <span>Giá</span>
                    <ChevronDown size={20} className={`transition ${expandedSections.includes("price") ? "rotate-180" : ""}`} />
                </button>
                {expandedSections.includes("price") && (
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-neutral-600 block mb-2">
                                Giá Tối Thiểu: {priceRange[0].toLocaleString()}₫
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="150000"
                                step="5000"
                                value={priceRange[0]}
                                onChange={(e) => handlePriceChange(Number(e.target.value), priceRange[1])}
                                className="w-full"
                            />
                        </div>
                        <div>
                            <label className="text-sm text-neutral-600 block mb-2">
                                Giá Tối Đa: {priceRange[1].toLocaleString()}₫
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="150000"
                                step="5000"
                                value={priceRange[1]}
                                onChange={(e) => handlePriceChange(priceRange[0], Number(e.target.value))}
                                className="w-full"
                            />
                        </div>
                        <button
                            onClick={() => handlePriceChange(0, 150000)}
                            className="w-full py-2 px-3 bg-neutral-100 hover:bg-neutral-200 rounded transition text-sm font-medium"
                        >
                            Đặt Lại
                        </button>
                    </div>
                )}
            </div>

            {/* Rating Filter (Không thay đổi, logic client-side) */}
            <div>
                <button
                    onClick={() => toggleSection("rating")}
                    className="w-full flex items-center justify-between font-bold text-lg mb-3 hover:text-primary transition"
                >
                    <span>Đánh Giá</span>
                    <ChevronDown size={20} className={`transition ${expandedSections.includes("rating") ? "rotate-180" : ""}`} />
                </button>
                {expandedSections.includes("rating") && (
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => (
                            <label key={rating} className="flex items-center gap-2 cursor-pointer hover:text-primary transition">
                                <input
                                    type="radio"
                                    name="rating"
                                    value={rating}
                                    checked={selectedRating === rating}
                                    onChange={(e) => handleRatingChange(Number(e.target.value))}
                                    className="cursor-pointer"
                                />
                                <span className="text-yellow-400">{"★".repeat(rating)}</span>
                                <span className="text-sm text-neutral-600">{rating} sao</span>
                            </label>
                        ))}
                        <label className="flex items-center gap-2 cursor-pointer hover:text-primary transition">
                            <input
                                type="radio"
                                name="rating"
                                value="0"
                                checked={selectedRating === 0}
                                onChange={() => handleRatingChange(0)}
                                className="cursor-pointer"
                            />
                            <span className="text-sm text-neutral-600">Tất Cả</span>
                        </label>
                    </div>
                )}
            </div>
        </aside>
    )
}
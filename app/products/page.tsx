"use client"

import { useEffect, useMemo, useState } from "react"
import { Grid2X2, List } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
// import { products } from "@/data/products" // ⬅️ Xóa import dữ liệu tĩnh
import FilterSidebar from "@/components/products/filter-sidebar"
import ProductCard from "@/components/products/product-card"
import ProductListView from "@/components/products/product-list-view"
import useSWR from "swr" // ⬅️ Thêm SWR
import { fetcher } from "@/lib/fetcher" // ⬅️ Import fetcher

type ViewType = "grid" | "list"
type SortType = "newest" | "bestselling" | "price-asc" | "price-desc" | "rating"

// API Get Products hỗ trợ các Query Params:
// category, search, sort, page, limit, minPrice, maxPrice, minRating
const API_BASE = "/api/products"

export default function ProductsPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 150000])
    const [minRating, setMinRating] = useState(0)
    const [viewType, setViewType] = useState<ViewType>("grid")
    const [sortType, setSortType] = useState<SortType>("newest")
    const [currentPage, setCurrentPage] = useState(1)

    // Đồng bộ state với query trên URL (search, category, sort, page)
    useEffect(() => {
        const search = searchParams.get("search") || ""
        const category = searchParams.get("category")
        const sort = (searchParams.get("sort") as SortType) || "newest"
        const page = Number.parseInt(searchParams.get("page") || "1")

        setSearchTerm(search)
        setSelectedCategory(category)
        setSortType(sort)
        setCurrentPage(Number.isNaN(page) || page < 1 ? 1 : page)
    }, [searchParams])

    // Helper cập nhật URL khi thay đổi filter/search/sort/page
    const updateQuery = (updates: Record<string, string | null>) => {
        const params = new URLSearchParams(searchParams.toString())

        Object.entries(updates).forEach(([key, value]) => {
            if (value === null || value === "") {
                params.delete(key)
            } else {
                params.set(key, value)
            }
        })

        const queryString = params.toString()
        router.push(queryString ? `${pathname}?${queryString}` : pathname)
    }

    // itemsPerPage được dùng để tính toán giới hạn (limit) cho API
    const itemsPerPage = viewType === "grid" ? 12 : 8
    
    // ----------------------------------------------------
    // 1. TẠO QUERY STRING DỰA TRÊN STATE
    // ----------------------------------------------------
    const queryString = useMemo(() => {
        const params = new URLSearchParams()

        // Phân trang & Giới hạn (Pagination & Limit)
        params.append('page', currentPage.toString())
        params.append('limit', itemsPerPage.toString()) // Dùng limit cho API

        // Tìm kiếm (Search)
        if (searchTerm) {
            params.append('search', searchTerm)
        }

        // Danh mục (Category)
        if (selectedCategory) {
            // API sử dụng slug danh mục
            params.append('category', selectedCategory)
        }

        // Sắp xếp (Sort)
        // API hỗ trợ: newest | bestselling | price-asc | price-desc | rating
        params.append('sort', sortType)

        // Lọc Giá (Price Filter) - Giả định API hỗ trợ minPrice và maxPrice
        params.append('minPrice', priceRange[0].toString())
        params.append('maxPrice', priceRange[1].toString())

        // Lọc Đánh giá (Rating Filter) - Giả định API hỗ trợ minRating
        if (minRating > 0) {
            params.append('minRating', minRating.toString())
        }

        return params.toString()
    }, [searchTerm, selectedCategory, priceRange, minRating, sortType, currentPage, itemsPerPage])
    
    // ----------------------------------------------------
    // 2. FETCH DỮ LIỆU TỪ SERVER SỬ DỤNG SWR
    // ----------------------------------------------------
    const { data, error, isLoading } = useSWR(
        `${API_BASE}?${queryString}`,
        fetcher,
        { 
            // Cấu hình SWR để giữ lại dữ liệu cũ khi chuyển trang (tùy chọn)
            keepPreviousData: true 
        }
    )

    // Lấy dữ liệu sản phẩm và tổng số lượng từ API response
    const paginatedProducts = data?.products || []
    const totalProducts = data?.total || 0
    const totalPages = Math.ceil(totalProducts / itemsPerPage)

    const startIdx = (currentPage - 1) * itemsPerPage
    const endIdx = startIdx + paginatedProducts.length // Sử dụng length thực tế

    const handleCategoryChange = (category: string | null) => {
        setSelectedCategory(category)
        setCurrentPage(1)

        updateQuery({
            category: category,
            page: "1",
        })
    }

    const handleSearchChange = (term: string) => {
        setSearchTerm(term)
        setCurrentPage(1)

        updateQuery({
            search: term || null,
            page: "1",
        })
    }

    // Hiển thị trạng thái tải và lỗi
    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 text-center text-red-600">
                Lỗi tải dữ liệu sản phẩm. Vui lòng kiểm tra API: {API_BASE}?{queryString}
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Page header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Sản Phẩm</h1>
                <p className="text-neutral-600">
                    {isLoading ? "Đang tải..." : (
                         `Hiển thị ${totalProducts > 0 ? startIdx + 1 : 0}-${endIdx} trong ${totalProducts} sản phẩm`
                    )}
                </p>
            </div>

            <div className="flex gap-6">
                {/* Sidebar */}
                <div className="hidden lg:block flex-shrink-0">
                    <FilterSidebar
                        onCategoryChange={handleCategoryChange}
                        onPriceChange={(min, max) => {
                            setPriceRange([min, max])
                            setCurrentPage(1)
                        }}
                        onRatingChange={(rating) => {
                            setMinRating(rating)
                            setCurrentPage(1)
                            // Fix: Update URL query when rating changes
                            updateQuery({
                                minRating: rating > 0 ? rating.toString() : null,
                                page: "1",
                            })
                        }}
                        selectedCategory={selectedCategory || ""}
                    />
                </div>

                {/* Main content */}
                <div className="flex-1">
                    {/* Search and controls */}
                    <div className="mb-6 space-y-4">
                        {/* Search bar */}
                        <div className="flex items-center bg-white border border-border rounded-lg px-4 py-3">
                            <input
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchTerm}
                                onChange={(e) => handleSearchChange(e.target.value)}
                                className="flex-1 outline-none bg-transparent"
                            />
                            <span className="text-neutral-400">🔍</span>
                        </div>

                        {/* Controls - Sort and View */}
                        <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-white border border-border rounded-lg p-4">
                            {/* Sort dropdown */}
                            <div>
                                <label className="text-sm font-medium text-neutral-600 block mb-2">Sắp xếp:</label>
                                <select
                                    value={sortType}
                                    onChange={(e) => {
                                        const value = e.target.value as SortType
                                        setSortType(value)
                                        setCurrentPage(1)

                                        updateQuery({
                                            sort: value,
                                            page: "1",
                                        })
                                    }}
                                    className="px-4 py-2 border border-border rounded-lg outline-none focus:border-primary transition text-sm"
                                >
                                    <option value="newest">Mới Nhất</option>
                                    <option value="bestselling">Bán Chạy Nhất</option>
                                    <option value="price-asc">Giá: Thấp đến Cao</option>
                                    <option value="price-desc">Giá: Cao đến Thấp</option>
                                    <option value="rating">Đánh Giá Cao</option>
                                </select>
                            </div>

                            {/* View toggle */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setViewType("grid")}
                                    className={`p-2 rounded-lg border transition ${
                                        viewType === "grid" ? "bg-primary text-white border-primary" : "border-border hover:bg-neutral-100"
                                    }`}
                                    title="Grid view"
                                >
                                    <Grid2X2 size={20} />
                                </button>
                                <button
                                    onClick={() => setViewType("list")}
                                    className={`p-2 rounded-lg border transition ${
                                        viewType === "list" ? "bg-primary text-white border-primary" : "border-border hover:bg-neutral-100"
                                    }`}
                                    title="List view"
                                >
                                    <List size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Products display */}
                    {isLoading ? (
                        <div className="text-center py-12">Đang tải sản phẩm...</div>
                    ) : paginatedProducts.length > 0 ? (
                        <>
                            {viewType === "grid" ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
                                    {paginatedProducts.map((product: any) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <div className="mb-8">
                                    <ProductListView products={paginatedProducts} />
                                </div>
                            )}

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex items-center justify-center gap-2 py-8">
                                    <button
                                        onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 border border-border rounded-lg hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    >
                                        Trước
                                    </button>

                                    {/* Hiển thị trang hiện tại và các trang lân cận */}
                                    {Array.from({ length: totalPages }).map((_, i) => {
                                        const page = i + 1
                                        // Logic hiển thị chỉ 5 trang lân cận + ... (tùy chỉnh)
                                        if (
                                            page === 1 || 
                                            page === totalPages ||
                                            (page >= currentPage - 2 && page <= currentPage + 2)
                                        ) {
                                            return (
                                                <button
                                                    key={page}
                                                    onClick={() => {
                                                        setCurrentPage(page)
                                                        updateQuery({
                                                            page: page.toString(),
                                                        })
                                                    }}
                                                    className={`px-4 py-2 rounded-lg border transition ${
                                                        currentPage === page
                                                            ? "bg-primary text-white border-primary"
                                                            : "border-border hover:bg-neutral-100"
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            )
                                        }
                                        // Hiển thị dấu ... nếu cần
                                        if (page === currentPage - 3 || page === currentPage + 3) {
                                            return <span key={`dots-${page}`} className="px-2 text-neutral-500">...</span>
                                        }
                                        return null;
                                    })}

                                    <button
                                        onClick={() =>
                                            setCurrentPage((prev) => {
                                                const next = Math.min(totalPages, prev + 1)
                                                updateQuery({
                                                    page: next.toString(),
                                                })
                                                return next
                                            })
                                        }
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 border border-border rounded-lg hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    >
                                        Sau
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-neutral-500 text-lg">Không tìm thấy sản phẩm</p>
                            <button
                                onClick={() => {
                                    setSearchTerm("")
                                    setSelectedCategory(null)
                                    setPriceRange([0, 150000])
                                    setMinRating(0)
                                    setCurrentPage(1)

                                    updateQuery({
                                        search: null,
                                        category: null,
                                        page: "1",
                                    })
                                }}
                                className="mt-4 px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition"
                            >
                                Đặt Lại Bộ Lọc
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
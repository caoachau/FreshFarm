"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var navigation_1 = require("next/navigation");
// import { products } from "@/data/products" // ⬅️ Xóa import dữ liệu tĩnh
var filter_sidebar_1 = require("@/components/products/filter-sidebar");
var product_card_1 = require("@/components/products/product-card");
var product_list_view_1 = require("@/components/products/product-list-view");
var swr_1 = require("swr"); // ⬅️ Thêm SWR
var fetcher_1 = require("@/lib/fetcher"); // ⬅️ Import fetcher
// API Get Products hỗ trợ các Query Params:
// category, search, sort, page, limit, minPrice, maxPrice, minRating
var API_BASE = "/api/products";
function ProductsPage() {
    var searchParams = navigation_1.useSearchParams();
    var router = navigation_1.useRouter();
    var pathname = navigation_1.usePathname();
    var _a = react_1.useState(""), searchTerm = _a[0], setSearchTerm = _a[1];
    var _b = react_1.useState(null), selectedCategory = _b[0], setSelectedCategory = _b[1];
    var _c = react_1.useState([0, 150000]), priceRange = _c[0], setPriceRange = _c[1];
    var _d = react_1.useState(0), minRating = _d[0], setMinRating = _d[1];
    var _e = react_1.useState("grid"), viewType = _e[0], setViewType = _e[1];
    var _f = react_1.useState("newest"), sortType = _f[0], setSortType = _f[1];
    var _g = react_1.useState(1), currentPage = _g[0], setCurrentPage = _g[1];
    // Đồng bộ state với query trên URL (search, category, sort, page)
    react_1.useEffect(function () {
        var search = searchParams.get("search") || "";
        var category = searchParams.get("category");
        var sort = searchParams.get("sort") || "newest";
        var page = Number.parseInt(searchParams.get("page") || "1");
        setSearchTerm(search);
        setSelectedCategory(category);
        setSortType(sort);
        setCurrentPage(Number.isNaN(page) || page < 1 ? 1 : page);
    }, [searchParams]);
    // Helper cập nhật URL khi thay đổi filter/search/sort/page
    var updateQuery = function (updates) {
        var params = new URLSearchParams(searchParams.toString());
        Object.entries(updates).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            if (value === null || value === "") {
                params["delete"](key);
            }
            else {
                params.set(key, value);
            }
        });
        var queryString = params.toString();
        router.push(queryString ? pathname + "?" + queryString : pathname);
    };
    // itemsPerPage được dùng để tính toán giới hạn (limit) cho API
    var itemsPerPage = viewType === "grid" ? 12 : 8;
    // ----------------------------------------------------
    // 1. TẠO QUERY STRING DỰA TRÊN STATE
    // ----------------------------------------------------
    var queryString = react_1.useMemo(function () {
        var params = new URLSearchParams();
        // Phân trang & Giới hạn (Pagination & Limit)
        params.append('page', currentPage.toString());
        params.append('limit', itemsPerPage.toString()); // Dùng limit cho API
        // Tìm kiếm (Search)
        if (searchTerm) {
            params.append('search', searchTerm);
        }
        // Danh mục (Category)
        if (selectedCategory) {
            // API sử dụng slug danh mục
            params.append('category', selectedCategory);
        }
        // Sắp xếp (Sort)
        // API hỗ trợ: newest | bestselling | price-asc | price-desc | rating
        params.append('sort', sortType);
        // Lọc Giá (Price Filter) - Giả định API hỗ trợ minPrice và maxPrice
        params.append('minPrice', priceRange[0].toString());
        params.append('maxPrice', priceRange[1].toString());
        // Lọc Đánh giá (Rating Filter) - Giả định API hỗ trợ minRating
        if (minRating > 0) {
            params.append('minRating', minRating.toString());
        }
        return params.toString();
    }, [searchTerm, selectedCategory, priceRange, minRating, sortType, currentPage, itemsPerPage]);
    // ----------------------------------------------------
    // 2. FETCH DỮ LIỆU TỪ SERVER SỬ DỤNG SWR
    // ----------------------------------------------------
    var _h = swr_1["default"](API_BASE + "?" + queryString, fetcher_1.fetcher, {
        // Cấu hình SWR để giữ lại dữ liệu cũ khi chuyển trang (tùy chọn)
        keepPreviousData: true
    }), data = _h.data, error = _h.error, isLoading = _h.isLoading;
    // Lấy dữ liệu sản phẩm và tổng số lượng từ API response
    var paginatedProducts = (data === null || data === void 0 ? void 0 : data.products) || [];
    var totalProducts = (data === null || data === void 0 ? void 0 : data.total) || 0;
    var totalPages = Math.ceil(totalProducts / itemsPerPage);
    var startIdx = (currentPage - 1) * itemsPerPage;
    var endIdx = startIdx + paginatedProducts.length; // Sử dụng length thực tế
    var handleCategoryChange = function (category) {
        setSelectedCategory(category);
        setCurrentPage(1);
        updateQuery({
            category: category,
            page: "1"
        });
    };
    var handleSearchChange = function (term) {
        setSearchTerm(term);
        setCurrentPage(1);
        updateQuery({
            search: term || null,
            page: "1"
        });
    };
    // Hiển thị trạng thái tải và lỗi
    if (error) {
        return (React.createElement("div", { className: "max-w-7xl mx-auto px-4 py-12 text-center text-red-600" },
            "L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u s\u1EA3n ph\u1EA9m. Vui l\u00F2ng ki\u1EC3m tra API: ",
            API_BASE,
            "?",
            queryString));
    }
    return (React.createElement("div", { className: "max-w-7xl mx-auto px-4 py-8" },
        React.createElement("div", { className: "mb-8" },
            React.createElement("h1", { className: "text-3xl font-bold mb-2" }, "S\u1EA3n Ph\u1EA9m"),
            React.createElement("p", { className: "text-neutral-600" }, isLoading ? "Đang tải..." : ("Hi\u1EC3n th\u1ECB " + (totalProducts > 0 ? startIdx + 1 : 0) + "-" + endIdx + " trong " + totalProducts + " s\u1EA3n ph\u1EA9m"))),
        React.createElement("div", { className: "flex gap-6" },
            React.createElement("div", { className: "hidden lg:block flex-shrink-0" },
                React.createElement(filter_sidebar_1["default"], { onCategoryChange: handleCategoryChange, onPriceChange: function (min, max) {
                        setPriceRange([min, max]);
                        setCurrentPage(1);
                    }, onRatingChange: function (rating) {
                        setMinRating(rating);
                        setCurrentPage(1);
                    }, selectedCategory: selectedCategory || "" })),
            React.createElement("div", { className: "flex-1" },
                React.createElement("div", { className: "mb-6 space-y-4" },
                    React.createElement("div", { className: "flex items-center bg-white border border-border rounded-lg px-4 py-3" },
                        React.createElement("input", { type: "text", placeholder: "T\u00ECm ki\u1EBFm s\u1EA3n ph\u1EA9m...", value: searchTerm, onChange: function (e) { return handleSearchChange(e.target.value); }, className: "flex-1 outline-none bg-transparent" }),
                        React.createElement("span", { className: "text-neutral-400" }, "\uD83D\uDD0D")),
                    React.createElement("div", { className: "flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between bg-white border border-border rounded-lg p-4" },
                        React.createElement("div", null,
                            React.createElement("label", { className: "text-sm font-medium text-neutral-600 block mb-2" }, "S\u1EAFp x\u1EBFp:"),
                            React.createElement("select", { value: sortType, onChange: function (e) {
                                    var value = e.target.value;
                                    setSortType(value);
                                    setCurrentPage(1);
                                    updateQuery({
                                        sort: value,
                                        page: "1"
                                    });
                                }, className: "px-4 py-2 border border-border rounded-lg outline-none focus:border-primary transition text-sm" },
                                React.createElement("option", { value: "newest" }, "M\u1EDBi Nh\u1EA5t"),
                                React.createElement("option", { value: "bestselling" }, "B\u00E1n Ch\u1EA1y Nh\u1EA5t"),
                                React.createElement("option", { value: "price-asc" }, "Gi\u00E1: Th\u1EA5p \u0111\u1EBFn Cao"),
                                React.createElement("option", { value: "price-desc" }, "Gi\u00E1: Cao \u0111\u1EBFn Th\u1EA5p"),
                                React.createElement("option", { value: "rating" }, "\u0110\u00E1nh Gi\u00E1 Cao"))),
                        React.createElement("div", { className: "flex gap-2" },
                            React.createElement("button", { onClick: function () { return setViewType("grid"); }, className: "p-2 rounded-lg border transition " + (viewType === "grid" ? "bg-primary text-white border-primary" : "border-border hover:bg-neutral-100"), title: "Grid view" },
                                React.createElement(lucide_react_1.Grid2X2, { size: 20 })),
                            React.createElement("button", { onClick: function () { return setViewType("list"); }, className: "p-2 rounded-lg border transition " + (viewType === "list" ? "bg-primary text-white border-primary" : "border-border hover:bg-neutral-100"), title: "List view" },
                                React.createElement(lucide_react_1.List, { size: 20 }))))),
                isLoading ? (React.createElement("div", { className: "text-center py-12" }, "\u0110ang t\u1EA3i s\u1EA3n ph\u1EA9m...")) : paginatedProducts.length > 0 ? (React.createElement(React.Fragment, null,
                    viewType === "grid" ? (React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8" }, paginatedProducts.map(function (product) { return (React.createElement(product_card_1["default"], { key: product.id, product: product })); }))) : (React.createElement("div", { className: "mb-8" },
                        React.createElement(product_list_view_1["default"], { products: paginatedProducts }))),
                    totalPages > 1 && (React.createElement("div", { className: "flex items-center justify-center gap-2 py-8" },
                        React.createElement("button", { onClick: function () { return setCurrentPage(function (prev) { return Math.max(1, prev - 1); }); }, disabled: currentPage === 1, className: "px-4 py-2 border border-border rounded-lg hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition" }, "Tr\u01B0\u1EDBc"),
                        Array.from({ length: totalPages }).map(function (_, i) {
                            var page = i + 1;
                            // Logic hiển thị chỉ 5 trang lân cận + ... (tùy chỉnh)
                            if (page === 1 ||
                                page === totalPages ||
                                (page >= currentPage - 2 && page <= currentPage + 2)) {
                                return (React.createElement("button", { key: page, onClick: function () {
                                        setCurrentPage(page);
                                        updateQuery({
                                            page: page.toString()
                                        });
                                    }, className: "px-4 py-2 rounded-lg border transition " + (currentPage === page
                                        ? "bg-primary text-white border-primary"
                                        : "border-border hover:bg-neutral-100") }, page));
                            }
                            // Hiển thị dấu ... nếu cần
                            if (page === currentPage - 3 || page === currentPage + 3) {
                                return React.createElement("span", { key: "dots-" + page, className: "px-2 text-neutral-500" }, "...");
                            }
                            return null;
                        }),
                        React.createElement("button", { onClick: function () {
                                return setCurrentPage(function (prev) {
                                    var next = Math.min(totalPages, prev + 1);
                                    updateQuery({
                                        page: next.toString()
                                    });
                                    return next;
                                });
                            }, disabled: currentPage === totalPages, className: "px-4 py-2 border border-border rounded-lg hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed transition" }, "Sau"))))) : (React.createElement("div", { className: "text-center py-12" },
                    React.createElement("p", { className: "text-neutral-500 text-lg" }, "Kh\u00F4ng t\u00ECm th\u1EA5y s\u1EA3n ph\u1EA9m"),
                    React.createElement("button", { onClick: function () {
                            setSearchTerm("");
                            setSelectedCategory(null);
                            setPriceRange([0, 150000]);
                            setMinRating(0);
                            setCurrentPage(1);
                            updateQuery({
                                search: null,
                                category: null,
                                page: "1"
                            });
                        }, className: "mt-4 px-6 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition" }, "\u0110\u1EB7t L\u1EA1i B\u1ED9 L\u1ECDc")))))));
}
exports["default"] = ProductsPage;

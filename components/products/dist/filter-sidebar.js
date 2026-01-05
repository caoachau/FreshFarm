"use client";
"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
// import { categories } from "@/data/products" // ⬅️ Xóa import dữ liệu tĩnh
var swr_1 = require("swr"); // ⬅️ Thêm SWR
var fetcher_1 = require("@/lib/fetcher"); // ⬅️ Giả định fetcher đã được tạo
function FilterSidebar(_a) {
    var onCategoryChange = _a.onCategoryChange, onPriceChange = _a.onPriceChange, onRatingChange = _a.onRatingChange, selectedCategory = _a.selectedCategory;
    var _b = react_1.useState(["category", "price", "rating"]), expandedSections = _b[0], setExpandedSections = _b[1];
    var _c = react_1.useState([0, 150000]), priceRange = _c[0], setPriceRange = _c[1];
    var _d = react_1.useState(0), selectedRating = _d[0], setSelectedRating = _d[1];
    // 1. FETCH DỮ LIỆU DANH MỤC TỪ API
    var _e = swr_1["default"]('/api/categories', // ⬅️ Endpoint API giả định để lấy danh mục
    fetcher_1.fetcher), categoriesData = _e.data, categoriesError = _e.error, isLoadingCategories = _e.isLoading;
    var categories = categoriesData || [];
    var toggleSection = function (section) {
        setExpandedSections(function (prev) { return (prev.includes(section) ? prev.filter(function (s) { return s !== section; }) : __spreadArrays(prev, [section])); });
    };
    var handlePriceChange = function (min, max) {
        setPriceRange([min, max]);
        onPriceChange(min, max);
    };
    var handleRatingChange = function (rating) {
        setSelectedRating(rating);
        onRatingChange(rating);
    };
    if (categoriesError) {
        // Tùy chọn: Xử lý lỗi tải danh mục
        return React.createElement("aside", { className: "w-full lg:w-64 bg-white rounded-lg border border-border p-4 h-fit text-red-500" }, "L\u1ED7i t\u1EA3i danh m\u1EE5c.");
    }
    return (React.createElement("aside", { className: "w-full lg:w-64 bg-white rounded-lg border border-border p-4 h-fit" },
        React.createElement("div", { className: "mb-6" },
            React.createElement("button", { onClick: function () { return toggleSection("category"); }, className: "w-full flex items-center justify-between font-bold text-lg mb-3 hover:text-primary transition" },
                React.createElement("span", null, "Danh M\u1EE5c"),
                React.createElement(lucide_react_1.ChevronDown, { size: 20, className: "transition " + (expandedSections.includes("category") ? "rotate-180" : "") })),
            expandedSections.includes("category") && (React.createElement("div", { className: "space-y-2" },
                isLoadingCategories && React.createElement("span", { className: "text-sm text-neutral-500" }, "\u0110ang t\u1EA3i..."),
                React.createElement("label", { className: "flex items-center gap-2 cursor-pointer hover:text-primary transition" },
                    React.createElement("input", { type: "radio", name: "category", value: "", checked: !selectedCategory, onChange: function (e) { return onCategoryChange(null); }, className: "cursor-pointer" }),
                    React.createElement("span", { className: "text-sm" }, "T\u1EA5t C\u1EA3 S\u1EA3n Ph\u1EA9m")),
                categories.map(function (cat) { return ( // Cần typing cho cat
                React.createElement("label", { key: cat.id, className: "flex items-center gap-2 cursor-pointer hover:text-primary transition" },
                    React.createElement("input", { type: "radio", name: "category", 
                        // 2. Sử dụng cat.slug để lọc sản phẩm
                        value: cat.slug, checked: selectedCategory === cat.slug, onChange: function (e) { return onCategoryChange(e.target.value); }, className: "cursor-pointer" }),
                    React.createElement("span", { className: "text-sm" }, cat.name))); })))),
        React.createElement("div", { className: "mb-6 pb-6 border-b border-border" },
            React.createElement("button", { onClick: function () { return toggleSection("price"); }, className: "w-full flex items-center justify-between font-bold text-lg mb-3 hover:text-primary transition" },
                React.createElement("span", null, "Gi\u00E1"),
                React.createElement(lucide_react_1.ChevronDown, { size: 20, className: "transition " + (expandedSections.includes("price") ? "rotate-180" : "") })),
            expandedSections.includes("price") && (React.createElement("div", { className: "space-y-4" },
                React.createElement("div", null,
                    React.createElement("label", { className: "text-sm text-neutral-600 block mb-2" },
                        "Gi\u00E1 T\u1ED1i Thi\u1EC3u: ",
                        priceRange[0].toLocaleString(),
                        "\u20AB"),
                    React.createElement("input", { type: "range", min: "0", max: "150000", step: "5000", value: priceRange[0], onChange: function (e) { return handlePriceChange(Number(e.target.value), priceRange[1]); }, className: "w-full" })),
                React.createElement("div", null,
                    React.createElement("label", { className: "text-sm text-neutral-600 block mb-2" },
                        "Gi\u00E1 T\u1ED1i \u0110a: ",
                        priceRange[1].toLocaleString(),
                        "\u20AB"),
                    React.createElement("input", { type: "range", min: "0", max: "150000", step: "5000", value: priceRange[1], onChange: function (e) { return handlePriceChange(priceRange[0], Number(e.target.value)); }, className: "w-full" })),
                React.createElement("button", { onClick: function () { return handlePriceChange(0, 150000); }, className: "w-full py-2 px-3 bg-neutral-100 hover:bg-neutral-200 rounded transition text-sm font-medium" }, "\u0110\u1EB7t L\u1EA1i")))),
        React.createElement("div", null,
            React.createElement("button", { onClick: function () { return toggleSection("rating"); }, className: "w-full flex items-center justify-between font-bold text-lg mb-3 hover:text-primary transition" },
                React.createElement("span", null, "\u0110\u00E1nh Gi\u00E1"),
                React.createElement(lucide_react_1.ChevronDown, { size: 20, className: "transition " + (expandedSections.includes("rating") ? "rotate-180" : "") })),
            expandedSections.includes("rating") && (React.createElement("div", { className: "space-y-2" },
                [5, 4, 3, 2, 1].map(function (rating) { return (React.createElement("label", { key: rating, className: "flex items-center gap-2 cursor-pointer hover:text-primary transition" },
                    React.createElement("input", { type: "radio", name: "rating", value: rating, checked: selectedRating === rating, onChange: function (e) { return handleRatingChange(Number(e.target.value)); }, className: "cursor-pointer" }),
                    React.createElement("span", { className: "text-yellow-400" }, "★".repeat(rating)),
                    React.createElement("span", { className: "text-sm text-neutral-600" },
                        rating,
                        " sao"))); }),
                React.createElement("label", { className: "flex items-center gap-2 cursor-pointer hover:text-primary transition" },
                    React.createElement("input", { type: "radio", name: "rating", value: "0", checked: selectedRating === 0, onChange: function () { return handleRatingChange(0); }, className: "cursor-pointer" }),
                    React.createElement("span", { className: "text-sm text-neutral-600" }, "T\u1EA5t C\u1EA3")))))));
}
exports["default"] = FilterSidebar;

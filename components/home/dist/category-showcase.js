"use strict";
exports.__esModule = true;
var link_1 = require("next/link");
var swr_1 = require("swr"); // ⬅️ Thêm SWR
var fetcher_1 = require("@/lib/fetcher"); // ⬅️ Giả định fetcher đã được tạo
function CategoryShowcase() {
    // Gọi API để lấy danh sách danh mục
    var _a = swr_1["default"]('/api/categories', // ⬅️ Endpoint API giả định để lấy danh mục
    fetcher_1.fetcher), categoriesData = _a.data, error = _a.error;
    // Xử lý Loading và Error State
    if (error)
        return (React.createElement("section", { className: "py-8 text-red-600" }, "L\u1ED7i t\u1EA3i danh m\u1EE5c: Vui l\u00F2ng ki\u1EC3m tra API /api/categories."));
    // Nếu chưa có dữ liệu và không có lỗi, đang tải
    if (!categoriesData)
        return React.createElement("section", { className: "py-8 text-center" }, "\u0110ang t\u1EA3i danh m\u1EE5c...");
    // Lấy danh sách danh mục (API trả về array categories)
    var categories = categoriesData || [];
    return (React.createElement("section", { className: "py-12" },
        React.createElement("div", { className: "flex items-center justify-between mb-8" },
            React.createElement("div", null,
                React.createElement("h2", { className: "text-3xl sm:text-4xl font-black text-gray-800 mb-2" }, "Danh M\u1EE5c S\u1EA3n Ph\u1EA9m"),
                React.createElement("p", { className: "text-gray-600" }, "Kh\u00E1m ph\u00E1 c\u00E1c lo\u1EA1i n\u00F4ng s\u1EA3n t\u01B0\u01A1i ngon"))),
        React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6" }, categories.map(function (category) { return (React.createElement(link_1["default"], { key: category.id, href: "/products?category=" + category.slug, className: "group relative h-48 sm:h-52 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2" },
            React.createElement("div", { className: "absolute inset-0 transition-transform duration-500 group-hover:scale-110", style: {
                    backgroundImage: "url('" + category.image + "')",
                    backgroundSize: "cover",
                    backgroundPosition: "center"
                } }),
            React.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent group-hover:from-black/80 transition-all duration-300" }),
            React.createElement("div", { className: "absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/30 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" }),
            React.createElement("div", { className: "relative h-full flex flex-col items-center justify-end p-4 sm:p-5" },
                category.icon && (React.createElement("div", { className: "mb-3 text-4xl sm:text-5xl transform group-hover:scale-110 transition-transform duration-300 filter drop-shadow-lg" }, category.icon)),
                React.createElement("h3", { className: "font-bold text-white text-sm sm:text-base text-center leading-tight mb-2 transform group-hover:translate-y-0 transition-transform" }, category.name),
                React.createElement("div", { className: "flex items-center gap-1 text-white/80 text-xs opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300" },
                    React.createElement("span", { className: "font-medium" }, "Xem th\u00EAm"),
                    React.createElement("svg", { className: "w-4 h-4 animate-bounce-x", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                        React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 5l7 7-7 7" })))),
            React.createElement("div", { className: "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" },
                React.createElement("div", { className: "absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" })))); })),
        React.createElement("style", { jsx: true }, "\n        @keyframes bounce-x {\n          0%, 100% {\n            transform: translateX(0);\n          }\n          50% {\n            transform: translateX(4px);\n          }\n        }\n        .animate-bounce-x {\n          animation: bounce-x 1s ease-in-out infinite;\n        }\n      ")));
}
exports["default"] = CategoryShowcase;

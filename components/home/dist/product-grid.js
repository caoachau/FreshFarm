"use strict";
exports.__esModule = true;
var product_card_1 = require("@/components/products/product-card");
// Chú ý: productsData sẽ là dữ liệu đã được fetch từ API,
// ví dụ: productsData = bestSelling (từ useSWR)
function ProductGrid(_a) {
    var title = _a.title, _b = _a.products, productsData = _b === void 0 ? [] : _b, _c = _a.limit, limit = _c === void 0 ? 8 : _c;
    // Xử lý trường hợp không có dữ liệu (khi đang tải hoặc API trả về mảng rỗng)
    if (!productsData || productsData.length === 0) {
        // Tùy chọn: hiển thị skeleton loading hoặc thông báo rỗng
        return null; // Hoặc một placeholder
    }
    return (React.createElement("section", { className: "py-8" },
        React.createElement("div", { className: "flex items-center justify-between mb-6" },
            React.createElement("h2", { className: "text-2xl font-bold" }, title),
            React.createElement("a", { href: "/products", className: "text-primary hover:text-primary-dark font-medium" }, "Xem T\u1EA5t C\u1EA3 \u2192")),
        React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" }, productsData.slice(0, limit).map(function (product) { return (React.createElement(product_card_1["default"], { key: product.id, product: product })); }))));
}
exports["default"] = ProductGrid;

"use strict";
exports.__esModule = true;
var product_card_1 = require("./product-card");
// Chú ý: Component này không cần tự fetch, chỉ render dữ liệu được truyền vào
function RelatedProducts(_a) {
    // Dữ liệu đã được fetch, lọc, và giới hạn số lượng (thường là 4) từ trang cha (ProductDetailPage)
    var relatedProducts = _a.relatedProducts;
    if (!relatedProducts || relatedProducts.length === 0) {
        return null;
    }
    return (React.createElement("section", null,
        React.createElement("h2", { className: "text-2xl font-bold mb-6" }, "S\u1EA3n Ph\u1EA9m Li\u00EAn Quan"),
        React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4" }, relatedProducts.map(function (product) { return (
        // Không cần slice() vì dữ liệu đã được giới hạn từ API hoặc trang cha
        React.createElement(product_card_1["default"], { key: product.id, product: product })); }))));
}
exports["default"] = RelatedProducts;

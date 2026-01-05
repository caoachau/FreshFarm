"use client";
"use strict";
exports.__esModule = true;
var link_1 = require("next/link");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
function ProductListView(_a) {
    var products = _a.products;
    return (React.createElement("div", { className: "space-y-4" }, products.map(function (product) {
        var _a;
        return (React.createElement(link_1["default"], { key: product.id, href: "/products/" + product.id },
            React.createElement("div", { className: "bg-white rounded-lg border border-border p-4 hover:shadow-md transition group cursor-pointer flex gap-4" },
                React.createElement("div", { className: "relative bg-neutral-100 w-32 h-32 sm:w-40 sm:h-40 rounded-lg overflow-hidden flex-shrink-0" },
                    React.createElement("img", { src: product.image || "/placeholder.svg", alt: product.name, className: "w-full h-full object-cover group-hover:scale-110 transition duration-300" }),
                    product.discount && (React.createElement("div", { className: "absolute top-2 right-2 bg-accent text-white px-2 py-1 rounded font-bold text-sm" },
                        "-",
                        product.discount,
                        "%"))),
                React.createElement("div", { className: "flex-1 flex flex-col justify-between" },
                    React.createElement("div", null,
                        product.brand && React.createElement("p", { className: "text-sm text-neutral-500 mb-1" }, product.brand),
                        React.createElement("h3", { className: "font-bold text-lg group-hover:text-primary transition mb-2" }, product.name),
                        React.createElement("p", { className: "text-neutral-600 text-sm line-clamp-2 mb-3" }, product.description),
                        product.rating && (React.createElement("div", { className: "flex items-center gap-2" },
                            React.createElement("div", { className: "flex text-yellow-400" }, "★".repeat(Math.floor(product.rating))),
                            React.createElement("span", { className: "text-sm text-neutral-600" },
                                product.rating,
                                " (",
                                typeof product.reviews === 'number' ? product.reviews : ((_a = product.reviews) === null || _a === void 0 ? void 0 : _a.length) || 0,
                                " \u0111\u00E1nh gi\u00E1)")))),
                    React.createElement("div", { className: "flex items-center justify-between mt-4" },
                        React.createElement("div", { className: "flex items-baseline gap-2" },
                            React.createElement("span", { className: "font-bold text-xl text-primary" },
                                product.price.toLocaleString(),
                                "\u20AB"),
                            product.originalPrice && (React.createElement("span", { className: "text-sm text-neutral-500 line-through" },
                                product.originalPrice.toLocaleString(),
                                "\u20AB"))),
                        React.createElement("div", { className: "flex gap-2" },
                            React.createElement("button", { className: "p-2 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition", onClick: function (e) {
                                    e.preventDefault();
                                } },
                                React.createElement(lucide_react_1.Heart, { size: 18, className: "text-neutral-600" })),
                            React.createElement(button_1.Button, { className: "bg-primary hover:bg-primary-dark text-white", onClick: function (e) {
                                    e.preventDefault();
                                } },
                                React.createElement(lucide_react_1.ShoppingCart, { size: 18, className: "mr-2" }),
                                "Th\u00EAm Gi\u1ECF")))))));
    })));
}
exports["default"] = ProductListView;

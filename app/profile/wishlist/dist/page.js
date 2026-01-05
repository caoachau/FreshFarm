"use client";
"use strict";
exports.__esModule = true;
var link_1 = require("next/link");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var use_wishlist_1 = require("@/hooks/use-wishlist");
var use_auth_1 = require("@/hooks/use-auth");
var react_1 = require("react");
function WishlistPage() {
    var isAuthenticated = use_auth_1.useAuth().isAuthenticated;
    var _a = use_wishlist_1.useWishlist(), items = _a.items, removeFromWishlist = _a.removeFromWishlist, isLoaded = _a.isLoaded;
    var _b = react_1.useState([]), wishlistProducts = _b[0], setWishlistProducts = _b[1];
    react_1.useEffect(function () {
        if (isLoaded && items.length > 0) {
            // Fetch products for wishlist items
            Promise.all(items.map(function (productId) {
                return fetch("/api/products/" + productId)
                    .then(function (res) { return res.json(); })
                    .then(function (data) { return data.product; })["catch"](function () { return null; });
            })).then(function (products) {
                setWishlistProducts(products.filter(function (p) { return p !== null; }));
            });
        }
    }, [items, isLoaded]);
    if (!isAuthenticated) {
        return (React.createElement("div", { className: "max-w-7xl mx-auto px-4 py-12 text-center" },
            React.createElement("h1", { className: "text-2xl font-bold mb-4" }, "Vui l\u00F2ng \u0111\u0103ng nh\u1EADp"),
            React.createElement(link_1["default"], { href: "/auth/login" },
                React.createElement(button_1.Button, { className: "bg-primary hover:bg-primary-dark text-white" }, "\u0110\u0103ng Nh\u1EADp"))));
    }
    if (!isLoaded) {
        return React.createElement("div", { className: "text-center py-12" }, "\u0110ang t\u1EA3i...");
    }
    return (React.createElement("div", { className: "max-w-7xl mx-auto px-4 py-8" },
        React.createElement("h1", { className: "text-3xl font-bold mb-8" }, "S\u1EA3n Ph\u1EA9m Y\u00EAu Th\u00EDch"),
        wishlistProducts.length === 0 ? (React.createElement("div", { className: "text-center py-12 bg-neutral-50 rounded-lg" },
            React.createElement(lucide_react_1.Heart, { size: 64, className: "mx-auto text-neutral-300 mb-4" }),
            React.createElement("h2", { className: "text-2xl font-bold mb-2" }, "Danh s\u00E1ch y\u00EAu th\u00EDch tr\u1ED1ng"),
            React.createElement("p", { className: "text-neutral-600 mb-6" }, "H\u00E3y th\u00EAm nh\u1EEFng s\u1EA3n ph\u1EA9m b\u1EA1n th\u00EDch v\u00E0o \u0111\u00E2y"),
            React.createElement(link_1["default"], { href: "/products" },
                React.createElement(button_1.Button, { className: "bg-primary hover:bg-primary-dark text-white" }, "Ti\u1EBFp T\u1EE5c Mua S\u1EAFm")))) : (React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" }, wishlistProducts.map(function (product) { return (React.createElement("div", { key: product.id, className: "bg-white border border-border rounded-lg overflow-hidden hover:shadow-md transition" },
            React.createElement(link_1["default"], { href: "/products/" + product.id },
                React.createElement("div", { className: "relative bg-neutral-100 h-48 overflow-hidden group" },
                    React.createElement("img", { src: product.image || "/placeholder.svg", alt: product.name, className: "w-full h-full object-cover group-hover:scale-110 transition duration-300" }),
                    product.discount && (React.createElement("div", { className: "absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded font-bold text-sm" },
                        "-",
                        product.discount,
                        "%")))),
            React.createElement("div", { className: "p-4" },
                React.createElement(link_1["default"], { href: "/products/" + product.id },
                    React.createElement("h3", { className: "font-bold line-clamp-2 hover:text-primary transition mb-2" }, product.name)),
                React.createElement("div", { className: "flex items-center gap-1 mb-3" },
                    React.createElement("div", { className: "flex text-yellow-400 text-sm" }, "★".repeat(Math.floor(product.rating))),
                    React.createElement("span", { className: "text-xs text-neutral-600" },
                        product.rating,
                        " (",
                        product.reviews,
                        ")")),
                React.createElement("div", { className: "flex items-baseline gap-2 mb-4" },
                    React.createElement("span", { className: "font-bold text-lg text-primary" },
                        product.price.toLocaleString(),
                        "\u20AB"),
                    product.originalPrice && (React.createElement("span", { className: "text-xs text-neutral-500 line-through" },
                        product.originalPrice.toLocaleString(),
                        "\u20AB"))),
                React.createElement("div", { className: "flex gap-2" },
                    React.createElement("button", { onClick: function () { return removeFromWishlist(product.id); }, className: "flex-1 py-2 border border-border rounded-lg hover:bg-red-50 transition font-medium flex items-center justify-center gap-2 text-sm" },
                        React.createElement(lucide_react_1.Trash2, { size: 16 }),
                        " X\u00F3a"),
                    React.createElement("button", { className: "flex-1 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition font-medium flex items-center justify-center gap-2 text-sm" },
                        React.createElement(lucide_react_1.ShoppingCart, { size: 16 }),
                        " Th\u00EAm Gi\u1ECF"))))); })))));
}
exports["default"] = WishlistPage;

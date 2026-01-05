"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var link_1 = require("next/link");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var use_cart_1 = require("@/hooks/use-cart");
function CartPage() {
    var _a = use_cart_1.useCart(), items = _a.items, removeFromCart = _a.removeFromCart, updateQuantity = _a.updateQuantity, clearCart = _a.clearCart, isLoaded = _a.isLoaded;
    var _b = react_1.useState([]), cartWithDetails = _b[0], setCartWithDetails = _b[1];
    react_1.useEffect(function () {
        if (isLoaded) {
            var details = items
                .filter(function (item) { return item.product; });
            setCartWithDetails(details);
        }
    }, [items, isLoaded]);
    if (!isLoaded) {
        return React.createElement("div", { className: "text-center py-12" }, "\u0110ang t\u1EA3i...");
    }
    var subtotal = cartWithDetails.reduce(function (sum, item) { return sum + item.product.price * item.quantity; }, 0);
    var shipping = subtotal > 300000 ? 0 : 30000;
    var discount = subtotal * 0.05; // 5% loyalty discount
    var total = subtotal + shipping - discount;
    return (React.createElement("div", { className: "max-w-7xl mx-auto px-4 py-8" },
        React.createElement("h1", { className: "text-3xl font-bold mb-8" }, "Gi\u1ECF H\u00E0ng"),
        cartWithDetails.length === 0 ? (React.createElement("div", { className: "text-center py-12 bg-neutral-50 rounded-lg" },
            React.createElement(lucide_react_1.ShoppingCart, { size: 64, className: "mx-auto text-neutral-300 mb-4" }),
            React.createElement("h2", { className: "text-2xl font-bold mb-2" }, "Gi\u1ECF h\u00E0ng c\u1EE7a b\u1EA1n c\u00F2n tr\u1ED1ng"),
            React.createElement("p", { className: "text-neutral-600 mb-6" }, "Th\u00EAm c\u00E1c s\u1EA3n ph\u1EA9m v\u00E0o gi\u1ECF \u0111\u1EC3 ti\u1EBFp t\u1EE5c"),
            React.createElement(link_1["default"], { href: "/products" },
                React.createElement(button_1.Button, { className: "bg-primary hover:bg-primary-dark text-white" }, "Ti\u1EBFp T\u1EE5c Mua S\u1EAFm")))) : (React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8" },
            React.createElement("div", { className: "lg:col-span-2 space-y-4" },
                cartWithDetails.map(function (item) { return (React.createElement("div", { key: item.productId, className: "bg-white border border-border rounded-lg p-4 flex gap-4" },
                    React.createElement(link_1["default"], { href: "/products/" + item.productId },
                        React.createElement("img", { src: item.product.image || "/placeholder.svg", alt: item.product.name, className: "w-24 h-24 rounded object-cover hover:opacity-80 transition" })),
                    React.createElement("div", { className: "flex-1 flex flex-col justify-between" },
                        React.createElement("div", null,
                            React.createElement(link_1["default"], { href: "/products/" + item.productId },
                                React.createElement("h3", { className: "font-bold hover:text-primary transition" }, item.product.name)),
                            React.createElement("p", { className: "text-neutral-600 text-sm mt-1" }, item.product.brand)),
                        React.createElement("div", { className: "flex items-center justify-between" },
                            React.createElement("div", { className: "flex items-center border border-border rounded" },
                                React.createElement("button", { onClick: function () { return updateQuantity(item.id, item.quantity - 1); }, className: "p-1 hover:bg-neutral-100 transition" },
                                    React.createElement(lucide_react_1.Minus, { size: 16 })),
                                React.createElement("span", { className: "px-4 py-1 font-bold text-sm" }, item.quantity),
                                React.createElement("button", { onClick: function () { return updateQuantity(item.id, item.quantity + 1); }, className: "p-1 hover:bg-neutral-100 transition" },
                                    React.createElement(lucide_react_1.Plus, { size: 16 }))),
                            React.createElement("div", { className: "text-right" },
                                React.createElement("p", { className: "text-primary font-bold" },
                                    (item.product.price * item.quantity).toLocaleString(),
                                    "\u20AB"),
                                React.createElement("p", { className: "text-xs text-neutral-500" },
                                    item.product.price.toLocaleString(),
                                    "\u20AB x ",
                                    item.quantity)),
                            React.createElement("button", { onClick: function () { return removeFromCart(item.id); }, className: "p-2 hover:bg-red-50 rounded transition" },
                                React.createElement(lucide_react_1.Trash2, { size: 18, className: "text-red-500" })))))); }),
                React.createElement(link_1["default"], { href: "/products" },
                    React.createElement(button_1.Button, { variant: "outline", className: "w-full bg-transparent" }, "Ti\u1EBFp T\u1EE5c Mua S\u1EAFm"))),
            React.createElement("div", { className: "lg:col-span-1" },
                React.createElement("div", { className: "bg-white border border-border rounded-lg p-6 space-y-4 sticky top-24" },
                    React.createElement("h2", { className: "font-bold text-lg" }, "T\u00F3m T\u1EAFt \u0110\u01A1n H\u00E0ng"),
                    React.createElement("div", { className: "space-y-3 text-sm border-b border-border pb-4" },
                        React.createElement("div", { className: "flex justify-between" },
                            React.createElement("span", { className: "text-neutral-600" }, "T\u1EA1m t\u00EDnh:"),
                            React.createElement("span", { className: "font-bold" },
                                subtotal.toLocaleString(),
                                "\u20AB")),
                        React.createElement("div", { className: "flex justify-between" },
                            React.createElement("span", { className: "text-neutral-600" }, "Ph\u00ED giao h\u00E0ng:"),
                            React.createElement("span", { className: "font-bold " + (shipping === 0 ? "text-primary" : "") }, shipping === 0 ? "Miễn phí" : shipping.toLocaleString() + "₫")),
                        discount > 0 && (React.createElement("div", { className: "flex justify-between" },
                            React.createElement("span", { className: "text-green-600" }, "Gi\u1EA3m gi\u00E1:"),
                            React.createElement("span", { className: "font-bold text-green-600" },
                                "-",
                                discount.toLocaleString(),
                                "\u20AB")))),
                    React.createElement("div", { className: "flex justify-between text-lg font-bold text-primary pt-2" },
                        React.createElement("span", null, "T\u1ED5ng c\u1ED9ng:"),
                        React.createElement("span", null,
                            total.toLocaleString(),
                            "\u20AB")),
                    React.createElement(link_1["default"], { href: "/checkout", className: "block" },
                        React.createElement(button_1.Button, { className: "w-full bg-primary hover:bg-primary-dark text-white py-3 font-bold" }, "Thanh To\u00E1n Ngay")),
                    React.createElement("div", { className: "bg-neutral-50 rounded-lg p-3 text-xs text-neutral-600 space-y-2" },
                        React.createElement("p", null, "\u2713 Giao h\u00E0ng nhanh trong 2 gi\u1EDD"),
                        React.createElement("p", null, "\u2713 Thanh to\u00E1n an to\u00E0n 100%"),
                        React.createElement("p", null, "\u2713 Ho\u00E0n ti\u1EC1n 30 ng\u00E0y n\u1EBFu kh\u00F4ng h\u00E0i l\u00F2ng"))))))));
}
exports["default"] = CartPage;

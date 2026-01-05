"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var link_1 = require("next/link");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
function CartSidebar(_a) {
    var isOpen = _a.isOpen, onClose = _a.onClose, cartItems = _a.cartItems;
    var _b = react_1.useState([]), cartWithDetails = _b[0], setCartWithDetails = _b[1];
    react_1.useEffect(function () {
        var details = cartItems.filter(function (item) { return item.product; });
        setCartWithDetails(details);
    }, [cartItems]);
    var subtotal = cartWithDetails.reduce(function (sum, item) { return sum + item.product.price * item.quantity; }, 0);
    var shipping = subtotal > 300000 ? 0 : 30000;
    var total = subtotal + shipping;
    return (React.createElement(React.Fragment, null,
        isOpen && React.createElement("div", { className: "fixed inset-0 bg-black/50 z-40 transition", onClick: onClose }),
        React.createElement("div", { className: "fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-lg z-50 transition-transform duration-300 overflow-y-auto " + (isOpen ? "translate-x-0" : "translate-x-full") },
            React.createElement("div", { className: "sticky top-0 bg-white border-b border-border p-4 flex items-center justify-between" },
                React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement(lucide_react_1.ShoppingCart, { size: 20 }),
                    React.createElement("h2", { className: "font-bold text-lg" },
                        "Gi\u1ECF H\u00E0ng (",
                        cartItems.length,
                        ")")),
                React.createElement("button", { onClick: onClose, className: "p-1 hover:bg-neutral-100 rounded transition" },
                    React.createElement(lucide_react_1.X, { size: 20 }))),
            React.createElement("div", { className: "p-4 space-y-4 min-h-96" }, cartWithDetails.length === 0 ? (React.createElement("div", { className: "text-center py-12" },
                React.createElement(lucide_react_1.ShoppingCart, { size: 48, className: "mx-auto text-neutral-300 mb-4" }),
                React.createElement("p", { className: "text-neutral-600 mb-4" }, "Gi\u1ECF h\u00E0ng c\u1EE7a b\u1EA1n c\u00F2n tr\u1ED1ng"),
                React.createElement(link_1["default"], { href: "/products", onClick: onClose, className: "text-primary hover:text-primary-dark" }, "Ti\u1EBFp t\u1EE5c mua s\u1EAFm"))) : (cartWithDetails.map(function (item) { return (React.createElement("div", { key: item.productId, className: "border border-border rounded-lg p-3" },
                React.createElement("div", { className: "flex gap-3 mb-3" },
                    React.createElement("img", { src: item.product.image || "/placeholder.svg", alt: item.product.name, className: "w-16 h-16 rounded object-cover" }),
                    React.createElement("div", { className: "flex-1" },
                        React.createElement("p", { className: "font-bold text-sm line-clamp-2" }, item.product.name),
                        React.createElement("p", { className: "text-primary font-bold" },
                            (item.product.price * item.quantity).toLocaleString(),
                            "\u20AB"))),
                React.createElement("div", { className: "flex items-center justify-between" },
                    React.createElement("div", { className: "flex items-center border border-border rounded" },
                        React.createElement("button", { className: "p-1 hover:bg-neutral-100" },
                            React.createElement(lucide_react_1.Minus, { size: 14 })),
                        React.createElement("span", { className: "px-2 py-1 text-sm font-bold" }, item.quantity),
                        React.createElement("button", { className: "p-1 hover:bg-neutral-100" },
                            React.createElement(lucide_react_1.Plus, { size: 14 }))),
                    React.createElement("button", { className: "p-1 hover:bg-red-50 rounded transition" },
                        React.createElement(lucide_react_1.Trash2, { size: 16, className: "text-red-500" }))))); }))),
            cartWithDetails.length > 0 && (React.createElement("div", { className: "sticky bottom-0 border-t border-border bg-white p-4 space-y-4" },
                React.createElement("div", { className: "space-y-2" },
                    React.createElement("div", { className: "flex justify-between text-sm" },
                        React.createElement("span", null, "T\u1EA1m t\u00EDnh:"),
                        React.createElement("span", null,
                            subtotal.toLocaleString(),
                            "\u20AB")),
                    React.createElement("div", { className: "flex justify-between text-sm" },
                        React.createElement("span", null, "Ph\u00ED giao h\u00E0ng:"),
                        React.createElement("span", { className: shipping === 0 ? "text-primary" : "" }, shipping === 0 ? "Miễn phí" : shipping.toLocaleString() + "₫")),
                    React.createElement("div", { className: "flex justify-between font-bold text-lg border-t border-border pt-2" },
                        React.createElement("span", null, "T\u1ED5ng c\u1ED9ng:"),
                        React.createElement("span", { className: "text-primary" },
                            total.toLocaleString(),
                            "\u20AB"))),
                React.createElement(link_1["default"], { href: "/checkout", onClick: onClose, className: "block" },
                    React.createElement(button_1.Button, { className: "w-full bg-primary hover:bg-primary-dark text-white py-3 font-bold" }, "Thanh To\u00E1n")),
                React.createElement("button", { onClick: onClose, className: "w-full py-3 border border-border rounded-lg hover:bg-neutral-100 transition font-medium" }, "Ti\u1EBFp T\u1EE5c Mua S\u1EAFm"))))));
}
exports["default"] = CartSidebar;

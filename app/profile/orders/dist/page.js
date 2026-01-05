"use client";
"use strict";
exports.__esModule = true;
var link_1 = require("next/link");
var swr_1 = require("swr");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var use_auth_1 = require("@/hooks/use-auth");
var fetcher_1 = require("@/lib/fetcher");
var statusMap = {
    PENDING: { label: "Đang xử lý", color: "bg-blue-50 text-blue-700 border-blue-200" },
    CONFIRMED: { label: "Đã xác nhận", color: "bg-blue-50 text-blue-700 border-blue-200" },
    PROCESSING: { label: "Đang chuẩn bị", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
    SHIPPING: { label: "Đang giao", color: "bg-purple-50 text-purple-700 border-purple-200" },
    DELIVERED: { label: "Đã giao", color: "bg-green-50 text-green-700 border-green-200" },
    CANCELLED: { label: "Đã hủy", color: "bg-red-50 text-red-700 border-red-200" },
    REJECTED: { label: "Từ chối", color: "bg-red-50 text-red-700 border-red-200" }
};
function OrdersPage() {
    var isAuthenticated = use_auth_1.useAuth().isAuthenticated;
    var _a = swr_1["default"](isAuthenticated ? "/api/orders" : null, fetcher_1.fetcher), orders = _a.data, isLoading = _a.isLoading;
    if (!isAuthenticated) {
        return (React.createElement("div", { className: "max-w-7xl mx-auto px-4 py-12 text-center" },
            React.createElement("h1", { className: "text-2xl font-bold mb-4" }, "Vui l\u00F2ng \u0111\u0103ng nh\u1EADp"),
            React.createElement(link_1["default"], { href: "/auth/login" },
                React.createElement(button_1.Button, { className: "bg-primary hover:bg-primary-dark text-white" }, "\u0110\u0103ng Nh\u1EADp"))));
    }
    return (React.createElement("div", { className: "max-w-7xl mx-auto px-4 py-8" },
        React.createElement("h1", { className: "text-3xl font-bold mb-8" }, "L\u1ECBch S\u1EED \u0110\u01A1n H\u00E0ng"),
        !orders || orders.length === 0 ? (React.createElement("div", { className: "text-center py-12 bg-neutral-50 rounded-lg" },
            React.createElement("p", { className: "text-neutral-600" }, isLoading ? "Đang tải đơn hàng..." : "Bạn chưa có đơn hàng nào"),
            React.createElement(link_1["default"], { href: "/products", className: "text-primary hover:text-primary-dark mt-2 inline-block" }, "Ti\u1EBFp t\u1EE5c mua s\u1EAFm"))) : (React.createElement("div", { className: "space-y-4" }, orders.map(function (order) {
            var _a, _b;
            return (React.createElement("div", { key: order.id, className: "bg-white border border-border rounded-lg p-6 hover:shadow-md transition" },
                React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-5 gap-4 items-center" },
                    React.createElement("div", null,
                        React.createElement("p", { className: "text-sm text-neutral-600" }, "M\u00E3 \u0110\u01A1n"),
                        React.createElement("p", { className: "font-bold" },
                            "#",
                            order.id.slice(-8))),
                    React.createElement("div", null,
                        React.createElement("p", { className: "text-sm text-neutral-600" }, "Ng\u00E0y \u0110\u1EB7t"),
                        React.createElement("p", { className: "font-bold" }, new Date(order.createdAt).toLocaleDateString("vi-VN"))),
                    React.createElement("div", null,
                        React.createElement("p", { className: "text-sm text-neutral-600 mb-1" }, "Tr\u1EA1ng Th\u00E1i"),
                        React.createElement("span", { className: "px-3 py-1 rounded-full text-xs font-medium border " + (((_a = statusMap[order.status]) === null || _a === void 0 ? void 0 : _a.color) || "bg-gray-50 text-gray-700 border-gray-200") }, ((_b = statusMap[order.status]) === null || _b === void 0 ? void 0 : _b.label) || order.status)),
                    React.createElement("div", null,
                        React.createElement("p", { className: "text-sm text-neutral-600" }, "T\u1ED5ng C\u1ED9ng"),
                        React.createElement("p", { className: "font-bold text-primary" },
                            order.totalAmount.toLocaleString(),
                            "\u20AB")),
                    React.createElement("div", { className: "flex gap-2" },
                        React.createElement("button", { className: "flex items-center gap-1 px-3 py-2 bg-primary hover:bg-primary-dark text-white rounded transition text-sm font-medium" },
                            React.createElement(lucide_react_1.Eye, { size: 16 }),
                            " Chi Ti\u1EBFt")))));
        })))));
}
exports["default"] = OrdersPage;

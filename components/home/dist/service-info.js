"use client";
"use strict";
exports.__esModule = true;
var lucide_react_1 = require("lucide-react");
function ServiceInfo() {
    var getDeliveryTime = function () {
        var now = new Date();
        var hours = now.getHours();
        if (hours < 8) {
            return {
                time: "08:00 - 10:00",
                date: "Hôm nay"
            };
        }
        else if (hours < 14) {
            return {
                time: "14:00 - 16:00",
                date: "Hôm nay"
            };
        }
        else {
            return {
                time: "08:00 - 10:00",
                date: "Ngày mai"
            };
        }
    };
    var deliveryInfo = getDeliveryTime();
    var services = [
        {
            icon: lucide_react_1.Truck,
            title: "Miễn phí giao hàng",
            subtitle: "từ 300.000 VNĐ",
            color: "text-green-500"
        },
        {
            icon: lucide_react_1.Clock,
            title: "Giao hàng nhanh 2H",
            subtitle: "",
            color: "text-green-500",
            showCircle: true
        },
        {
            icon: lucide_react_1.MapPin,
            title: "62 Tỉnh thành",
            subtitle: "",
            color: "text-green-500"
        },
        {
            icon: lucide_react_1.Gift,
            title: "Giá độc quyền",
            subtitle: "Hội viên FreshFarm",
            color: "text-red-500",
            showFF: true
        }
    ];
    return (React.createElement("div", { className: "w-full bg-gray-50 border-t-2 border-green-500 py-6" },
        React.createElement("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
            React.createElement("div", { className: "flex justify-end mb-6" },
                React.createElement("p", { className: "text-sm text-gray-700" },
                    "\u0110\u1EB7t h\u00E0ng ngay, \u0111\u01A1n h\u00E0ng s\u1EBD \u0111\u1EBFn l\u00FAc",
                    " ",
                    React.createElement("span", { className: "text-green-600 font-semibold" }, deliveryInfo.time),
                    ", ",
                    React.createElement("span", { className: "text-green-600 font-semibold" }, deliveryInfo.date))),
            React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-6" }, services.map(function (service, index) {
                var Icon = service.icon;
                return (React.createElement("div", { key: index, className: "flex flex-col items-center text-center" },
                    React.createElement("div", { className: "mb-3" }, service.showCircle ? (
                    // 2H Circle design
                    React.createElement("div", { className: "relative w-24 h-24" },
                        React.createElement("div", { className: "absolute inset-0 rounded-full border-4 border-green-300 flex items-center justify-center" },
                            React.createElement("div", { className: "w-20 h-20 rounded-full bg-green-500 flex items-center justify-center" },
                                React.createElement("span", { className: "text-white font-bold text-2xl" }, "2H"))))) : service.showFF ? (
                    // FFFF logo
                    React.createElement("div", { className: "w-50 h-24" },
                        React.createElement("svg", { viewBox: "0 0 100 100", className: "w-full h-full" },
                            React.createElement("text", { x: "50", y: "60", fontSize: "32", fontWeight: "bold", fill: "#059669", textAnchor: "middle" }, "FreshFarm")))) : (
                    // Regular icon
                    React.createElement("div", { className: "w-24 h-24 flex items-center justify-center" },
                        React.createElement(Icon, { className: service.color, size: 64, strokeWidth: 1.5 })))),
                    React.createElement("div", null,
                        React.createElement("p", { className: "text-sm font-medium text-gray-700 mb-1" }, service.title),
                        service.subtitle && (React.createElement("p", { className: "text-xs text-gray-600" }, service.subtitle)))));
            })))));
}
exports["default"] = ServiceInfo;

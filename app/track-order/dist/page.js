"use client";
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var statusConfig = {
    PENDING: { label: "Chờ Xác Nhận", color: "bg-gray-100 text-gray-700" },
    CONFIRMED: { label: "Đã Xác Nhận", color: "bg-blue-100 text-blue-700" },
    PROCESSING: { label: "Đang Xử Lý", color: "bg-yellow-100 text-yellow-700" },
    SHIPPING: { label: "Đang Giao", color: "bg-purple-100 text-purple-700" },
    DELIVERED: { label: "Đã Giao", color: "bg-green-100 text-green-700" },
    CANCELLED: { label: "Đã Hủy", color: "bg-red-100 text-red-700" },
    REJECTED: { label: "Bị Từ Chối", color: "bg-red-100 text-red-700" }
};
function TrackOrderPage() {
    var _this = this;
    var _a, _b, _c;
    var searchParams = navigation_1.useSearchParams();
    var _d = react_1.useState(""), searchPhone = _d[0], setSearchPhone = _d[1];
    var _e = react_1.useState(null), order = _e[0], setOrder = _e[1];
    var _f = react_1.useState(false), isSearching = _f[0], setIsSearching = _f[1];
    var _g = react_1.useState(null), error = _g[0], setError = _g[1];
    var handleSearch = function () { return __awaiter(_this, void 0, void 0, function () {
        var res, data, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!searchPhone.trim())
                        return [2 /*return*/];
                    setIsSearching(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch("/api/track-order?phone=" + encodeURIComponent(searchPhone.trim()))];
                case 2:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = _a.sent();
                    if (!data.found) {
                        setOrder(null);
                        setError("Không tìm thấy đơn hàng nào với số điện thoại này.");
                    }
                    else {
                        setOrder(data.order);
                    }
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _a.sent();
                    console.error("Error tracking order:", err_1);
                    setError("Không thể tra cứu đơn hàng, vui lòng thử lại.");
                    setOrder(null);
                    return [3 /*break*/, 6];
                case 5:
                    setIsSearching(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    // Tự động tìm kiếm khi có query ?phone= trên URL
    react_1.useEffect(function () {
        var phone = searchParams.get("phone");
        if (phone) {
            setSearchPhone(phone);
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            handleSearch();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return (React.createElement("div", { className: "max-w-4xl mx-auto px-4 py-8" },
        React.createElement("h1", { className: "text-3xl font-bold mb-2 text-center" }, "Theo D\u00F5i \u0110\u01A1n H\u00E0ng"),
        React.createElement("p", { className: "text-neutral-600 text-center mb-8" }, "Nh\u1EADp s\u1ED1 \u0111i\u1EC7n tho\u1EA1i \u0111\u00E3 d\u00F9ng khi \u0111\u1EB7t h\u00E0ng \u0111\u1EC3 xem tr\u1EA1ng th\u00E1i \u0111\u01A1n g\u1EA7n nh\u1EA5t"),
        React.createElement("div", { className: "bg-white border border-border rounded-lg p-6 mb-8" },
            React.createElement("div", { className: "flex gap-3" },
                React.createElement("div", { className: "flex-1 relative" },
                    React.createElement(lucide_react_1.Search, { size: 18, className: "absolute left-3 top-3 text-neutral-400" }),
                    React.createElement("input", { type: "text", placeholder: "Nh\u1EADp s\u1ED1 \u0111i\u1EC7n tho\u1EA1i \u0111\u00E3 \u0111\u1EB7t h\u00E0ng", value: searchPhone, onChange: function (e) { return setSearchPhone(e.target.value); }, onKeyPress: function (e) { return e.key === "Enter" && handleSearch(); }, className: "w-full pl-10 pr-4 py-3 border border-border rounded-lg outline-none focus:border-primary transition" })),
                React.createElement(button_1.Button, { onClick: handleSearch, disabled: isSearching, className: "bg-primary hover:bg-primary-dark text-white px-6 font-bold" }, isSearching ? "Tìm kiếm..." : "Tìm Kiếm")),
            React.createElement("p", { className: "text-xs text-neutral-500 mt-2" }, "M\u00E3 \u0111\u01A1n h\u00E0ng \u0111\u01B0\u1EE3c g\u1EEDi qua email ho\u1EB7c SMS sau khi \u0111\u1EB7t h\u00E0ng")),
        error && (React.createElement("div", { className: "text-center py-4 text-red-600" }, error)),
        !order && !isSearching && !error && (React.createElement("div", { className: "text-center py-12 bg-neutral-50 rounded-lg" },
            React.createElement(lucide_react_1.Package, { size: 64, className: "mx-auto text-neutral-300 mb-4" }),
            React.createElement("p", { className: "text-neutral-600" }, "Ch\u01B0a c\u00F3 k\u1EBFt qu\u1EA3. H\u00E3y nh\u1EADp s\u1ED1 \u0111i\u1EC7n tho\u1EA1i \u0111\u1EC3 t\u00ECm ki\u1EBFm \u0111\u01A1n h\u00E0ng g\u1EA7n nh\u1EA5t."))),
        order && (React.createElement("div", { className: "space-y-8" },
            React.createElement("div", { className: "bg-white border border-border rounded-lg p-6" },
                React.createElement("div", { className: "flex items-center justify-between mb-4" },
                    React.createElement("div", null,
                        React.createElement("p", { className: "text-sm text-neutral-600" }, "M\u00E3 \u0110\u01A1n H\u00E0ng"),
                        React.createElement("p", { className: "text-2xl font-bold" }, order.id),
                        React.createElement("p", { className: "text-sm text-neutral-600 mt-1" },
                            "\u0110\u1EB7t l\u00FAc: ",
                            new Date(order.createdAt).toLocaleString("vi-VN"))),
                    React.createElement("div", { className: "px-4 py-2 rounded-lg font-bold text-sm " + (((_a = statusConfig[order.status]) === null || _a === void 0 ? void 0 : _a.color) || "bg-gray-100 text-gray-700") }, ((_b = statusConfig[order.status]) === null || _b === void 0 ? void 0 : _b.label) || order.status))),
            React.createElement("div", { className: "bg-white border border-border rounded-lg p-6" },
                React.createElement("h2", { className: "font-bold text-lg mb-4" }, "S\u1EA3n Ph\u1EA9m Trong \u0110\u01A1n"),
                React.createElement("div", { className: "space-y-3" }, (_c = order.items) === null || _c === void 0 ? void 0 : _c.map(function (item) {
                    var _a;
                    return (React.createElement("div", { key: item.id, className: "flex items-center justify-between" },
                        React.createElement("div", null,
                            React.createElement("p", { className: "font-medium" }, ((_a = item.product) === null || _a === void 0 ? void 0 : _a.name) || "Sản phẩm"),
                            React.createElement("p", { className: "text-sm text-neutral-600" },
                                item.quantity,
                                " x ",
                                item.price.toLocaleString(),
                                "\u20AB")),
                        React.createElement("p", { className: "font-bold" },
                            (item.quantity * item.price).toLocaleString(),
                            "\u20AB")));
                }))),
            React.createElement("div", { className: "bg-primary/10 border border-primary/20 rounded-lg p-6" },
                React.createElement("div", { className: "flex items-center gap-3" },
                    React.createElement(lucide_react_1.Clock, { size: 24, className: "text-primary" }),
                    React.createElement("div", null,
                        React.createElement("p", { className: "font-bold" }, "Th\u1EDDi Gian Giao D\u1EF1 Ki\u1EBFn"),
                        React.createElement("p", { className: "text-neutral-700" }, "Th\u00F4ng th\u01B0\u1EDDng trong v\u00F2ng 2-24 gi\u1EDD k\u1EC3 t\u1EEB khi \u0111\u01A1n \u0111\u01B0\u1EE3c x\u00E1c nh\u1EADn."))))))));
}
exports["default"] = TrackOrderPage;

"use client";
"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var link_1 = require("next/link");
var lucide_react_1 = require("lucide-react");
var use_cart_1 = require("@/hooks/use-cart");
var use_auth_1 = require("@/hooks/use-auth");
var button_1 = require("@/components/ui/button");
function CheckoutPage() {
    var _this = this;
    var _a = use_cart_1.useCart(), items = _a.items, clearCart = _a.clearCart, isLoaded = _a.isLoaded;
    var _b = use_auth_1.useAuth(), token = _b.token, isAuthenticated = _b.isAuthenticated;
    var _c = react_1.useState("shipping"), step = _c[0], setStep = _c[1];
    var _d = react_1.useState({
        name: "",
        phone: "",
        address: "",
        ward: "",
        district: "",
        city: "TP. Hồ Chí Minh"
    }), formData = _d[0], setFormData = _d[1];
    var _e = react_1.useState("cod"), paymentMethod = _e[0], setPaymentMethod = _e[1];
    var _f = react_1.useState(""), coupon = _f[0], setCoupon = _f[1];
    var _g = react_1.useState(null), appliedCoupon = _g[0], setAppliedCoupon = _g[1];
    var _h = react_1.useState(false), isSubmitting = _h[0], setIsSubmitting = _h[1];
    var _j = react_1.useState(null), errorMessage = _j[0], setErrorMessage = _j[1];
    var _k = react_1.useState(null), vietqrImage = _k[0], setVietqrImage = _k[1];
    var cartWithDetails = items
        .filter(function (item) { return item.product; });
    var subtotal = cartWithDetails.reduce(function (sum, item) { return sum + item.product.price * item.quantity; }, 0);
    var shipping = 30000;
    var couponDiscount = appliedCoupon ? Math.floor((subtotal * appliedCoupon.discount) / 100) : 0;
    var total = subtotal + shipping - couponDiscount;
    var handleInputChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = value, _a)));
        });
    };
    var handleApplyCoupon = function () {
        if (coupon === "SAVE10") {
            setAppliedCoupon({ code: "SAVE10", discount: 10 });
        }
        else if (coupon === "SAVE20") {
            setAppliedCoupon({ code: "SAVE20", discount: 20 });
        }
    };
    var validateShipping = function () {
        if (!formData.name || !formData.phone || !formData.address || !formData.ward || !formData.district || !formData.city) {
            setErrorMessage("Vui lòng nhập đầy đủ thông tin giao hàng (họ tên, SĐT, địa chỉ, phường/xã, quận/huyện, tỉnh/thành).");
            return false;
        }
        setErrorMessage(null);
        return true;
    };
    var handleGenerateVietQR = function () { return __awaiter(_this, void 0, void 0, function () {
        var res, data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("/api/payments/qr", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                amount: total,
                                addInfo: ("THANH TOAN DON HANG - " + (formData.phone || formData.name || "")).slice(0, 60)
                            })
                        })];
                case 1:
                    res = _a.sent();
                    if (!res.ok)
                        return [2 /*return*/];
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    if (data.qrImage) {
                        setVietqrImage(data.qrImage);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error generating VietQR:", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var handleCompleteOrder = function () { return __awaiter(_this, void 0, void 0, function () {
        var shippingAddress, orderItems, res, err, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isAuthenticated || !token) {
                        setErrorMessage("Vui lòng đăng nhập trước khi đặt hàng.");
                        return [2 /*return*/];
                    }
                    if (!validateShipping())
                        return [2 /*return*/];
                    setIsSubmitting(true);
                    setErrorMessage(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 7]);
                    shippingAddress = formData.address + ", " + formData.ward + ", " + formData.district + ", " + formData.city;
                    orderItems = cartWithDetails.map(function (item) { return ({
                        productId: item.product.id,
                        quantity: item.quantity,
                        price: item.product.price
                    }); });
                    return [4 /*yield*/, fetch("/api/orders", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "x-user-id": token
                            },
                            body: JSON.stringify({
                                items: orderItems,
                                shippingAddress: shippingAddress,
                                phone: formData.phone,
                                paymentMethod: paymentMethod === "vietqr" ? "VIETQR" : "COD",
                                discount: (appliedCoupon === null || appliedCoupon === void 0 ? void 0 : appliedCoupon.discount) || 0
                            })
                        })];
                case 2:
                    res = _a.sent();
                    if (!!res.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, res.json()["catch"](function () { return ({}); })];
                case 3:
                    err = _a.sent();
                    throw new Error(err.error || "Không thể tạo đơn hàng, vui lòng thử lại.");
                case 4:
                    clearCart();
                    setStep("confirm");
                    return [3 /*break*/, 7];
                case 5:
                    error_2 = _a.sent();
                    console.error("Error creating order:", error_2);
                    setErrorMessage(error_2.message || "Có lỗi xảy ra khi tạo đơn hàng.");
                    return [3 /*break*/, 7];
                case 6:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 7: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement("div", { className: "max-w-7xl mx-auto px-4 py-8" },
        React.createElement("h1", { className: "text-3xl font-bold mb-8" }, "Thanh To\u00E1n"),
        !isLoaded ? (React.createElement("div", null, "\u0110ang t\u1EA3i...")) : (React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-8" },
            React.createElement("div", { className: "lg:col-span-2" },
                React.createElement("div", { className: "flex items-center mb-8" }, ["shipping", "payment", "confirm"].map(function (s, index) { return (React.createElement("div", { key: s, className: "flex items-center" },
                    React.createElement("div", { className: "w-10 h-10 rounded-full flex items-center justify-center font-bold transition " + (s === step
                            ? "bg-primary text-white"
                            : step === "confirm" || ["shipping", "payment"].indexOf(step) >= index
                                ? "bg-primary text-white"
                                : "bg-neutral-200 text-neutral-600") }, ["shipping", "payment", "confirm"].indexOf(step) > index ? React.createElement(lucide_react_1.Check, { size: 20 }) : index + 1),
                    React.createElement("div", { className: "ml-3" },
                        React.createElement("p", { className: "font-bold" },
                            s === "shipping" && "Địa Chỉ Giao Hàng",
                            s === "payment" && "Phương Thức Thanh Toán",
                            s === "confirm" && "Xác Nhận")),
                    index < 2 && React.createElement("div", { className: "h-1 w-12 mx-4 bg-neutral-200" }))); })),
                step === "shipping" && (React.createElement("div", { className: "bg-white border border-border rounded-lg p-6 space-y-4" },
                    React.createElement("h2", { className: "font-bold text-lg" }, "Th\u00F4ng Tin Giao H\u00E0ng"),
                    errorMessage && (React.createElement("p", { className: "text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2" }, errorMessage)),
                    React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4" },
                        React.createElement("input", { type: "text", name: "name", placeholder: "H\u1ECD v\u00E0 t\u00EAn", value: formData.name, onChange: handleInputChange, className: "px-4 py-2 border border-border rounded-lg outline-none focus:border-primary transition" }),
                        React.createElement("input", { type: "tel", name: "phone", placeholder: "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i", value: formData.phone, onChange: handleInputChange, className: "px-4 py-2 border border-border rounded-lg outline-none focus:border-primary transition" }),
                        React.createElement("select", { name: "city", value: formData.city, onChange: handleInputChange, className: "px-4 py-2 border border-border rounded-lg outline-none focus:border-primary transition" },
                            React.createElement("option", null, "TP. H\u1ED3 Ch\u00ED Minh"),
                            React.createElement("option", null, "H\u00E0 N\u1ED9i"),
                            React.createElement("option", null, "\u0110\u00E0 N\u1EB5ng"))),
                    React.createElement("div", { className: "grid grid-cols-2 gap-4" },
                        React.createElement("input", { type: "text", name: "district", placeholder: "Qu\u1EADn/Huy\u1EC7n", value: formData.district, onChange: handleInputChange, className: "px-4 py-2 border border-border rounded-lg outline-none focus:border-primary transition" }),
                        React.createElement("input", { type: "text", name: "ward", placeholder: "Ph\u01B0\u1EDDng/X\u00E3", value: formData.ward, onChange: handleInputChange, className: "px-4 py-2 border border-border rounded-lg outline-none focus:border-primary transition" })),
                    React.createElement("textarea", { name: "address", placeholder: "S\u1ED1 nh\u00E0, t\u00EAn \u0111\u01B0\u1EDDng", value: formData.address, onChange: function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { address: e.target.value })); }); }, rows: 3, className: "w-full px-4 py-2 border border-border rounded-lg outline-none focus:border-primary transition resize-none" }),
                    React.createElement(button_1.Button, { onClick: function () {
                            if (validateShipping()) {
                                setStep("payment");
                            }
                        }, className: "w-full bg-primary hover:bg-primary-dark text-white py-3 font-bold" }, "Ti\u1EBFp T\u1EE5c"))),
                step === "payment" && (React.createElement("div", { className: "bg-white border border-border rounded-lg p-6 space-y-4" },
                    React.createElement("h2", { className: "font-bold text-lg" }, "Ph\u01B0\u01A1ng Th\u1EE9c Thanh To\u00E1n"),
                    errorMessage && (React.createElement("p", { className: "text-sm text-red-600 bg-red-50 border border-red-100 rounded px-3 py-2" }, errorMessage)),
                    React.createElement("div", { className: "space-y-3" },
                        React.createElement("label", { className: "p-4 border-2 rounded-lg cursor-pointer transition " + (paymentMethod === "cod"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-neutral-300") },
                            React.createElement("input", { type: "radio", name: "payment", value: "cod", checked: paymentMethod === "cod", onChange: function (e) { return setPaymentMethod(e.target.value); }, className: "mr-3 cursor-pointer" }),
                            React.createElement("span", { className: "ml-2" }, "\uD83D\uDE9A Thanh to\u00E1n khi nh\u1EADn h\u00E0ng (COD)")),
                        React.createElement("label", { className: "p-4 border-2 rounded-lg cursor-pointer transition " + (paymentMethod === "vietqr"
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-neutral-300") },
                            React.createElement("input", { type: "radio", name: "payment", value: "vietqr", checked: paymentMethod === "vietqr", onChange: function (e) {
                                    setPaymentMethod(e.target.value);
                                    handleGenerateVietQR();
                                }, className: "mr-3 cursor-pointer" }),
                            React.createElement("span", { className: "ml-2" }, "\uD83E\uDDFE Thanh to\u00E1n qua VietQR (chuy\u1EC3n kho\u1EA3n nhanh)"))),
                    paymentMethod === "vietqr" && (React.createElement("div", { className: "mt-4 border border-dashed border-primary rounded-lg p-4 text-center space-y-3" },
                        React.createElement("p", { className: "font-medium" }, "Qu\u00E9t m\u00E3 VietQR \u0111\u1EC3 thanh to\u00E1n"),
                        vietqrImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        React.createElement("img", { src: vietqrImage, alt: "VietQR", className: "mx-auto max-h-64" })) : (React.createElement("p", { className: "text-sm text-neutral-600" }, "\u0110ang t\u1EA1o m\u00E3 VietQR, vui l\u00F2ng ch\u1EDD trong gi\u00E2y l\u00E1t...")),
                        React.createElement("p", { className: "text-xs text-neutral-500" },
                            "N\u1ED9i dung chuy\u1EC3n kho\u1EA3n: ",
                            React.createElement("strong", null, "THANH TOAN DON HANG FRESHFARM")))),
                    React.createElement("div", { className: "flex gap-3" },
                        React.createElement(button_1.Button, { onClick: function () { return setStep("shipping"); }, variant: "outline", className: "flex-1 py-3 font-bold" }, "Quay L\u1EA1i"),
                        React.createElement(button_1.Button, { onClick: handleCompleteOrder, className: "flex-1 bg-primary hover:bg-primary-dark text-white py-3 font-bold", disabled: isSubmitting }, isSubmitting ? "Đang tạo đơn hàng..." : "Hoàn Thành Đơn Hàng")))),
                step === "confirm" && (React.createElement("div", { className: "text-center py-12 bg-white border border-border rounded-lg" },
                    React.createElement("div", { className: "text-6xl mb-4" }, "\u2713"),
                    React.createElement("h2", { className: "text-2xl font-bold mb-2" }, "\u0110\u01A1n H\u00E0ng C\u1EE7a B\u1EA1n \u0110\u00E3 \u0110\u01B0\u1EE3c T\u1EA1o!"),
                    React.createElement("p", { className: "text-neutral-600 mb-6" }, "C\u1EA3m \u01A1n b\u1EA1n \u0111\u00E3 mua s\u1EAFm. B\u1EA1n s\u1EBD nh\u1EADn \u0111\u01B0\u1EE3c email x\u00E1c nh\u1EADn trong v\u00E0i ph\u00FAt."),
                    React.createElement(link_1["default"], { href: "/" },
                        React.createElement(button_1.Button, { className: "bg-primary hover:bg-primary-dark text-white" }, "Quay L\u1EA1i Trang Ch\u1EE7"))))),
            React.createElement("div", { className: "lg:col-span-1" },
                React.createElement("div", { className: "bg-white border border-border rounded-lg p-6 space-y-4 sticky top-24" },
                    React.createElement("h2", { className: "font-bold text-lg" }, "T\u00F3m T\u1EAFt \u0110\u01A1n H\u00E0ng"),
                    React.createElement("div", { className: "space-y-2 max-h-64 overflow-y-auto border-b border-border pb-4" }, cartWithDetails.map(function (item) {
                        var _a;
                        return (React.createElement("div", { key: item.productId, className: "flex justify-between text-sm" },
                            React.createElement("span", { className: "line-clamp-1" }, (_a = item.product) === null || _a === void 0 ? void 0 :
                                _a.name,
                                " x ",
                                item.quantity),
                            React.createElement("span", { className: "font-bold flex-shrink-0" },
                                (item.product.price * item.quantity).toLocaleString(),
                                "\u20AB")));
                    })),
                    step !== "confirm" && (React.createElement("div", { className: "flex gap-2" },
                        React.createElement("input", { type: "text", placeholder: "M\u00E3 gi\u1EA3m gi\u00E1", value: coupon, onChange: function (e) { return setCoupon(e.target.value); }, className: "flex-1 px-3 py-2 border border-border rounded outline-none focus:border-primary transition text-sm" }),
                        React.createElement(button_1.Button, { onClick: handleApplyCoupon, variant: "outline", className: "px-3 py-2 text-sm bg-transparent" }, "\u00C1p D\u1EE5ng"))),
                    appliedCoupon && (React.createElement("div", { className: "bg-green-50 border border-green-200 rounded p-2 text-sm text-green-700" },
                        "M\u00E3 ",
                        appliedCoupon.code,
                        " \u0111\u01B0\u1EE3c \u00E1p d\u1EE5ng")),
                    React.createElement("div", { className: "space-y-2 text-sm border-b border-border pb-4" },
                        React.createElement("div", { className: "flex justify-between" },
                            React.createElement("span", null, "T\u1EA1m t\u00EDnh:"),
                            React.createElement("span", null,
                                subtotal.toLocaleString(),
                                "\u20AB")),
                        React.createElement("div", { className: "flex justify-between" },
                            React.createElement("span", null, "Ph\u00ED giao h\u00E0ng:"),
                            React.createElement("span", null,
                                shipping.toLocaleString(),
                                "\u20AB")),
                        couponDiscount > 0 && (React.createElement("div", { className: "flex justify-between text-green-600" },
                            React.createElement("span", null, "Gi\u1EA3m gi\u00E1:"),
                            React.createElement("span", null,
                                "-",
                                couponDiscount.toLocaleString(),
                                "\u20AB")))),
                    React.createElement("div", { className: "flex justify-between text-lg font-bold text-primary" },
                        React.createElement("span", null, "T\u1ED5ng c\u1ED9ng:"),
                        React.createElement("span", null,
                            total.toLocaleString(),
                            "\u20AB")),
                    step !== "confirm" && (React.createElement(button_1.Button, { onClick: handleCompleteOrder, disabled: isSubmitting, className: "w-full bg-primary hover:bg-primary-dark text-white py-3 font-bold" }, step === "payment"
                        ? isSubmitting
                            ? "Đang tạo đơn hàng..."
                            : "Hoàn Thành Đơn Hàng"
                        : "Tiếp Tục"))))))));
}
exports["default"] = CheckoutPage;

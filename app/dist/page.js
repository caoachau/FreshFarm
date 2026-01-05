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
var swr_1 = require("swr");
var banner_slider_1 = require("@/components/home/banner-slider");
var hero_banner_1 = require("@/components/home/hero-banner");
var service_info_1 = require("@/components/home/service-info");
var category_showcase_1 = require("@/components/home/category-showcase");
var product_grid_1 = require("@/components/home/product-grid");
var fetcher_1 = require("@/lib/fetcher");
var button_1 = require("@/components/ui/button");
function NewsletterSection() {
    var _this = this;
    var _a = react_1.useState(""), email = _a[0], setEmail = _a[1];
    var _b = react_1.useState(false), isSubmitting = _b[0], setIsSubmitting = _b[1];
    var _c = react_1.useState(""), message = _c[0], setMessage = _c[1];
    var handleSubscribe = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var response, data, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    e.preventDefault();
                    if (!email.trim())
                        return [2 /*return*/];
                    setIsSubmitting(true);
                    setMessage("");
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch("/api/newsletter/subscribe", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email: email })
                        })];
                case 2:
                    response = _b.sent();
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _b.sent();
                    if (response.ok) {
                        setMessage(data.message || "Đăng ký thành công! Cảm ơn bạn đã quan tâm.");
                        setEmail("");
                    }
                    else {
                        setMessage(data.error || "Có lỗi xảy ra. Vui lòng thử lại sau.");
                    }
                    return [3 /*break*/, 6];
                case 4:
                    _a = _b.sent();
                    setMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
                    return [3 /*break*/, 6];
                case 5:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    return (React.createElement("section", { className: "relative overflow-hidden bg-gradient-to-br from-green-50 via-emerald-50 to-lime-50 rounded-xl p-5 sm:p-7 my-8 border border-green-100 shadow-md" },
        React.createElement("div", { className: "absolute top-0 right-0 w-48 h-48 bg-green-200 rounded-full blur-3xl opacity-20 -mr-24 -mt-24" }),
        React.createElement("div", { className: "absolute bottom-0 left-0 w-48 h-48 bg-emerald-200 rounded-full blur-3xl opacity-20 -ml-24 -mb-24" }),
        React.createElement("div", { className: "relative z-10 max-w-xl mx-auto text-center" },
            React.createElement("div", { className: "inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md mb-4 transform hover:scale-110 transition-transform" },
                React.createElement("svg", { className: "w-6 h-6 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24" },
                    React.createElement("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" }))),
            React.createElement("h2", { className: "text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-700 to-emerald-600 mb-3" }, "Nh\u1EADn Th\u00F4ng Tin Khuy\u1EBFn M\u00E3i"),
            React.createElement("p", { className: "text-gray-600 text-sm sm:text-base mb-5 max-w-lg mx-auto" },
                "\u0110\u0103ng k\u00FD nh\u1EADn email \u0111\u1EC3 c\u1EADp nh\u1EADt c\u00E1c",
                React.createElement("span", { className: "font-semibold text-green-700" }, " khuy\u1EBFn m\u00E3i \u0111\u1ED9c quy\u1EC1n"),
                " v\u00E0",
                React.createElement("span", { className: "font-semibold text-green-700" }, " \u01B0u \u0111\u00E3i \u0111\u1EB7c bi\u1EC7t"),
                " m\u1EDBi nh\u1EA5t"),
            React.createElement("form", { onSubmit: handleSubscribe, className: "flex flex-col sm:flex-row gap-2 max-w-md mx-auto mb-3" },
                React.createElement("div", { className: "flex-1 relative" },
                    React.createElement("input", { type: "email", placeholder: "Nh\u1EADp email c\u1EE7a b\u1EA1n", value: email, onChange: function (e) { return setEmail(e.target.value); }, required: true, className: "w-full px-4 py-3 rounded-lg border-2 border-gray-200 outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all text-gray-800 placeholder:text-gray-400 shadow-sm text-sm" })),
                React.createElement(button_1.Button, { type: "submit", disabled: isSubmitting, className: "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-lg font-bold text-sm shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none whitespace-nowrap" }, isSubmitting ? (React.createElement("span", { className: "flex items-center gap-2" },
                    React.createElement("svg", { className: "animate-spin h-4 w-4", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" },
                        React.createElement("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                        React.createElement("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })),
                    "\u0110ang x\u1EED l\u00FD...")) : ("Đăng Ký Ngay"))),
            message && (React.createElement("div", { className: "inline-flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-xs sm:text-sm " + (message.includes("thành công")
                    ? "bg-green-100 text-green-700 border border-green-200"
                    : "bg-red-100 text-red-700 border border-red-200") },
                message.includes("thành công") ? (React.createElement("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20" },
                    React.createElement("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" }))) : (React.createElement("svg", { className: "w-4 h-4", fill: "currentColor", viewBox: "0 0 20 20" },
                    React.createElement("path", { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z", clipRule: "evenodd" }))),
                message)),
            React.createElement("div", { className: "flex items-center justify-center gap-4 mt-6 text-xs sm:text-sm text-gray-500" },
                React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement("svg", { className: "w-4 h-4 text-green-600", fill: "currentColor", viewBox: "0 0 20 20" },
                        React.createElement("path", { fillRule: "evenodd", d: "M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" })),
                    React.createElement("span", null, "B\u1EA3o m\u1EADt th\u00F4ng tin")),
                React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement("svg", { className: "w-4 h-4 text-green-600", fill: "currentColor", viewBox: "0 0 20 20" },
                        React.createElement("path", { d: "M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" }),
                        React.createElement("path", { d: "M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" })),
                    React.createElement("span", null, "Kh\u00F4ng spam"))))));
} // ✅ QUAN TRỌNG: đóng NewsletterSection ở đây
function Home() {
    var _a = swr_1["default"]("/api/products?sort=bestselling&page=1&limit=8", fetcher_1.fetcher), bestSellingData = _a.data, bestSellingError = _a.error;
    var _b = swr_1["default"]("/api/products?discounted=true&page=1&limit=8", fetcher_1.fetcher), promotionsData = _b.data, promotionsError = _b.error;
    var bestSelling = (bestSellingData === null || bestSellingData === void 0 ? void 0 : bestSellingData.products) || [];
    var promotions = (promotionsData === null || promotionsData === void 0 ? void 0 : promotionsData.products) || [];
    if (!bestSellingData && !bestSellingError)
        return React.createElement("div", { className: "text-center py-20" }, "\u0110ang t\u1EA3i s\u1EA3n ph\u1EA9m...");
    if (bestSellingError || promotionsError)
        return (React.createElement("div", { className: "text-center py-20 text-red-600" },
            "L\u1ED7i t\u1EA3i d\u1EEF li\u1EC7u. Vui l\u00F2ng ki\u1EC3m tra server API (",
            (bestSellingError === null || bestSellingError === void 0 ? void 0 : bestSellingError.status) || (promotionsError === null || promotionsError === void 0 ? void 0 : promotionsError.status),
            ")."));
    return (React.createElement("div", { className: "w-full" },
        React.createElement("div", { className: "mb-8" },
            React.createElement(hero_banner_1["default"], null)),
        React.createElement(banner_slider_1["default"], null),
        React.createElement(category_showcase_1["default"], null),
        bestSelling.length > 0 && React.createElement(product_grid_1["default"], { title: "\uD83D\uDD25 S\u1EA3n Ph\u1EA9m B\u00E1n Ch\u1EA1y", products: bestSelling }),
        promotions.length > 0 && React.createElement(product_grid_1["default"], { title: "\uD83D\uDCB0 Khuy\u1EBFn M\u00E3i \u0110\u1EB7c Bi\u1EC7t", products: promotions }),
        React.createElement(NewsletterSection, null),
        React.createElement(service_info_1["default"], null)));
}
exports["default"] = Home;

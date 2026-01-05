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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
var link_1 = require("next/link");
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var use_auth_1 = require("@/hooks/use-auth");
var use_cart_1 = require("@/hooks/use-cart");
var use_wishlist_1 = require("@/hooks/use-wishlist");
var navigation_1 = require("next/navigation");
function ProductCard(_a) {
    var _this = this;
    var _b;
    var product = _a.product;
    var router = navigation_1.useRouter();
    var isAuthenticated = use_auth_1.useAuth().isAuthenticated;
    var addToCart = use_cart_1.useCart().addToCart;
    var _c = use_wishlist_1.useWishlist(), toggleWishlist = _c.toggleWishlist, isInWishlist = _c.isInWishlist;
    var _d = react_1.useState(false), isAddingToCart = _d[0], setIsAddingToCart = _d[1];
    var _e = react_1.useState(false), imageLoaded = _e[0], setImageLoaded = _e[1];
    var handleAddToCart = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isAuthenticated) {
                        router.push("/auth/login");
                        return [2 /*return*/];
                    }
                    setIsAddingToCart(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, addToCart(product.id, 1)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error("Error adding to cart:", error_1);
                    alert((error_1 === null || error_1 === void 0 ? void 0 : error_1.message) || "Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.");
                    return [3 /*break*/, 5];
                case 4:
                    setIsAddingToCart(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleToggleWishlist = function (e) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    e.stopPropagation();
                    if (!isAuthenticated) {
                        router.push("/auth/login");
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, toggleWishlist(product.id)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var inWishlist = isInWishlist(product.id);
    var reviewCount = typeof product.reviews === 'number' ? product.reviews : ((_b = product.reviews) === null || _b === void 0 ? void 0 : _b.length) || 0;
    return (React.createElement(link_1["default"], { href: "/products/" + product.id, className: "block" },
        React.createElement("div", { className: "group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-green-300 hover:shadow-xl transition-all duration-300 h-full flex flex-col" },
            React.createElement("div", { className: "relative aspect-square bg-gradient-to-br from-gray-100 to-gray-50 overflow-hidden" },
                React.createElement("img", { src: product.image || "/placeholder.svg", alt: product.name, className: "w-full h-full object-cover transition-all duration-500 " + (imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95') + " group-hover:scale-110", onLoad: function () { return setImageLoaded(true); } }),
                React.createElement("div", { className: "absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" }),
                React.createElement("div", { className: "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300" },
                    React.createElement("div", { className: "bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all" },
                        React.createElement(lucide_react_1.Eye, { size: 16, className: "text-green-600" }),
                        React.createElement("span", { className: "text-sm font-semibold text-gray-800" }, "Xem nhanh"))),
                product.discount && (React.createElement("div", { className: "absolute top-3 right-3 z-10" },
                    React.createElement("div", { className: "bg-gradient-to-br from-red-500 to-pink-600 text-white px-3 py-1.5 rounded-lg shadow-lg transform rotate-2 hover:rotate-0 transition-transform" },
                        React.createElement("span", { className: "text-xs font-black" },
                            "-",
                            product.discount,
                            "%")))),
                React.createElement("button", { className: "absolute top-3 left-3 z-10 p-2.5 rounded-full transition-all duration-300 shadow-lg " + (inWishlist
                        ? "bg-red-500 text-white scale-100"
                        : "bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-white hover:text-red-500 scale-90 opacity-0 group-hover:opacity-100 group-hover:scale-100"), onClick: handleToggleWishlist, title: inWishlist ? "Đã yêu thích" : "Thêm vào yêu thích" },
                    React.createElement(lucide_react_1.Heart, { size: 18, className: "transition-all " + (inWishlist ? "fill-current" : "") }))),
            React.createElement("div", { className: "flex flex-col flex-grow p-4 space-y-3" },
                product.brand && (React.createElement("span", { className: "text-xs font-semibold text-green-600 uppercase tracking-wide" }, product.brand)),
                React.createElement("h3", { className: "font-bold text-base text-gray-800 line-clamp-2 leading-snug group-hover:text-green-600 transition-colors min-h-[2.5rem]" }, product.name),
                product.rating && (React.createElement("div", { className: "flex items-center gap-2" },
                    React.createElement("div", { className: "flex items-center gap-0.5" }, __spreadArrays(Array(5)).map(function (_, i) { return (React.createElement(lucide_react_1.Star, { key: i, size: 14, className: "" + (i < Math.floor(product.rating)
                            ? "fill-amber-400 text-amber-400"
                            : "fill-gray-200 text-gray-200") })); })),
                    React.createElement("span", { className: "text-xs text-gray-500 font-medium" },
                        product.rating.toFixed(1),
                        " (",
                        reviewCount,
                        ")"))),
                React.createElement("div", { className: "flex-grow" }),
                React.createElement("div", { className: "flex items-baseline gap-2 pt-2" },
                    React.createElement("span", { className: "text-2xl font-black text-green-600" },
                        product.price.toLocaleString(),
                        "\u20AB"),
                    product.originalPrice && (React.createElement("div", { className: "flex flex-col" },
                        React.createElement("span", { className: "text-sm text-gray-400 line-through" },
                            product.originalPrice.toLocaleString(),
                            "\u20AB")))),
                React.createElement(button_1.Button, { className: "w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-xl shadow-md hover:shadow-xl transform hover:-translate-y-1 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none", onClick: handleAddToCart, disabled: isAddingToCart }, isAddingToCart ? (React.createElement("span", { className: "flex items-center justify-center gap-2" },
                    React.createElement("svg", { className: "animate-spin h-5 w-5 text-white", xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24" },
                        React.createElement("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }),
                        React.createElement("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })),
                    React.createElement("span", { className: "font-bold" }, "\u0110ang th\u00EAm..."))) : (React.createElement("span", { className: "flex items-center justify-center gap-2" },
                    React.createElement(lucide_react_1.ShoppingCart, { size: 18, strokeWidth: 2.5 }),
                    React.createElement("span", null, "Th\u00EAm V\u00E0o Gi\u1ECF"))))))));
}
exports["default"] = ProductCard;

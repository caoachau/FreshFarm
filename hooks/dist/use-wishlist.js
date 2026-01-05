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
exports.useWishlist = void 0;
var swr_1 = require("swr");
var react_1 = require("react");
var use_auth_1 = require("./use-auth");
var fetcher = function (url, token) {
    var _a;
    // Fix: Ensure token is always a string - handle object case
    var tokenString;
    if (typeof token === 'string') {
        tokenString = token.trim();
    }
    else if (token && typeof token === 'object') {
        tokenString = ((_a = token) === null || _a === void 0 ? void 0 : _a.id) ? String(token.id).trim() : JSON.stringify(token);
    }
    else {
        tokenString = String(token).trim();
    }
    return fetch(url, {
        headers: { "x-user-id": tokenString }
    }).then(function (r) { return r.json(); });
};
function useWishlist() {
    var _this = this;
    var _a = use_auth_1.useAuth(), token = _a.token, isAuthenticated = _a.isAuthenticated;
    var _b = swr_1["default"](isAuthenticated && token ? ["/api/wishlist", token] : null, function (_a) {
        var url = _a[0], token = _a[1];
        return fetcher(url, token);
    }), data = _b.data, mutate = _b.mutate;
    // ⭐ Chuẩn hoá dữ liệu trả về từ API
    var items = Array.isArray(data === null || data === void 0 ? void 0 : data.items) ? data.items : [];
    // Stabilize wishlist item ids to avoid new array reference each render
    var itemIds = react_1.useMemo(function () { return items.map(function (item) { return item.productId; }); }, [items]);
    var toggleWishlist = function (productId) { return __awaiter(_this, void 0, void 0, function () {
        var tokenString, response, error_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!token)
                        return [2 /*return*/];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    tokenString = void 0;
                    if (typeof token === 'string') {
                        tokenString = token.trim();
                    }
                    else if (token && typeof token === 'object') {
                        tokenString = ((_a = token) === null || _a === void 0 ? void 0 : _a.id) ? String(token.id).trim() : JSON.stringify(token);
                    }
                    else {
                        tokenString = String(token).trim();
                    }
                    return [4 /*yield*/, fetch("/api/wishlist", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                "x-user-id": tokenString
                            },
                            body: JSON.stringify({ productId: productId })
                        })];
                case 2:
                    response = _b.sent();
                    if (response.ok)
                        mutate();
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _b.sent();
                    console.error("[v0] Error toggling wishlist:", error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var isInWishlist = function (productId) {
        return items.some(function (item) { return item.productId === productId; });
    };
    var removeFromWishlist = function (productId) { return __awaiter(_this, void 0, void 0, function () {
        var tokenString, response, error_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (!token)
                        return [2 /*return*/];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    tokenString = void 0;
                    if (typeof token === 'string') {
                        tokenString = token.trim();
                    }
                    else if (token && typeof token === 'object') {
                        tokenString = ((_a = token) === null || _a === void 0 ? void 0 : _a.id) ? String(token.id).trim() : JSON.stringify(token);
                    }
                    else {
                        tokenString = String(token).trim();
                    }
                    return [4 /*yield*/, fetch("/api/wishlist", {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                                "x-user-id": tokenString
                            },
                            body: JSON.stringify({ productId: productId })
                        })];
                case 2:
                    response = _b.sent();
                    if (response.ok)
                        mutate();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _b.sent();
                    console.error("[v0] Error removing from wishlist:", error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    return {
        items: itemIds,
        toggleWishlist: toggleWishlist,
        isInWishlist: isInWishlist,
        removeFromWishlist: removeFromWishlist,
        isLoaded: !!data
    };
}
exports.useWishlist = useWishlist;

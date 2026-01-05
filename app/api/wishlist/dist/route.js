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
exports.DELETE = exports.POST = exports.GET = void 0;
var db_1 = require("@/lib/db");
var server_1 = require("next/server");
// GET: trả về wishlist theo dạng { items: [...] } để đồng bộ với hook useWishlist
function GET(request) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, items, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    userId = request.headers.get("x-user-id");
                    if (!userId) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 })];
                    }
                    return [4 /*yield*/, db_1.prisma.wishlistItem.findMany({
                            where: { userId: userId },
                            include: { product: true }
                        })];
                case 1:
                    items = _a.sent();
                    return [2 /*return*/, server_1.NextResponse.json({ items: items })];
                case 2:
                    error_1 = _a.sent();
                    console.error("Error fetching wishlist:", error_1);
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.GET = GET;
// POST: toggle thêm / xoá khỏi wishlist
function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, productId, existing, item, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 6, , 7]);
                    userId = request.headers.get("x-user-id");
                    if (!userId) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 })];
                    }
                    return [4 /*yield*/, request.json()];
                case 1:
                    productId = (_a.sent()).productId;
                    return [4 /*yield*/, db_1.prisma.wishlistItem.findUnique({
                            where: { userId_productId: { userId: userId, productId: productId } }
                        })];
                case 2:
                    existing = _a.sent();
                    if (!existing) return [3 /*break*/, 4];
                    return [4 /*yield*/, db_1.prisma.wishlistItem["delete"]({ where: { id: existing.id } })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, server_1.NextResponse.json({ action: "removed" })];
                case 4: return [4 /*yield*/, db_1.prisma.wishlistItem.create({
                        data: { userId: userId, productId: productId },
                        include: { product: true }
                    })];
                case 5:
                    item = _a.sent();
                    return [2 /*return*/, server_1.NextResponse.json({ action: "added", item: item })];
                case 6:
                    error_2 = _a.sent();
                    console.error("Error updating wishlist:", error_2);
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Failed to update wishlist" }, { status: 500 })];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.POST = POST;
// DELETE: xoá 1 sản phẩm khỏi wishlist theo productId
function DELETE(request) {
    return __awaiter(this, void 0, void 0, function () {
        var userId, productId, existing, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    userId = request.headers.get("x-user-id");
                    if (!userId) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Unauthorized" }, { status: 401 })];
                    }
                    return [4 /*yield*/, request.json()];
                case 1:
                    productId = (_a.sent()).productId;
                    if (!productId) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "productId is required" }, { status: 400 })];
                    }
                    return [4 /*yield*/, db_1.prisma.wishlistItem.findUnique({
                            where: { userId_productId: { userId: userId, productId: productId } }
                        })];
                case 2:
                    existing = _a.sent();
                    if (!existing) {
                        return [2 /*return*/, server_1.NextResponse.json({ success: true })];
                    }
                    return [4 /*yield*/, db_1.prisma.wishlistItem["delete"]({ where: { id: existing.id } })];
                case 3:
                    _a.sent();
                    return [2 /*return*/, server_1.NextResponse.json({ success: true })];
                case 4:
                    error_3 = _a.sent();
                    console.error("Error deleting from wishlist:", error_3);
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Failed to delete from wishlist" }, { status: 500 })];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.DELETE = DELETE;

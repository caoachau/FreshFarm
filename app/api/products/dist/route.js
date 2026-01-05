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
exports.GET = void 0;
var db_1 = require("@/lib/db");
var server_1 = require("next/server");
function GET(request) {
    return __awaiter(this, void 0, void 0, function () {
        var searchParams, category, search, sort, page, limitParam, limit, where, minPrice, maxPrice, minRating, orderBy, _a, products, total, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    searchParams = request.nextUrl.searchParams;
                    category = searchParams.get("category");
                    search = searchParams.get("search");
                    sort = searchParams.get("sort") || "newest";
                    page = Number.parseInt(searchParams.get("page") || "1");
                    limitParam = Number.parseInt(searchParams.get("limit") || "12");
                    limit = Number.isNaN(limitParam) || limitParam <= 0 ? 12 : Math.min(limitParam, 48);
                    where = {};
                    if (category && category !== "all") {
                        where.category = { slug: category };
                    }
                    if (search) {
                        where.OR = [
                            { name: { contains: search, mode: "insensitive" } },
                            { description: { contains: search, mode: "insensitive" } },
                        ];
                    }
                    minPrice = searchParams.get("minPrice");
                    maxPrice = searchParams.get("maxPrice");
                    minRating = searchParams.get("minRating");
                    if (minPrice || maxPrice) {
                        where.price = {};
                        if (minPrice) {
                            where.price.gte = Number.parseInt(minPrice);
                        }
                        if (maxPrice) {
                            where.price.lte = Number.parseInt(maxPrice);
                        }
                    }
                    if (minRating) {
                        where.rating = {
                            gte: Number.parseFloat(minRating)
                        };
                    }
                    orderBy = {};
                    switch (sort) {
                        case "price-asc":
                            orderBy.price = "asc";
                            break;
                        case "price-desc":
                            orderBy.price = "desc";
                            break;
                        case "bestselling":
                            orderBy.sold = "desc";
                            break;
                        case "rating":
                            orderBy.rating = "desc";
                            break;
                        default:
                            orderBy.createdAt = "desc";
                    }
                    return [4 /*yield*/, Promise.all([
                            db_1.prisma.product.findMany({
                                where: where,
                                orderBy: orderBy,
                                skip: (page - 1) * limit,
                                take: limit,
                                include: { category: true }
                            }),
                            db_1.prisma.product.count({ where: where }),
                        ])];
                case 1:
                    _a = _b.sent(), products = _a[0], total = _a[1];
                    return [2 /*return*/, server_1.NextResponse.json({
                            products: products,
                            total: total,
                            page: page,
                            pages: Math.ceil(total / limit)
                        })];
                case 2:
                    error_1 = _b.sent();
                    console.error("Error fetching products:", error_1);
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.GET = GET;

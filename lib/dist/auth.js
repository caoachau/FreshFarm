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
exports.authenticateUser = exports.registerUser = exports.verifyPassword = exports.hashPassword = void 0;
var bcryptjs_1 = require("bcryptjs");
var db_1 = require("./db");
function hashPassword(password) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, bcryptjs_1["default"].hash(password, 10)];
        });
    });
}
exports.hashPassword = hashPassword;
function verifyPassword(password, hash) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, bcryptjs_1["default"].compare(password, hash)];
        });
    });
}
exports.verifyPassword = verifyPassword;
function registerUser(email, password, fullName) {
    return __awaiter(this, void 0, void 0, function () {
        var existing, hashedPassword, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, db_1.prisma.user.findUnique({ where: { email: email } })];
                case 1:
                    existing = _a.sent();
                    if (existing) {
                        throw new Error("Email already exists");
                    }
                    return [4 /*yield*/, hashPassword(password)];
                case 2:
                    hashedPassword = _a.sent();
                    return [4 /*yield*/, db_1.prisma.user.create({
                            data: {
                                email: email,
                                password: hashedPassword,
                                fullName: fullName
                            },
                            select: { id: true, email: true, fullName: true }
                        })];
                case 3:
                    user = _a.sent();
                    return [2 /*return*/, user];
            }
        });
    });
}
exports.registerUser = registerUser;
function authenticateUser(email, password) {
    return __awaiter(this, void 0, void 0, function () {
        var result, users, user, defaultFullName, isPlainTextPassword, isValid, hashedPassword, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 10, , 11]);
                    return [4 /*yield*/, db_1.prisma.user.findRaw({
                            filter: { email: email },
                            options: { limit: 1 }
                        })];
                case 1:
                    result = _a.sent();
                    users = [];
                    if (Array.isArray(result)) {
                        users = result;
                    }
                    else if (result && typeof result === 'object') {
                        // Sometimes findRaw might return a single result object, not array
                        users = [result];
                    }
                    user = users[0];
                    if (!user) {
                        throw new Error("Invalid credentials");
                    }
                    if (!(!user.fullName || user.fullName === null)) return [3 /*break*/, 3];
                    defaultFullName = email.split('@')[0] || 'User';
                    return [4 /*yield*/, db_1.prisma.user.updateMany({
                            filter: { _id: user._id },
                            update: { $set: { fullName: defaultFullName } }
                        })];
                case 2:
                    _a.sent();
                    user.fullName = defaultFullName;
                    _a.label = 3;
                case 3:
                    isPlainTextPassword = !user.password || user.password.length < 60 || !user.password.startsWith('$2');
                    isValid = false;
                    if (!isPlainTextPassword) return [3 /*break*/, 7];
                    // Password is stored as plain text - compare directly (legacy support)
                    // Also hash it for future use
                    isValid = password === user.password;
                    if (!isValid) return [3 /*break*/, 6];
                    return [4 /*yield*/, hashPassword(password)];
                case 4:
                    hashedPassword = _a.sent();
                    return [4 /*yield*/, db_1.prisma.user.updateMany({
                            where: { id: user._id },
                            data: { password: hashedPassword }
                        })];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, verifyPassword(password, user.password)];
                case 8:
                    // Password is properly hashed - use bcrypt verification
                    isValid = _a.sent();
                    _a.label = 9;
                case 9:
                    if (!isValid) {
                        throw new Error("Invalid credentials");
                    }
                    return [2 /*return*/, {
                            id: user._id.toString(),
                            email: user.email,
                            fullName: user.fullName || email.split('@')[0] || 'User'
                        }];
                case 10:
                    error_1 = _a.sent();
                    // Re-throw original error if not handled
                    if (error_1.message === "Invalid credentials") {
                        throw error_1;
                    }
                    throw new Error("Invalid credentials");
                case 11: return [2 /*return*/];
            }
        });
    });
}
exports.authenticateUser = authenticateUser;

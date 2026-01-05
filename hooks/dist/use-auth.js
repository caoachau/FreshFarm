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
exports.useAuth = void 0;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
function useAuth() {
    var _this = this;
    var router = navigation_1.useRouter();
    var _a = react_1.useState(null), user = _a[0], setUser = _a[1];
    var _b = react_1.useState(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = react_1.useState(null), token = _c[0], setToken = _c[1];
    react_1.useEffect(function () {
        var savedUser = localStorage.getItem("user");
        var savedToken = localStorage.getItem("authToken");
        if (savedUser && savedToken) {
            try {
                setUser(JSON.parse(savedUser));
                setToken(savedToken);
            }
            catch (error) {
                console.error("[v0] Failed to load user from localStorage:", error);
                localStorage.removeItem("user");
                localStorage.removeItem("authToken");
            }
        }
        setIsLoading(false);
    }, []);
    var login = function (email, password) { return __awaiter(_this, void 0, void 0, function () {
        var response, errorData, userData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, 7, 8]);
                    return [4 /*yield*/, fetch("/api/auth/login", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email: email, password: password })
                        })];
                case 2:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()["catch"](function () { return ({ error: "Unknown error" }); })];
                case 3:
                    errorData = _a.sent();
                    throw new Error(errorData.error || "Login failed");
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    userData = _a.sent();
                    setUser(userData);
                    localStorage.setItem("user", JSON.stringify(userData));
                    localStorage.setItem("authToken", userData.id);
                    setToken(userData.id);
                    return [2 /*return*/, userData];
                case 6:
                    error_1 = _a.sent();
                    console.error("[v0] Login error:", error_1);
                    throw error_1;
                case 7:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var signup = function (email, password, fullName) { return __awaiter(_this, void 0, void 0, function () {
        var response, userData, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setIsLoading(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch("/api/auth/register", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email: email, password: password, fullName: fullName })
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("Signup failed");
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    userData = _a.sent();
                    setUser(userData);
                    localStorage.setItem("user", JSON.stringify(userData));
                    localStorage.setItem("authToken", userData.id);
                    setToken(userData.id);
                    return [2 /*return*/, userData];
                case 4:
                    error_2 = _a.sent();
                    console.error("[v0] Signup error:", error_2);
                    throw error_2;
                case 5:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var logout = function () {
        setUser(null);
        setToken(null);
        localStorage.removeItem("user");
        localStorage.removeItem("authToken");
        router.push("/");
    };
    var updateProfile = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var response, updatedUser, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!token)
                        return [2 /*return*/];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, fetch("/api/auth/profile", {
                            method: "PATCH",
                            headers: {
                                "Content-Type": "application/json",
                                "x-user-id": token
                            },
                            body: JSON.stringify(data)
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    updatedUser = _a.sent();
                    setUser(updatedUser);
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_3 = _a.sent();
                    console.error("[v0] Error updating profile:", error_3);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    return {
        user: user ? __assign(__assign({}, user), { name: user.fullName }) : null,
        isLoading: isLoading,
        isAuthenticated: !!user,
        token: token,
        login: login,
        signup: signup,
        logout: logout,
        updateProfile: updateProfile
    };
}
exports.useAuth = useAuth;

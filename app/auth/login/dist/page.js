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
var navigation_1 = require("next/navigation");
var lucide_react_1 = require("lucide-react");
function LoginPage() {
    var _this = this;
    var router = navigation_1.useRouter();
    var _a = react_1.useState({ email: "", password: "" }), formData = _a[0], setFormData = _a[1];
    var _b = react_1.useState(false), showPassword = _b[0], setShowPassword = _b[1];
    var _c = react_1.useState(false), rememberMe = _c[0], setRememberMe = _c[1];
    var _d = react_1.useState(""), error = _d[0], setError = _d[1];
    var _e = react_1.useState(false), isLoading = _e[0], setIsLoading = _e[1];
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = value, _a)));
        });
        setError("");
    };
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var res, data, userId, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!formData.email || !formData.password) {
                        setError("Vui lòng điền tất cả các trường");
                        return [2 /*return*/];
                    }
                    setIsLoading(true);
                    setError("");
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch("/api/auth/login", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                email: formData.email,
                                password: formData.password
                            })
                        })];
                case 2:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 3:
                    data = _a.sent();
                    if (!res.ok) {
                        setError((data === null || data === void 0 ? void 0 : data.error) || "Email hoặc mật khẩu không đúng");
                        return [2 /*return*/];
                    }
                    userId = res.headers.get("x-user-id");
                    if (userId) {
                        localStorage.setItem("userId", userId);
                    }
                    // lưu user để hiển thị UI / useAuth
                    localStorage.setItem("user", JSON.stringify(data));
                    // nhớ đăng nhập (tuỳ bạn): nếu không tick remember thì có thể dùng sessionStorage
                    if (!rememberMe) {
                        // ví dụ: chỉ giữ userId trong session (tuỳ kiến trúc bạn muốn)
                        // sessionStorage.setItem("userId", userId || "")
                        // localStorage.removeItem("userId")
                    }
                    router.push("/");
                    router.refresh();
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _a.sent();
                    setError("Không thể kết nối máy chủ. Vui lòng thử lại.");
                    return [3 /*break*/, 6];
                case 5:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement("div", { className: "min-h-screen bg-white flex items-center justify-center p-4" },
        react_1["default"].createElement("div", { className: "w-full max-w-md" },
            react_1["default"].createElement("div", { className: "bg-white rounded-2xl shadow-xl overflow-hidden" },
                react_1["default"].createElement("div", { className: "bg-white text-black" },
                    react_1["default"].createElement("div", { className: "flex items-center justify-center mb-4" },
                        react_1["default"].createElement("div", { className: "backdrop-blur-sm p-2 rounded-full" },
                            react_1["default"].createElement("img", { src: "/logo2.jpg", alt: "FreshFarm Logo", className: "h-20 w-20 object-contain" }))),
                    react_1["default"].createElement("h1", { className: "text-3xl font-bold text-center mb-2" }, "FreshFarm"),
                    react_1["default"].createElement("h4", { className: "text-xl font-bold text-center mb-2" }, "\u0110\u0103ng Nh\u1EADp"),
                    react_1["default"].createElement("p", { className: "text-center text-gray-500 text-sm" }, "Ch\u00E0o m\u1EEBng b\u1EA1n quay l\u1EA1i")),
                react_1["default"].createElement("div", { className: "p-8" },
                    error && (react_1["default"].createElement("div", { className: "mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm" }, error)),
                    react_1["default"].createElement("form", { onSubmit: handleSubmit, className: "space-y-5" },
                        react_1["default"].createElement("div", null,
                            react_1["default"].createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "Email"),
                            react_1["default"].createElement("div", { className: "relative" },
                                react_1["default"].createElement(lucide_react_1.Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" }),
                                react_1["default"].createElement("input", { type: "email", name: "email", value: formData.email, onChange: handleChange, placeholder: "example@email.com", className: "w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition" }))),
                        react_1["default"].createElement("div", null,
                            react_1["default"].createElement("label", { className: "block text-sm font-medium text-gray-700 mb-2" }, "M\u1EADt kh\u1EA9u"),
                            react_1["default"].createElement("div", { className: "relative" },
                                react_1["default"].createElement(lucide_react_1.Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" }),
                                react_1["default"].createElement("input", { type: showPassword ? "text" : "password", name: "password", value: formData.password, onChange: handleChange, placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022", className: "w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition" }),
                                react_1["default"].createElement("button", { type: "button", onClick: function () { return setShowPassword(!showPassword); }, className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition" }, showPassword ? react_1["default"].createElement(lucide_react_1.EyeOff, { className: "w-5 h-5" }) : react_1["default"].createElement(lucide_react_1.Eye, { className: "w-5 h-5" })))),
                        react_1["default"].createElement("div", { className: "flex items-center justify-between" },
                            react_1["default"].createElement("label", { className: "flex items-center cursor-pointer" },
                                react_1["default"].createElement("input", { type: "checkbox", checked: rememberMe, onChange: function (e) { return setRememberMe(e.target.checked); }, className: "w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500" }),
                                react_1["default"].createElement("span", { className: "ml-2 text-sm text-gray-600" }, "Ghi nh\u1EDB t\u00F4i")),
                            react_1["default"].createElement("a", { href: "#", className: "text-sm text-emerald-600 hover:text-emerald-700 font-medium transition" }, "Qu\u00EAn m\u1EADt kh\u1EA9u?")),
                        react_1["default"].createElement("button", { type: "submit", disabled: isLoading, className: "w-full bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 rounded-lg font-medium hover:from-emerald-600 hover:to-green-700 transition shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed" }, isLoading ? "Đang xử lý..." : "Đăng Nhập")),
                    react_1["default"].createElement("p", { className: "text-center mt-6 text-sm text-gray-600" },
                        "Ch\u01B0a c\u00F3 t\u00E0i kho\u1EA3n?",
                        " ",
                        react_1["default"].createElement("a", { href: "/auth/signup", className: "text-emerald-600 hover:text-emerald-700 font-semibold transition" }, "\u0110\u0103ng k\u00FD ngay")))),
            react_1["default"].createElement("div", { className: "mt-6 grid grid-cols-3 gap-3 text-center" },
                react_1["default"].createElement("div", { className: "bg-white/50 backdrop-blur-sm rounded-lg p-3" },
                    react_1["default"].createElement(lucide_react_1.CheckCircle2, { className: "w-6 h-6 text-emerald-600 mx-auto mb-1" }),
                    react_1["default"].createElement("p", { className: "text-xs text-gray-600 font-medium" }, "Mi\u1EC5n ph\u00ED")),
                react_1["default"].createElement("div", { className: "bg-white/50 backdrop-blur-sm rounded-lg p-3" },
                    react_1["default"].createElement(lucide_react_1.CheckCircle2, { className: "w-6 h-6 text-emerald-600 mx-auto mb-1" }),
                    react_1["default"].createElement("p", { className: "text-xs text-gray-600 font-medium" }, "B\u1EA3o m\u1EADt")),
                react_1["default"].createElement("div", { className: "bg-white/50 backdrop-blur-sm rounded-lg p-3" },
                    react_1["default"].createElement(lucide_react_1.CheckCircle2, { className: "w-6 h-6 text-emerald-600 mx-auto mb-1" }),
                    react_1["default"].createElement("p", { className: "text-xs text-gray-600 font-medium" }, "Nhanh ch\u00F3ng"))))));
}
exports["default"] = LoginPage;

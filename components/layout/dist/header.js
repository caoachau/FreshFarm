"use client";
"use strict";
exports.__esModule = true;
var link_1 = require("next/link");
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var use_auth_1 = require("@/hooks/use-auth");
var use_cart_1 = require("@/hooks/use-cart");
var swr_1 = require("swr");
var fetcher_1 = require("@/lib/fetcher");
var dropdown_menu_1 = require("@/components/ui/dropdown-menu");
function Header() {
    var _a = react_1.useState(false), isMenuOpen = _a[0], setIsMenuOpen = _a[1];
    var searchParams = navigation_1.useSearchParams();
    var router = navigation_1.useRouter();
    var pathname = navigation_1.usePathname();
    var _b = react_1.useState(searchParams.get("search") || ""), searchTerm = _b[0], setSearchTerm = _b[1];
    var _c = react_1.useState(""), phoneQuery = _c[0], setPhoneQuery = _c[1];
    var _d = use_auth_1.useAuth(), isAuthenticated = _d.isAuthenticated, user = _d.user;
    var items = use_cart_1.useCart().items;
    var handleSearch = function (e) {
        e.preventDefault();
        if (searchTerm.trim()) {
            var params = new URLSearchParams(searchParams.toString());
            params.set("search", searchTerm.trim());
            params["delete"]("page");
            router.push("/products?" + params.toString());
        }
    };
    var handleQuickTracking = function (e) {
        e.preventDefault();
        if (!phoneQuery.trim())
            return;
        var params = new URLSearchParams();
        params.set("phone", phoneQuery.trim());
        router.push("/track-order?" + params.toString());
    };
    var cartItemCount = (items === null || items === void 0 ? void 0 : items.length) || 0;
    var categories = swr_1["default"]("/api/categories", fetcher_1.fetcher).data;
    var isActive = function (path) { return pathname === path || pathname.startsWith(path + "/"); };
    return (React.createElement("header", { className: "sticky top-0 z-50 bg-white border-b border-border shadow-sm" },
        React.createElement("div", { className: "bg-gradient-to-r from-primary to-primary-dark text-white py-2" },
            React.createElement("div", { className: "max-w-7xl mx-auto px-4" },
                React.createElement("p", { className: "text-xs md:text-sm text-center" }, "\uD83D\uDE9A Mi\u1EC5n ph\u00ED giao h\u00E0ng t\u1EEB 300.000\u0111 | \u23F1 Giao h\u00E0ng nhanh 2H"))),
        React.createElement("div", { className: "max-w-7xl mx-auto px-4" },
            React.createElement("div", { className: "flex items-center justify-between gap-4 py-3" },
                React.createElement(link_1["default"], { href: "/", className: "flex items-center gap-2 flex-shrink-0 group" },
                    React.createElement("img", { src: "/logo2.jpg", alt: "FreshFarm Logo", className: "h-10 sm:h-12 object-contain group-hover:scale-105 transition-transform" }),
                    React.createElement("span", { className: "font-bold text-lg text-primary hidden sm:inline" }, "FreshFarm")),
                React.createElement("div", { className: "flex items-center gap-3" },
                    React.createElement("form", { onSubmit: handleSearch, className: "hidden lg:flex items-center bg-neutral-50 border border-neutral-200 rounded-full px-4 py-2 hover:border-primary/50 focus-within:border-primary transition-colors" },
                        React.createElement(lucide_react_1.Search, { size: 18, className: "text-neutral-400 flex-shrink-0" }),
                        React.createElement("input", { type: "text", placeholder: "T\u00ECm ki\u1EBFm s\u1EA3n ph\u1EA9m...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "bg-transparent ml-2 outline-none w-40 text-sm text-neutral-700 placeholder:text-neutral-400" })),
                    React.createElement(dropdown_menu_1.DropdownMenu, null,
                        React.createElement(dropdown_menu_1.DropdownMenuTrigger, { asChild: true },
                            React.createElement("button", { className: "flex items-center justify-center p-2 hover:bg-neutral-100 rounded-full transition-colors group", title: "Th\u00F4ng tin" },
                                React.createElement("div", { className: "flex flex-col gap-1" },
                                    React.createElement("span", { className: "w-4 h-0.5 bg-neutral-700 group-hover:bg-primary transition-colors" }),
                                    React.createElement("span", { className: "w-4 h-0.5 bg-neutral-700 group-hover:bg-primary transition-colors" }),
                                    React.createElement("span", { className: "w-4 h-0.5 bg-neutral-700 group-hover:bg-primary transition-colors" })))),
                        React.createElement(dropdown_menu_1.DropdownMenuContent, { align: "end", className: "w-64" },
                            React.createElement(dropdown_menu_1.DropdownMenuLabel, null, "Th\u00F4ng Tin"),
                            React.createElement(dropdown_menu_1.DropdownMenuSeparator, null),
                            React.createElement(dropdown_menu_1.DropdownMenuItem, { asChild: true },
                                React.createElement(link_1["default"], { href: "/shipping", className: "flex items-center gap-2 cursor-pointer" },
                                    React.createElement(lucide_react_1.Truck, { size: 16, className: "text-neutral-500" }),
                                    React.createElement("span", null, "Ch\u00EDnh S\u00E1ch Giao H\u00E0ng"))),
                            React.createElement(dropdown_menu_1.DropdownMenuItem, { asChild: true },
                                React.createElement(link_1["default"], { href: "/return-policy", className: "flex items-center gap-2 cursor-pointer" },
                                    React.createElement(lucide_react_1.CreditCard, { size: 16, className: "text-neutral-500" }),
                                    React.createElement("span", null, "Ch\u00EDnh S\u00E1ch \u0110\u1ED5i Tr\u1EA3"))),
                            React.createElement(dropdown_menu_1.DropdownMenuItem, { asChild: true },
                                React.createElement(link_1["default"], { href: "/privacy", className: "flex items-center gap-2 cursor-pointer" },
                                    React.createElement(lucide_react_1.Shield, { size: 16, className: "text-neutral-500" }),
                                    React.createElement("span", null, "Ch\u00EDnh S\u00E1ch B\u1EA3o M\u1EADt"))),
                            React.createElement(dropdown_menu_1.DropdownMenuItem, { asChild: true },
                                React.createElement(link_1["default"], { href: "/terms", className: "flex items-center gap-2 cursor-pointer" },
                                    React.createElement(lucide_react_1.FileText, { size: 16, className: "text-neutral-500" }),
                                    React.createElement("span", null, "\u0110i\u1EC1u Kho\u1EA3n S\u1EED D\u1EE5ng"))),
                            React.createElement(dropdown_menu_1.DropdownMenuSeparator, null),
                            React.createElement(dropdown_menu_1.DropdownMenuItem, { asChild: true },
                                React.createElement(link_1["default"], { href: "/guide", className: "flex items-center gap-2 cursor-pointer" },
                                    React.createElement(lucide_react_1.Info, { size: 16, className: "text-neutral-500" }),
                                    React.createElement("span", null, "H\u01B0\u1EDBng D\u1EABn Mua H\u00E0ng"))),
                            React.createElement(dropdown_menu_1.DropdownMenuItem, { asChild: true },
                                React.createElement(link_1["default"], { href: "/faq", className: "flex items-center gap-2 cursor-pointer" },
                                    React.createElement(lucide_react_1.HelpCircle, { size: 16, className: "text-neutral-500" }),
                                    React.createElement("span", null, "C\u00E2u H\u1ECFi Th\u01B0\u1EDDng G\u1EB7p"))))),
                    React.createElement(link_1["default"], { href: isAuthenticated ? "/profile" : "/auth/login", className: "hidden sm:flex items-center justify-center p-2 hover:bg-neutral-100 rounded-full transition-colors group", title: isAuthenticated ? (user === null || user === void 0 ? void 0 : user.fullName) || "Tài khoản" : "Đăng nhập" },
                        React.createElement(lucide_react_1.User, { size: 20, className: "text-neutral-700 group-hover:text-primary transition-colors" })),
                    React.createElement(link_1["default"], { href: "/cart", className: "relative flex items-center justify-center p-2 hover:bg-neutral-100 rounded-full transition-colors group", title: "Gi\u1ECF h\u00E0ng" },
                        React.createElement(lucide_react_1.ShoppingCart, { size: 20, className: "text-neutral-700 group-hover:text-primary transition-colors" }),
                        cartItemCount > 0 && (React.createElement("span", { className: "absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full min-w-[18px] h-4.5 flex items-center justify-center px-1 shadow-md" }, cartItemCount > 99 ? "99+" : cartItemCount))),
                    React.createElement("button", { className: "md:hidden flex items-center justify-center p-2 hover:bg-neutral-100 rounded-full transition-colors", onClick: function () { return setIsMenuOpen(!isMenuOpen); }, "aria-label": "Menu" }, isMenuOpen ? React.createElement(lucide_react_1.X, { size: 20, className: "text-neutral-700" }) : React.createElement(lucide_react_1.Menu, { size: 20, className: "text-neutral-700" })))),
            React.createElement("div", { className: "hidden md:flex items-center gap-4 pb-3 border-t border-neutral-100 pt-3" },
                React.createElement(dropdown_menu_1.DropdownMenu, null,
                    React.createElement(dropdown_menu_1.DropdownMenuTrigger, { asChild: true },
                        React.createElement(button_1.Button, { variant: "outline", className: "flex items-center gap-2 bg-white hover:bg-neutral-50 border border-neutral-200 h-9 text-sm" },
                            React.createElement(lucide_react_1.Package, { size: 16 }),
                            React.createElement("span", { className: "font-medium" }, "Danh M\u1EE5c"))),
                    React.createElement(dropdown_menu_1.DropdownMenuContent, { align: "start", className: "w-64 max-h-[80vh] overflow-y-auto" },
                        React.createElement(dropdown_menu_1.DropdownMenuLabel, null, "Danh M\u1EE5c S\u1EA3n Ph\u1EA9m"),
                        React.createElement(dropdown_menu_1.DropdownMenuSeparator, null), categories === null || categories === void 0 ? void 0 :
                        categories.map(function (category) { return (React.createElement(dropdown_menu_1.DropdownMenuItem, { key: category.id, asChild: true },
                            React.createElement(link_1["default"], { href: "/products?category=" + category.id, className: "flex items-center gap-2 cursor-pointer" },
                                React.createElement(lucide_react_1.Package, { size: 16, className: "text-neutral-500" }),
                                React.createElement("span", null, category.name)))); }),
                        React.createElement(dropdown_menu_1.DropdownMenuSeparator, null),
                        React.createElement(dropdown_menu_1.DropdownMenuLabel, null, "S\u1EA3n Ph\u1EA9m N\u1ED5i B\u1EADt"),
                        React.createElement(dropdown_menu_1.DropdownMenuSeparator, null),
                        React.createElement(dropdown_menu_1.DropdownMenuItem, { asChild: true },
                            React.createElement(link_1["default"], { href: "/products?sort=bestselling", className: "flex items-center gap-2 cursor-pointer" },
                                React.createElement(lucide_react_1.TrendingUp, { size: 16, className: "text-neutral-500" }),
                                React.createElement("span", null, "\uD83D\uDD25 H\u00E0ng B\u00E1n Ch\u1EA1y"))),
                        React.createElement(dropdown_menu_1.DropdownMenuItem, { asChild: true },
                            React.createElement(link_1["default"], { href: "/products?sort=rating&minRating=4", className: "flex items-center gap-2 cursor-pointer" },
                                React.createElement(lucide_react_1.Star, { size: 16, className: "text-neutral-500" }),
                                React.createElement("span", null, "\u2B50 S\u1EA3n Ph\u1EA9m \u0110\u00E1nh Gi\u00E1 Cao"))),
                        React.createElement(dropdown_menu_1.DropdownMenuItem, { asChild: true },
                            React.createElement(link_1["default"], { href: "/products?discounted=true", className: "flex items-center gap-2 cursor-pointer" },
                                React.createElement(lucide_react_1.Tag, { size: 16, className: "text-neutral-500" }),
                                React.createElement("span", null, "\uD83D\uDCB0 \u0110ang Khuy\u1EBFn M\u00E3i"))),
                        React.createElement(dropdown_menu_1.DropdownMenuItem, { asChild: true },
                            React.createElement(link_1["default"], { href: "/products?sort=newest", className: "flex items-center gap-2 cursor-pointer" },
                                React.createElement(lucide_react_1.Sparkles, { size: 16, className: "text-neutral-500" }),
                                React.createElement("span", null, "\u2728 S\u1EA3n Ph\u1EA9m M\u1EDBi"))))),
                React.createElement("nav", { className: "flex items-center gap-1 flex-1" },
                    React.createElement(link_1["default"], { href: "/products", className: "px-3 py-1.5 rounded-lg font-medium text-sm transition-all " + (isActive("/products")
                            ? "bg-primary text-white shadow-sm"
                            : "text-neutral-700 hover:text-primary hover:bg-neutral-50") }, "S\u1EA3n Ph\u1EA9m"),
                    React.createElement(link_1["default"], { href: "/cart", className: "px-3 py-1.5 rounded-lg font-medium text-sm transition-all " + (isActive("/cart")
                            ? "bg-primary text-white shadow-sm"
                            : "text-neutral-700 hover:text-primary hover:bg-neutral-50") }, "Gi\u1ECF H\u00E0ng"),
                    React.createElement(link_1["default"], { href: "/track-order", className: "px-3 py-1.5 rounded-lg font-medium text-sm transition-all " + (isActive("/track-order")
                            ? "bg-primary text-white shadow-sm"
                            : "text-neutral-700 hover:text-primary hover:bg-neutral-50") }, "Tra C\u1EE9u \u0110\u01A1n"),
                    React.createElement(link_1["default"], { href: "/about", className: "px-3 py-1.5 rounded-lg font-medium text-sm transition-all " + (isActive("/about")
                            ? "bg-primary text-white shadow-sm"
                            : "text-neutral-700 hover:text-primary hover:bg-neutral-50") }, "V\u1EC1 Ch\u00FAng T\u00F4i"),
                    React.createElement(link_1["default"], { href: "/news", className: "px-3 py-1.5 rounded-lg font-medium text-sm transition-all " + (isActive("/news")
                            ? "bg-primary text-white shadow-sm"
                            : "text-neutral-700 hover:text-primary hover:bg-neutral-50") }, "Tin T\u1EE9c"),
                    React.createElement(link_1["default"], { href: "/contact", className: "px-3 py-1.5 rounded-lg font-medium text-sm transition-all " + (isActive("/contact")
                            ? "bg-primary text-white shadow-sm"
                            : "text-neutral-700 hover:text-primary hover:bg-neutral-50") }, "Li\u00EAn H\u1EC7")))),
        isMenuOpen && (React.createElement("nav", { className: "md:hidden border-t border-border bg-neutral-50 px-4 py-4 flex flex-col gap-4" },
            React.createElement("form", { onSubmit: handleSearch, className: "flex items-center bg-white rounded-lg px-4 py-2 border border-border" },
                React.createElement(lucide_react_1.Search, { size: 18, className: "text-neutral-400" }),
                React.createElement("input", { type: "text", placeholder: "T\u00ECm s\u1EA3n ph\u1EA9m...", value: searchTerm, onChange: function (e) { return setSearchTerm(e.target.value); }, className: "bg-transparent ml-2 outline-none w-full text-sm" })),
            React.createElement("form", { onSubmit: handleQuickTracking, className: "flex items-center bg-white rounded-lg px-4 py-2 border border-border" },
                React.createElement(lucide_react_1.Phone, { size: 18, className: "text-neutral-400" }),
                React.createElement("input", { type: "tel", placeholder: "Tra c\u1EE9u \u0111\u01A1n theo S\u0110T", value: phoneQuery, onChange: function (e) { return setPhoneQuery(e.target.value); }, className: "bg-transparent ml-2 outline-none w-full text-sm" })),
            React.createElement(link_1["default"], { href: "/products", className: "text-neutral-700 hover:text-primary transition font-medium" }, "S\u1EA3n Ph\u1EA9m"),
            React.createElement(link_1["default"], { href: "/cart", className: "text-neutral-700 hover:text-primary transition font-medium" }, "Gi\u1ECF H\u00E0ng"),
            React.createElement(link_1["default"], { href: "/track-order", className: "text-neutral-700 hover:text-primary transition font-medium" }, "Tra C\u1EE9u \u0110\u01A1n"),
            React.createElement(link_1["default"], { href: "/about", className: "text-neutral-700 hover:text-primary transition font-medium" }, "V\u1EC1 Ch\u00FAng T\u00F4i"),
            React.createElement(link_1["default"], { href: "/news", className: "text-neutral-700 hover:text-primary transition font-medium" }, "Tin T\u1EE9c"),
            React.createElement(link_1["default"], { href: "/contact", className: "text-neutral-700 hover:text-primary transition font-medium" }, "Li\u00EAn H\u1EC7"),
            React.createElement(link_1["default"], { href: isAuthenticated ? "/profile" : "/auth/login" },
                React.createElement(button_1.Button, { className: "w-full bg-primary hover:bg-primary-dark" }, isAuthenticated ? (user === null || user === void 0 ? void 0 : user.fullName) || "Tài Khoản" : "Đăng Nhập"))))));
}
exports["default"] = Header;

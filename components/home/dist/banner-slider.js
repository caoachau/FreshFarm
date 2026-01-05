"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var lucide_react_1 = require("lucide-react");
var button_1 = require("@/components/ui/button");
var slides = [
    {
        id: 1,
        title: "Nông Sản Sạch Hàng Ngày",
        subtitle: "Giao hàng nhanh 2 giờ - Giá tốt nhất",
        image: "/fresh-vegetables-market.jpg",
        cta: "Mua Ngay"
    },
    {
        id: 2,
        title: "Giảm Tới 40%",
        subtitle: "Khuyến mãi đặc biệt cho sản phẩm hữu cơ",
        image: "/sale-discount-banner.jpg",
        cta: "Xem Khuyến Mãi"
    },
    {
        id: 3,
        title: "Trái Cây Nhập Khẩu",
        subtitle: "Chất lượng quốc tế - Giá Việt",
        image: "/fresh-imported-fruits.jpg",
        cta: "Khám Phá"
    },
];
function BannerSlider() {
    var _a = react_1.useState(0), current = _a[0], setCurrent = _a[1];
    react_1.useEffect(function () {
        var timer = setInterval(function () {
            setCurrent(function (prev) { return (prev + 1) % slides.length; });
        }, 5000);
        return function () { return clearInterval(timer); };
    }, []);
    var prev = function () { return setCurrent(function (prev) { return (prev - 1 + slides.length) % slides.length; }); };
    var next = function () { return setCurrent(function (prev) { return (prev + 1) % slides.length; }); };
    return (React.createElement("div", { className: "relative h-32 sm:h-40 lg:h-48 rounded-lg overflow-hidden bg-neutral-200 group" },
        slides.map(function (slide, index) { return (React.createElement("div", { key: slide.id, className: "absolute inset-0 transition-opacity duration-1000 " + (index === current ? "opacity-100" : "opacity-0"), style: {
                backgroundImage: "url('" + slide.image + "')",
                backgroundSize: "cover",
                backgroundPosition: "center"
            } },
            React.createElement("div", { className: "absolute inset-0 bg-black/30" }),
            React.createElement("div", { className: "relative h-full flex flex-col items-center justify-center text-center text-white px-4" },
                React.createElement("h2", { className: "text-xl sm:text-2xl lg:text-3xl font-bold mb-1 text-balance" }, slide.title),
                React.createElement("p", { className: "text-sm sm:text-base mb-3 text-neutral-100" }, slide.subtitle),
                React.createElement(button_1.Button, { size: "sm", className: "bg-primary hover:bg-primary-dark text-white text-sm px-4 py-2" }, slide.cta)))); }),
        React.createElement("button", { onClick: prev, className: "absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-1.5 rounded-full transition opacity-0 group-hover:opacity-100", "aria-label": "Previous slide" },
            React.createElement(lucide_react_1.ChevronLeft, { size: 18, className: "text-neutral-800" })),
        React.createElement("button", { onClick: next, className: "absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white p-1.5 rounded-full transition opacity-0 group-hover:opacity-100", "aria-label": "Next slide" },
            React.createElement(lucide_react_1.ChevronRight, { size: 18, className: "text-neutral-800" })),
        React.createElement("div", { className: "absolute bottom-2 left-1/2 -translate-x-1/2 z-10 flex gap-1.5" }, slides.map(function (_, index) { return (React.createElement("button", { key: index, onClick: function () { return setCurrent(index); }, className: "w-1.5 h-1.5 rounded-full transition " + (index === current ? "bg-white w-4" : "bg-white/60"), "aria-label": "Go to slide " + (index + 1) })); }))));
}
exports["default"] = BannerSlider;

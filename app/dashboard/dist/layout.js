"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var use_auth_1 = require("@/hooks/use-auth");
var sidebar_1 = require("@/components/dashboard/sidebar");
function DashboardLayout(_a) {
    var children = _a.children;
    var router = navigation_1.useRouter();
    var _b = use_auth_1.useAuth(), user = _b.user, token = _b.token, isLoading = _b.isLoading, isAuthenticated = _b.isAuthenticated;
    var _c = react_1.useState(null), userRole = _c[0], setUserRole = _c[1];
    react_1.useEffect(function () {
        if (!isLoading && !isAuthenticated) {
            router.push("/auth/login");
            return;
        }
        if (user && token) {
            // Fetch user role từ API với x-user-id
            fetch("/api/auth/me", {
                headers: {
                    "x-user-id": token
                }
            })
                .then(function (res) { return res.json(); })
                .then(function (data) {
                if (data.role) {
                    setUserRole(data.role);
                }
                else {
                    setUserRole("BUYER");
                }
            })["catch"](function () {
                setUserRole("BUYER");
            });
        }
    }, [user, token, isLoading, isAuthenticated, router]);
    if (isLoading || !userRole) {
        return (React.createElement("div", { className: "flex items-center justify-center min-h-screen" },
            React.createElement("div", { className: "text-center" },
                React.createElement("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" }),
                React.createElement("p", null, "\u0110ang t\u1EA3i..."))));
    }
    return (React.createElement("div", { className: "flex min-h-screen bg-neutral-50" },
        React.createElement(sidebar_1["default"], { role: userRole }),
        React.createElement("main", { className: "flex-1 p-8" }, children)));
}
exports["default"] = DashboardLayout;

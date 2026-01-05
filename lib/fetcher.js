// Generic fetcher dùng cho SWR, tự động gắn header x-user-id nếu có authToken
export const fetcher = async (url) => {
  const isBrowser = typeof window !== "undefined";
  const token = isBrowser ? window.localStorage.getItem("authToken") : null;

  // If no token and URL requires auth, return empty/default data instead of making request
  if (!token && (url.includes("/api/cart") || url.includes("/api/wishlist") || url.includes("/api/orders"))) {
    if (url.includes("/api/wishlist")) {
      return { items: [] };
    }
    return [];
  }

  const res = await fetch(url, {
    headers: token
      ? {
          "x-user-id": token,
        }
      : undefined,
  });

  // Handle 401 gracefully - user not authenticated, return empty data
  if (res.status === 401) {
    if (url.includes("/api/wishlist")) {
      return { items: [] };
    }
    if (url.includes("/api/cart") || url.includes("/api/orders")) {
      return [];
    }
    // For other endpoints, still throw error
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    // Gắn thông tin bổ sung vào đối tượng lỗi.
    error.info = await res.json().catch(() => ({}));
    error.status = res.status;
    throw error;
  }

  return res.json();
};
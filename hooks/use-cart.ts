"use client"
import { useMemo } from "react"
import useSWR from "swr"
import { useAuth } from "./use-auth"

interface CartItem {
  id: string
  productId: string
  quantity: number
  variant?: string
  product: {
    id: string
    name: string
    price: number
    image: string
  }
}

const EMPTY_ARRAY: never[] = [];

const fetcher = (url: string, token: string) => {
  // Fix: Ensure token is always a string - handle object case
  let tokenString: string
  if (typeof token === 'string') {
    tokenString = token.trim()
  } else if (token && typeof token === 'object') {
    // If token is an object, try to extract id property or stringify safely
    tokenString = (token as any)?.id ? String((token as any).id).trim() : JSON.stringify(token)
  } else {
    tokenString = String(token).trim()
  }
  
  if (!tokenString) {
    // Return empty array if no token instead of making request
    return Promise.resolve([]);
  }
  
  return fetch(url, {
    headers: { "x-user-id": tokenString },
  }).then(async (r) => {
    if (r.status === 401) {
      // User not authenticated, return empty array silently
      return [];
    }
    const json = await r.json();
    if (!r.ok) {
      const error: any = new Error(json.error || 'Failed to fetch cart');
      error.status = r.status;
      throw error;
    }
    return json;
  }).catch((error) => {
    // If it's a 401, return empty array instead of throwing
    if (error?.status === 401) {
      return [];
    }
    throw error;
  });
}

export function useCart() {
  const { token, isAuthenticated, isLoading: authLoading } = useAuth()
  
  // Only fetch when authenticated, token exists, and auth is loaded
  const swrKey = !authLoading && isAuthenticated && token ? [`/api/cart`, token] : null;
  
  const { data: items = [], mutate, error } = useSWR(swrKey, ([url, token]) =>
    fetcher(url, token),
    {
      // Suppress errors for 401 - it's expected when not authenticated
      onError: (error) => {
        if (error?.status !== 401) {
          console.error("[useCart] Error:", error);
        }
      },
      // Don't retry on 401
      shouldRetryOnError: (error) => {
        return error?.status !== 401;
      },
    }
  )

  const addToCart = async (productId: string, quantity = 1, variant?: string) => {
    if (!isAuthenticated || !token) {
      throw new Error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng")
    }

    if (!productId) {
      throw new Error("Product ID is required")
    }

    // Token from useAuth is already normalized, but ensure it's a valid string
    const tokenString = String(token).trim()
    
    if (!tokenString || tokenString.length === 0) {
      throw new Error("Invalid authentication token")
    }

    // Validate productId format (should be MongoDB ObjectId)
    if (!/^[0-9a-fA-F]{24}$/.test(String(productId).trim())) {
      throw new Error("Invalid product ID format")
    }

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": tokenString,
        },
        body: JSON.stringify({ 
          productId: String(productId).trim(), 
          quantity: Number(quantity) || 1, 
          variant: variant || null 
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.error || `Failed to add to cart: ${response.status}`
        console.error("[useCart] API Error:", errorMessage, data)
        throw new Error(errorMessage)
      }

      // Successfully added, refresh cart data
      await mutate()
      return data
    } catch (error: any) {
      console.error("[useCart] Error adding to cart:", error)
      // Re-throw error so calling code can handle it
      if (error instanceof Error) {
        throw error
      }
      throw new Error(error?.message || "Không thể thêm sản phẩm vào giỏ hàng")
    }
  }

  const removeFromCart = async (itemId: string) => {
    if (!token) return

    try {
      // Fix: Ensure token is always a string - handle object case
      let tokenString: string
      if (typeof token === 'string') {
        tokenString = token.trim()
      } else if (token && typeof token === 'object') {
        tokenString = (token as any)?.id ? String((token as any).id).trim() : JSON.stringify(token)
      } else {
        tokenString = String(token).trim()
      }
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "DELETE",
        headers: { "x-user-id": tokenString },
      })

      if (response.ok) {
        mutate()
      }
    } catch (error) {
      console.error("[v0] Error removing from cart:", error)
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!token || quantity <= 0) return

    try {
      // Fix: Ensure token is always a string - handle object case
      let tokenString: string
      if (typeof token === 'string') {
        tokenString = token.trim()
      } else if (token && typeof token === 'object') {
        tokenString = (token as any)?.id ? String((token as any).id).trim() : JSON.stringify(token)
      } else {
        tokenString = String(token).trim()
      }
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": tokenString,
        },
        body: JSON.stringify({ quantity }),
      })

      if (response.ok) {
        mutate()
      }
    } catch (error) {
      console.error("[v0] Error updating cart:", error)
    }
  }

  const clearCart = async () => {
    if (!token) return

    try {
      const safeItems = Array.isArray(items) ? items : [];
      for (const item of safeItems) {
        await removeFromCart(item.id)
      }
      mutate()
    } catch (error) {
      console.error("[v0] Error clearing cart:", error)
    }
  }

  const returnedItems = useMemo(() => {
    return Array.isArray(items) ? items : EMPTY_ARRAY;
  }, [items]);
  
  // Fix: isLoaded should be true when data is loaded (even if empty array) or when not authenticated
  const isLoaded = useMemo(() => {
    if (!isAuthenticated) {
      const result = true; // Not authenticated, so we're "loaded" (empty cart)
      return result;
    }
    // If authenticated, we're loaded when we have data (even if it's an empty array) or when there's an error
    const result = (items !== undefined && Array.isArray(items)) || !!error;
    return result;
  }, [isAuthenticated, items, error]);

  return {
    items: returnedItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isLoaded,
  }
}

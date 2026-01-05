"use client"
import useSWR from "swr"
import { useMemo } from "react"
import { useAuth } from "./use-auth"

const fetcher = (url: string, token: string) => {
  // Fix: Ensure token is always a string - handle object case
  let tokenString: string
  if (typeof token === 'string') {
    tokenString = token.trim()
  } else if (token && typeof token === 'object') {
    tokenString = (token as any)?.id ? String((token as any).id).trim() : JSON.stringify(token)
  } else {
    tokenString = String(token).trim()
  }
  
  if (!tokenString) {
    // Return empty data if no token instead of making request
    return Promise.resolve({ items: [] });
  }
  
  return fetch(url, {
    headers: { "x-user-id": tokenString },
  }).then(async (r) => {
    if (r.status === 401) {
      // User not authenticated, return empty wishlist silently
      return { items: [] };
    }
    if (!r.ok) {
      const error: any = new Error('Failed to fetch wishlist');
      error.status = r.status;
      throw error;
    }
    return r.json();
  }).catch((error) => {
    // If it's a 401, return empty wishlist instead of throwing
    if (error?.status === 401) {
      return { items: [] };
    }
    throw error;
  })
}

export function useWishlist() {
  const { token, isAuthenticated, isLoading: authLoading } = useAuth()

  const { data, mutate } = useSWR(
    !authLoading && isAuthenticated && token ? [`/api/wishlist`, token] : null,
    ([url, token]) => fetcher(url, token),
    {
      // Suppress errors for 401 - it's expected when not authenticated
      onError: (error) => {
        if (error?.status !== 401) {
          console.error("[useWishlist] Error:", error);
        }
      },
      // Don't retry on 401
      shouldRetryOnError: (error) => {
        return error?.status !== 401;
      },
    }
  )

  // ⭐ Chuẩn hoá dữ liệu trả về từ API
  const items = Array.isArray(data?.items) ? data.items : []

  // Stabilize wishlist item ids to avoid new array reference each render
  const itemIds = useMemo(() => items.map((item: any) => item.productId), [items])

  const toggleWishlist = async (productId: string) => {
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
      const response = await fetch("/api/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": tokenString,
        },
        body: JSON.stringify({ productId }),
      })

      if (response.ok) mutate()
    } catch (error) {
      console.error("[v0] Error toggling wishlist:", error)
    }
  }

  const isInWishlist = (productId: string) => {
    return items.some((item: any) => item.productId === productId)
  }

  const removeFromWishlist = async (productId: string) => {
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
      const response = await fetch("/api/wishlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": tokenString,
        },
        body: JSON.stringify({ productId }),
      })

      if (response.ok) mutate()
    } catch (error) {
      console.error("[v0] Error removing from wishlist:", error)
    }
  }

  return {
    items: itemIds,
    toggleWishlist,
    isInWishlist,
    removeFromWishlist,
    isLoaded: !!data,
  }
}

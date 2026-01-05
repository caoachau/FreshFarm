import useSWR from "swr"
import { authenticatedFetcher } from "@/lib/fetcher"
import { useAuth } from "./use-auth"

/**
 * Custom hook để sử dụng SWR với authentication tự động
 * Tự động thêm x-user-id header vào requests
 */
export function useAuthenticatedSWR<T = any>(url: string | null) {
  const { token, isAuthenticated } = useAuth()

  const swrKey = isAuthenticated && token && url ? [url, token] : null

  const { data, error, mutate, isLoading } = useSWR<T>(
    swrKey,
    ([url, token]) => authenticatedFetcher(url, token),
    {
      onError: (error) => {
        // Suppress 401 errors when not authenticated - it's expected
        if (error?.message?.includes("401") || error?.message?.includes("Unauthorized")) {
          console.warn("[useAuthenticatedSWR] Unauthorized:", url)
        } else {
          console.error("[useAuthenticatedSWR] Error:", error)
        }
      },
      shouldRetryOnError: (error) => {
        // Don't retry on 401
        return !error?.message?.includes("401") && !error?.message?.includes("Unauthorized")
      },
    }
  )

  return {
    data,
    error,
    mutate,
    isLoading,
  }
}


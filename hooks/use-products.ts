import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function useProducts(category?: string, search?: string, sort = "newest", page = 1) {
  const params = new URLSearchParams()
  if (category) params.append("category", category)
  if (search) params.append("search", search)
  params.append("sort", sort)
  params.append("page", page.toString())

  const { data, error, isLoading } = useSWR(`/api/products?${params.toString()}`, fetcher)

  return {
    products: data?.products || [],
    total: data?.total || 0,
    pages: data?.pages || 1,
    isLoading,
    error,
  }
}

export function useProduct(id: string) {
  const { data, error, isLoading } = useSWR(id ? `/api/products/${id}` : null, fetcher)

  return {
    product: data?.product,
    relatedProducts: data?.relatedProducts || [],
    isLoading,
    error,
  }
}

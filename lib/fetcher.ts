export const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) {
    throw new Error("An error occurred while fetching the data.")
  }
  return res.json()
}

// Authenticated fetcher - gửi x-user-id header
export const authenticatedFetcher = (url: string, token: string | null) => {
  if (!token) {
    return Promise.reject(new Error("No authentication token"))
  }
  
  return fetch(url, {
    headers: {
      "x-user-id": String(token).trim(),
    },
  }).then(async (res) => {
    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      throw new Error(error.error || "An error occurred while fetching the data.")
    }
    return res.json()
  })
}


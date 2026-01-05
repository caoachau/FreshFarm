// Type definitions for Product - matches Prisma schema
export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number | null
  discount: number
  image: string
  images: string[]
  stock: number
  sold: number
  rating: number
  votes: number
  categoryId: string
  brand?: string
  reviews?: number | any[]
  createdAt?: Date | string
  updatedAt?: Date | string
}

// Empty array - products should be fetched from API
export const products: Product[] = []

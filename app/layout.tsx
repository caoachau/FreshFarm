import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "FreshFarm - Nông Sản Sạch Online",
  description: "Mua nông sản tươi sạch trực tuyến với giá tốt nhất. Giao hàng nhanh 2H.",
  keywords: "nông sản, rau quả, hữu cơ, tươi sạch, giao hàng nhanh",
  generator: "v0.app",
  openGraph: {
    title: "FreshFarm - Nông Sản Sạch Online",
    description: "Mua nông sản tươi sạch trực tuyến với giá tốt nhất",
    type: "website",
  },
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#10b981",
  colorScheme: "light",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" className={`${geist.className}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 w-full">
          <div className="max-w-7xl mx-auto px-4 py-8 w-full">
            {children}
          </div>
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}

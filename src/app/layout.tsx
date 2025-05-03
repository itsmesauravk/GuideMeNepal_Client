import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import { Provider } from "@/providers/Providers"
import { ClientSocketProvider } from "@/providers/ClientSocketProvider"
import { NotificationCountProvider } from "@/providers/NotificationCountProvider"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Guide Me Nepal - Hire Verified Travel Guides for Trekking & Tours",
  description:
    "Find and hire verified, local travel guides in Nepal for trekking, cultural tours, and adventure activities. Trusted, experienced, and government-certified guides for every journey.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Provider>
          <Providers />
          <ClientSocketProvider>
            <NotificationCountProvider>{children}</NotificationCountProvider>
          </ClientSocketProvider>
        </Provider>
      </body>
    </html>
  )
}

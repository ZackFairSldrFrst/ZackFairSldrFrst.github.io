import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Escape Room Challenge',
  description: 'A thrilling 15-minute escape room experience',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-escape-primary text-white min-h-screen`}>
        {children}
      </body>
    </html>
  )
} 
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'vietnamese'] })

export const metadata: Metadata = {
    title: 'Waste Collection Platform',
    description: 'Crowdsourced Waste Collection & Recycling Platform',
    manifest: '/manifest.json',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="vi">
            <body className={inter.className}>
                {/* Providers (auth context, react-query, etc.) go here */}
                {children}
            </body>
        </html>
    )
}

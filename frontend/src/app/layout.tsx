import type { Metadata } from 'next'
import './globals.css'
import ClientProviders from '@/components/ClientProviders'

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
            <body className="antialiased">
                <ClientProviders>
                    {children}
                </ClientProviders>
            </body>
        </html>
    )
}
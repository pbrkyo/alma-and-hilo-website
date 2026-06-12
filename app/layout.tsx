import React from "react"
import type { Metadata } from 'next'
import { Fraunces, Karla } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { WhatsAppFab } from '@/components/whatsapp-fab'
import './globals.css'

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ['SOFT', 'WONK', 'opsz'],
  variable: '--font-fraunces',
  display: 'swap',
});

const karla = Karla({
  subsets: ["latin"],
  variable: '--font-karla',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Alma & Hilo | Tejido con Amor - Crochet Artesanal de Costa Rica',
  description: 'Ropa, bolsos y accesorios tejidos a mano con amor por una madre e hija en Costa Rica. Cada pieza es única, hecha con dedicación y tradición artesanal.',
  keywords: ['crochet', 'artesanal', 'Costa Rica', 'hecho a mano', 'tejido', 'bolsos', 'accesorios'],
  openGraph: {
    title: 'Alma & Hilo | Tejido con Amor',
    description: 'Crochet artesanal hecho a mano en Costa Rica',
    type: 'website',
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${fraunces.variable} ${karla.variable} antialiased`}>
        {children}
        <WhatsAppFab />
        <Analytics />
      </body>
    </html>
  )
}

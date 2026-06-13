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
  metadataBase: new URL('https://almayhilo.vercel.app'),
  title: {
    default: 'Alma & Hilo | Crochet artesanal hecho a mano en Costa Rica',
    template: '%s',
  },
  description:
    'Tops, bolsos y accesorios de crochet tejidos a mano por madre e hija en Cartago, Costa Rica. Elegí tu pieza o diseñá la tuya y la tejemos para vos. Pedidos por WhatsApp.',
  keywords: ['crochet', 'artesanal', 'Costa Rica', 'Cartago', 'hecho a mano', 'tejido', 'trapillo', 'bolsos', 'tops', 'gorros', 'amigurumi'],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Alma & Hilo | Crochet artesanal hecho a mano',
    description: 'Tops, bolsos y accesorios de crochet tejidos a mano en Costa Rica. Pedidos por WhatsApp.',
    type: 'website',
    locale: 'es_CR',
    siteName: 'Alma & Hilo',
    url: 'https://almayhilo.vercel.app',
    images: [{ url: '/hero/estudio-poster.jpg', width: 1280, height: 720, alt: 'Taller de crochet Alma & Hilo' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alma & Hilo | Crochet artesanal hecho a mano',
    description: 'Tops, bolsos y accesorios de crochet tejidos a mano en Costa Rica.',
    images: ['/hero/estudio-poster.jpg'],
  },
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

import type { Metadata } from "next"
import { BrandBar } from "@/components/brand-bar"
import { Configurator } from "@/components/configurator"
import { Footer } from "@/components/footer"

export const metadata: Metadata = {
  title: "Hacé tu pieza · Alma & Hilo",
  description:
    "Diseñá tu pieza de crochet a medida: elegí el tipo, la textura, los colores y los detalles. La tejemos a mano para vos y coordinamos por WhatsApp.",
  openGraph: {
    title: "Hacé tu pieza · Alma & Hilo",
    description: "Diseñá tu pieza de crochet a medida y la tejemos a mano para vos.",
    type: "website",
  },
}

export default function HaceTuPiezaPage() {
  return (
    <main className="min-h-screen bg-[#F5F0E6] bg-grano">
      <BrandBar />
      <Configurator />
      <Footer />
    </main>
  )
}

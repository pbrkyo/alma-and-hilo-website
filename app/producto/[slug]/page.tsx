import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BrandBar } from "@/components/brand-bar"
import { ProductDetail } from "@/components/product-detail"
import { Footer } from "@/components/footer"
import { getProducto, PRODUCTOS, formatColones } from "@/lib/products"

export function generateStaticParams() {
  return PRODUCTOS.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const producto = getProducto(slug)
  if (!producto) return { title: "Pieza no encontrada · Alma & Hilo" }

  const titulo = `${producto.nombre} · Alma & Hilo`
  const descripcion = `${producto.gancho}. Hecho a mano en Costa Rica, desde ${formatColones(
    producto.precioDesde,
  )}. Pedí el tuyo por WhatsApp.`

  return {
    title: titulo,
    description: descripcion,
    openGraph: {
      title: titulo,
      description: descripcion,
      type: "website",
      images: [{ url: producto.imagenes[0], width: 1200, height: 900, alt: producto.alt }],
    },
  }
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const producto = getProducto(slug)
  if (!producto) notFound()

  // Structured data para SEO (Product + Offer)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: producto.nombre,
    description: producto.descripcion,
    image: producto.imagenes.map((i) => i),
    material: producto.materiales,
    category: producto.categoria,
    brand: { "@type": "Brand", name: "Alma & Hilo" },
    offers: {
      "@type": "Offer",
      priceCurrency: "CRC",
      price: producto.precioDesde,
      availability: "https://schema.org/MadeToOrder",
      seller: { "@type": "Organization", name: "Alma & Hilo" },
    },
  }

  return (
    <main className="min-h-screen bg-[#F5F0E6]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BrandBar />
      <ProductDetail producto={producto} />
      <Footer />
    </main>
  )
}

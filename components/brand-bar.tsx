import Link from "next/link"
import Image from "next/image"
import { MessageCircle } from "lucide-react"
import { buildWhatsAppUrl, WHATSAPP_GENERAL_MESSAGE } from "@/lib/whatsapp"

// Barra superior para subpáginas (detalle de producto, configurador).
export function BrandBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#D9C9AE]/60 bg-[#F5F0E6]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-12">
        <Link href="/" aria-label="Alma & Hilo, inicio">
          <Image src="/logo-wordmark.png" alt="Alma & Hilo" width={725} height={227} priority className="h-9 w-auto md:h-10" />
        </Link>
        <a
          href={buildWhatsAppUrl(WHATSAPP_GENERAL_MESSAGE)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-[#2E4233] px-4 py-2 font-sans text-sm tracking-wide text-[#2E4233] transition-colors hover:bg-[#2E4233] hover:text-[#F5F0E6]"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Escribinos</span>
        </a>
      </div>
    </header>
  )
}

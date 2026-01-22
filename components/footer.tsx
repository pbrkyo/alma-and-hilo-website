import Link from "next/link"
import Image from "next/image"
import { Instagram, MessageCircle } from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="py-16 md:py-20 bg-[#F7F5F0] border-t border-[#D2C4B2]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-3 gap-12 md:gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <Image
              src="/images/logo-horizontal.png"
              alt="Alma & Hilo"
              width={180}
              height={120}
              className="h-10 w-auto object-contain mb-4"
            />
            <p className="text-[#5A7A6A] font-mono text-sm font-light leading-relaxed max-w-xs">
              Tejido con amor en Costa Rica. Cada puntada cuenta una historia de 
              tradición, dedicación y conexión familiar.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[#2F4F3E] font-mono text-sm tracking-wider uppercase mb-4">
              Navegación
            </h4>
            <nav className="space-y-3">
              <Link
                href="#historia"
                className="block text-[#5A7A6A] font-mono text-sm hover:text-[#2F4F3E] transition-colors duration-300"
              >
                Nuestra Historia
              </Link>
              <Link
                href="#coleccion"
                className="block text-[#5A7A6A] font-mono text-sm hover:text-[#2F4F3E] transition-colors duration-300"
              >
                Colección
              </Link>
              <Link
                href="#proceso"
                className="block text-[#5A7A6A] font-mono text-sm hover:text-[#2F4F3E] transition-colors duration-300"
              >
                Proceso
              </Link>
              <Link
                href="#contacto"
                className="block text-[#5A7A6A] font-mono text-sm hover:text-[#2F4F3E] transition-colors duration-300"
              >
                Contacto
              </Link>
            </nav>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-[#2F4F3E] font-mono text-sm tracking-wider uppercase mb-4">
              Conecta con nosotras
            </h4>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/almaayhilo"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#2F4F3E] flex items-center justify-center hover:bg-[#8FAE9A] transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5 text-[#F7F5F0]" />
              </a>
              <a
                href="https://wa.me/50612345678"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-[#2F4F3E] flex items-center justify-center hover:bg-[#8FAE9A] transition-colors duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5 text-[#F7F5F0]" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-[#D2C4B2] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#8FAE9A] font-mono text-xs">
            © {currentYear} Alma & Hilo. Todos los derechos reservados.
          </p>
          <p className="text-[#8FAE9A] font-mono text-xs">
            Hecho a mano con amor en Costa Rica
          </p>
        </div>
      </div>
    </footer>
  )
}

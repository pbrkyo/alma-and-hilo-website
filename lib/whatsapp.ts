export const WHATSAPP_PHONE = "50689721519"

export function buildWhatsAppUrl(text: string): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`
}

export function buildProductMessage(name: string, category: string): string {
  return `Hola! Me interesa "${name}" (${category}). ¿Me compartís precio, disponibilidad y tiempo de entrega? Si se puede, me gustaría verlo en otros colores/tallas.`
}

export const WHATSAPP_GENERAL_MESSAGE =
  "Hola! Vengo desde la web de Alma & Hilo. Quisiera hacer un pedido/consulta."

// Armado de mensajes de WhatsApp. WhatsApp es el checkout de Alma & Hilo:
// todos los caminos terminan en un wa.me con un mensaje pre-armado, natural
// y en español de Costa Rica.
import { formatColones, type Producto } from "@/lib/products"

export const WHATSAPP_PHONE = "50689721519"

export function buildWhatsAppUrl(text: string): string {
  return `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`
}

export const WHATSAPP_GENERAL_MESSAGE =
  "¡Hola! Vengo desde la web de Alma & Hilo. Quisiera hacer una consulta 🧶"

/** Mensaje simple desde una card (sin opciones elegidas todavía). */
export function buildProductMessage(nombre: string, categoria: string): string {
  return `¡Hola! Me encantó el ${nombre.toLowerCase()} (${categoria}) de la web. ¿Está disponible? ¿Me contás precio y tiempo de entrega? 🧶`
}

/**
 * Mensaje del detalle de producto con las opciones seleccionadas.
 * `selecciones` mapea id de opción -> valor elegido.
 */
export function buildProductPedido(
  producto: Producto,
  selecciones: Record<string, string>,
): string {
  const lineas = producto.opciones
    .map((op) => {
      const valor = selecciones[op.id]
      return valor ? `• ${op.label}: ${valor}` : null
    })
    .filter(Boolean)

  let msg = `¡Hola! Me encantó el ${producto.nombre} 🧶\n`
  if (lineas.length) {
    msg += `Lo quisiera así:\n${lineas.join("\n")}\n`
  }
  msg += `\n(desde ${formatColones(producto.precioDesde)}). ¿Está disponible? ¿Me confirmás precio final y tiempo de entrega?`
  return msg
}

export type PedidoCustom = {
  prenda?: string
  colores?: string
  detalles?: string
}

/** Mensaje del configurador "Hacé tu pieza". */
export function buildCustomPedido(pedido: PedidoCustom): string {
  const lineas = [
    pedido.prenda && `• Tipo de pieza: ${pedido.prenda}`,
    pedido.colores && `• Colores: ${pedido.colores}`,
    pedido.detalles && `• Detalles especiales: ${pedido.detalles}`,
  ].filter(Boolean)

  return (
    "¡Hola! Quiero crear una pieza personalizada con ustedes 🧶✨\n" +
    (lineas.length ? `\n${lineas.join("\n")}\n` : "") +
    "\n¿Me ayudan a hacerla realidad? Cuéntenme precio y tiempo de entrega."
  )
}

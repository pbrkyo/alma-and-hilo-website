// Catálogo de Alma & Hilo. Fuente única de verdad de los productos.
// Las fotos viven en /public/products (WebP, optimizadas por next/image).
// Precios en colones (CRC) como "desde" — el cliente confirma el precio final
// por WhatsApp (es hecho a mano y a medida). Ver DESIGN.md.

export type Categoria = "Tops" | "Bolsos" | "Accesorios" | "Decoración"

export type Hilo = { nombre: string; hex: string }

export type OpcionCustomizacion = {
  id: string
  /** Etiqueta visible, ej. "Color del hilo" */
  label: string
  tipo: "color" | "opcion"
  /** Para tipo "color" cada valor trae su hex; para "opcion" solo el nombre */
  valores: { valor: string; hex?: string }[]
  /** Texto de ayuda opcional bajo el selector */
  ayuda?: string
}

export type Producto = {
  slug: string
  nombre: string
  categoria: Categoria
  /** Frase corta para la card */
  gancho: string
  /** Descripción larga para el detalle */
  descripcion: string
  materiales: string
  /** Precio "desde" en colones */
  precioDesde: number
  /** Tiempo de elaboración, comunicado como valor */
  elaboracion: string
  /** Primera imagen = principal (fondo limpio). Rutas relativas a /public */
  imagenes: string[]
  /** Foto editorial (en escena) para el hover/móvil del catálogo */
  escena?: string
  /** Texto alt descriptivo de la imagen principal */
  alt: string
  opciones: OpcionCustomizacion[]
  /** Destacar en la portada del catálogo */
  destacado?: boolean
}

// Paleta de hilos reutilizable (familia de marca, ver DESIGN.md)
export const HILOS: Record<string, Hilo> = {
  crudo: { nombre: "Crudo", hex: "#E8DCC4" },
  arena: { nombre: "Arena", hex: "#D9C9AE" },
  oliva: { nombre: "Oliva", hex: "#7C8450" },
  bosque: { nombre: "Verde bosque", hex: "#2E4233" },
  cafe: { nombre: "Café", hex: "#6B4F3A" },
  negro: { nombre: "Negro", hex: "#2B2B2B" },
  terracota: { nombre: "Terracota", hex: "#B5623C" },
  miel: { nombre: "Miel", hex: "#C9962E" },
  rosa: { nombre: "Rosa viejo", hex: "#C98B9A" },
  blanco: { nombre: "Blanco", hex: "#F3EFE6" },
}

const hilosColor = (...keys: (keyof typeof HILOS)[]) => ({
  id: "color",
  label: "Color del hilo",
  tipo: "color" as const,
  valores: keys.map((k) => ({ valor: HILOS[k].nombre, hex: HILOS[k].hex })),
  ayuda: "¿Querés otro color? Escribinos y lo conseguimos.",
})

const tallasTop = {
  id: "talla",
  label: "Talla",
  tipo: "opcion" as const,
  valores: [{ valor: "XS–S" }, { valor: "M" }, { valor: "L" }, { valor: "A medida" }],
  ayuda: "Si elegís «a medida», coordinamos tus medidas por WhatsApp.",
}

export const CATEGORIAS: Categoria[] = ["Tops", "Bolsos", "Accesorios", "Decoración"]

export const PRODUCTOS: Producto[] = [
  {
    slug: "top-margarita",
    nombre: "Top Halter · Crudo",
    categoria: "Tops",
    gancho: "Halter de algodón con margaritas tejidas",
    descripcion:
      "Un halter de punto firme en algodón crudo, rematado con pequeñas margaritas a crochet en el escote y el ruedo. Liviano y fresco, pensado para el calor: se ata en la nuca y cae con caída suave.",
    materiales: "Algodón 100% natural, hilo fino",
    precioDesde: 24000,
    elaboracion: "Se teje para vos en 7 a 10 días",
    imagenes: ["/products/top-margarita.webp"],
    escena: "/products/top-margarita-escena.webp",
    alt: "Top halter de crochet en algodón crudo con margaritas tejidas",
    opciones: [tallasTop, hilosColor("crudo", "arena", "oliva", "rosa")],
    destacado: true,
  },
  {
    slug: "bralette-helecho",
    nombre: "Bralette · Oliva",
    categoria: "Tops",
    gancho: "Bralette oliva con festón blanco y borla",
    descripcion:
      "Bralette de punto acanalado en verde oliva con festón blanco a contraste y una borla al centro que se ajusta. Tirantes regulables y espalda con amarras. Una pieza coqueta para el verano, hecha a mano.",
    materiales: "Algodón peinado, detalle en hilo blanco",
    precioDesde: 22000,
    elaboracion: "Se teje para vos en 5 a 8 días",
    imagenes: ["/products/bralette-helecho.webp"],
    escena: "/products/bralette-helecho-escena.webp",
    alt: "Bralette de crochet oliva con festón blanco y borla",
    opciones: [tallasTop, hilosColor("oliva", "bosque", "arena", "negro")],
    destacado: true,
  },
  {
    slug: "top-jardin",
    nombre: "Top Granny · Negro",
    categoria: "Tops",
    gancho: "Granny squares con flores café, verde y arena",
    descripcion:
      "Top corto armado con cuadros granny, cada uno con una flor en el centro en tonos café, verde salvia y arena sobre fondo negro. Tirantes finos y ruedo con ondas. Una pieza statement, irrepetible.",
    materiales: "Algodón, paleta de tierra",
    precioDesde: 26000,
    elaboracion: "Se teje para vos en 10 a 14 días",
    imagenes: ["/products/top-jardin.webp"],
    escena: "/products/top-jardin-escena.webp",
    alt: "Top de crochet de cuadros granny con flores sobre fondo negro",
    opciones: [
      tallasTop,
      {
        id: "fondo",
        label: "Color de fondo",
        tipo: "color",
        valores: [
          { valor: "Negro", hex: HILOS.negro.hex },
          { valor: "Verde bosque", hex: HILOS.bosque.hex },
          { valor: "Crudo", hex: HILOS.crudo.hex },
        ],
      },
    ],
  },
  {
    slug: "top-brote",
    nombre: "Top Acanalado · Oliva",
    categoria: "Tops",
    gancho: "Crop sin mangas en punto acanalado",
    descripcion:
      "Crop top sin mangas en punto acanalado vertical, de cuello redondo. Sobrio y versátil, combina con todo. El acanalado le da estructura y se ajusta lindo al cuerpo.",
    materiales: "Mezcla de algodón, punto acanalado",
    precioDesde: 23000,
    elaboracion: "Se teje para vos en 7 a 10 días",
    imagenes: ["/products/top-brote.webp"],
    escena: "/products/top-brote-escena.webp",
    alt: "Crop top de crochet sin mangas en punto acanalado oliva",
    opciones: [tallasTop, hilosColor("oliva", "arena", "crudo", "terracota", "bosque")],
  },
  {
    slug: "blusa-espuma",
    nombre: "Blusa de Volados · Crudo",
    categoria: "Tops",
    gancho: "Crop crudo con mangas de volado",
    descripcion:
      "Blusa corta en punto calado color crudo, con mangas cortas de volado ondulado y ruedo a juego. Romántica y aireada, perfecta para un día de sol o sobre un vestido.",
    materiales: "Algodón natural, punto calado",
    precioDesde: 25000,
    elaboracion: "Se teje para vos en 8 a 12 días",
    imagenes: ["/products/blusa-espuma.webp"],
    escena: "/products/blusa-espuma-escena.webp",
    alt: "Blusa corta de crochet color crudo con mangas de volado",
    opciones: [tallasTop, hilosColor("crudo", "blanco", "arena", "oliva")],
  },
  {
    slug: "bolso-saco-olivo",
    nombre: "Bolso Saco · Oliva",
    categoria: "Bolsos",
    gancho: "Bolso saco de trapillo con pompones",
    descripcion:
      "Bolso tipo saco tejido en trapillo verde oliva, con cordón de ajuste rematado en pompones. Estructura firme y mucha capacidad: para el día a día o un paseo. Hecho con trapillo de algodón reciclado.",
    materiales: "Trapillo de algodón reciclado",
    precioDesde: 20000,
    elaboracion: "Se teje para vos en 5 a 8 días",
    imagenes: ["/products/bolso-saco.webp"],
    escena: "/products/bolso-saco-escena.webp",
    alt: "Bolso saco de trapillo verde oliva con cordón y pompones",
    opciones: [
      hilosColor("oliva", "arena", "terracota", "bosque", "crudo"),
      {
        id: "forro",
        label: "Forro de tela",
        tipo: "opcion",
        valores: [{ valor: "Con forro" }, { valor: "Sin forro" }],
        ayuda: "El forro le da más cuerpo y cuida lo que llevás dentro.",
      },
    ],
    destacado: true,
  },
  {
    slug: "bolso-negro",
    nombre: "Bolso Bandolera · Negro",
    categoria: "Bolsos",
    gancho: "Bandolera negra con hilo metálico y flecos",
    descripcion:
      "Bolso bandolera pequeño en trapillo negro, tejido con un hilo metálico plateado que destella, argollas, tapa con flecos y bandolera trenzada. Para salir de noche sin cargar de más.",
    materiales: "Trapillo negro con hilo metálico",
    precioDesde: 19000,
    elaboracion: "Se teje para vos en 5 a 8 días",
    imagenes: ["/products/bolso-negro.webp"],
    escena: "/products/bolso-negro-escena.webp",
    alt: "Bolso bandolera de crochet negro con hilo metálico y flecos",
    opciones: [
      {
        id: "metalico",
        label: "Detalle metálico",
        tipo: "color",
        valores: [
          { valor: "Plateado", hex: "#C7C9CC" },
          { valor: "Dorado", hex: "#C9962E" },
          { valor: "Sin metálico", hex: "#2B2B2B" },
        ],
      },
    ],
  },
  {
    slug: "cartera-nube",
    nombre: "Cartera de Trapillo · Crudo",
    categoria: "Bolsos",
    gancho: "Clutch de trapillo grueso con asa de mano",
    descripcion:
      "Cartera tipo nube tejida en trapillo grueso, mullida y con cuerpo, con asa de mano integrada. Un punto bien marcado que se siente suave y se ve elegante. Perfecta para llevar lo justo con mucho estilo, de día o de noche.",
    materiales: "Trapillo de algodón, punto grueso",
    precioDesde: 21000,
    elaboracion: "Se teje para vos en 6 a 9 días",
    imagenes: ["/products/cartera-nube.webp"],
    escena: "/products/cartera-nube-escena.webp",
    alt: "Cartera de trapillo grueso color crudo con asa de mano",
    opciones: [hilosColor("crudo", "arena", "negro", "oliva", "terracota")],
    destacado: true,
  },
  {
    slug: "bolso-mercado-terracota",
    nombre: "Bolso de Red · Café",
    categoria: "Bolsos",
    gancho: "Bolso de red estilo mercado",
    descripcion:
      "Bolso de red en punto calado color café, tipo bolsa de mercado, con asas largas para el hombro: liviano, se estira y guarda plano. Ideal para la feria, la playa o el día a día. Una alternativa linda y reusable a la bolsa plástica.",
    materiales: "Algodón, punto de red elástico",
    precioDesde: 24000,
    elaboracion: "Se teje para vos en 6 a 9 días",
    imagenes: ["/products/bolso-mercado.webp"],
    escena: "/products/bolso-mercado-escena.webp",
    alt: "Bolso de red de crochet color café estilo mercado",
    opciones: [hilosColor("cafe", "terracota", "arena", "oliva", "crudo")],
  },
  {
    slug: "bolso-luna",
    nombre: "Bolso de Mano · Trapillo",
    categoria: "Bolsos",
    gancho: "Clutch de trapillo en colores vivos",
    descripcion:
      "Clutch de trapillo de punto grueso con asa redonda, en colores que alegran: amarillo, rosa o jaspeado. Pequeño y con carácter, para llevar lo justo con mucho estilo.",
    materiales: "Trapillo de algodón, punto grueso",
    precioDesde: 17000,
    elaboracion: "Se teje para vos en 4 a 7 días",
    imagenes: [
      "/products/bolso-luna.webp",
      "/products/bolso-luna-lunar-escena.webp",
      "/products/bolso-luna-amarillo.webp",
      "/products/bolso-luna-amarillo-escena.webp",
      "/products/bolso-luna-rosa.webp",
      "/products/bolso-luna-rosa-escena.webp",
    ],
    escena: "/products/bolso-luna-escena.webp",
    alt: "Bolso de trapillo con asa redonda en jaspeado, amarillo y rosa",
    opciones: [
      {
        id: "color",
        label: "Color del hilo",
        tipo: "color",
        valores: [
          { valor: "Amarillo", hex: "#D8B43A" },
          { valor: "Rosa", hex: "#C98B9A" },
          { valor: "Jaspeado café", hex: "#8A6E55" },
          { valor: "Oliva", hex: HILOS.oliva.hex },
        ],
        ayuda: "¿Querés otro color? Escribinos y lo conseguimos.",
      },
    ],
  },
  {
    slug: "gorro-red",
    nombre: "Gorro de Red · Tierra",
    categoria: "Accesorios",
    gancho: "Gorro calado en tonos tierra",
    descripcion:
      "Gorro tejido en punto de red, calado y liviano, que se amolda a la cabeza. Un accesorio fresco para el clima de aquí, en tonos tierra: arena, café, crudo o negro. Cada uno se teje a mano puntada por puntada.",
    materiales: "Algodón, punto de red",
    precioDesde: 13000,
    elaboracion: "Se teje para vos en 3 a 5 días",
    imagenes: [
      "/products/gorro-red.webp",
      "/products/gorro-red-cafe.webp",
      "/products/gorro-red-crudo.webp",
      "/products/gorro-red-negro.webp",
    ],
    escena: "/products/gorro-red-escena.webp",
    alt: "Gorro de crochet en punto de red color arena",
    opciones: [
      {
        id: "talla",
        label: "Talla",
        tipo: "opcion",
        valores: [{ valor: "Niño" }, { valor: "Adulto" }],
      },
      hilosColor("arena", "crudo", "cafe", "negro", "terracota", "oliva"),
    ],
  },
  {
    slug: "gorro-rubi",
    nombre: "Gorro de Red · Rojo",
    categoria: "Accesorios",
    gancho: "El gorro de red, en rojo que enamora",
    descripcion:
      "El mismo gorro de red calado y liviano, ahora en un rojo rubí vibrante con destellos sutiles. Para quienes quieren un toque de color que se roba las miradas. Tejido a mano, puntada por puntada.",
    materiales: "Algodón con hilo brillante, punto de red",
    precioDesde: 13000,
    elaboracion: "Se teje para vos en 3 a 5 días",
    imagenes: ["/products/gorro-rubi.webp"],
    escena: "/products/gorro-rubi-escena.webp",
    alt: "Gorro de crochet en punto de red color rojo rubí",
    opciones: [
      {
        id: "talla",
        label: "Talla",
        tipo: "opcion",
        valores: [{ valor: "Niño" }, { valor: "Adulto" }],
      },
      hilosColor("terracota", "rosa", "miel", "negro"),
    ],
  },
  {
    slug: "canasta-flores",
    nombre: "Canasta de Flores",
    categoria: "Decoración",
    gancho: "Flores de crochet que no se marchitan",
    descripcion:
      "Una canastita tejida llena de flores de crochet que florecen para siempre. Un detalle hecho a mano para alegrar un escritorio, una repisa o regalar con cariño. Disponible en tres paletas: verdes, rosados o tonos cálidos.",
    materiales: "Algodón, relleno suave",
    precioDesde: 15000,
    elaboracion: "Se teje para vos en 5 a 8 días",
    imagenes: [
      "/products/flores-verde.webp",
      "/products/flores-rosa.webp",
      "/products/flores-tierra.webp",
    ],
    alt: "Canasta de crochet con flores tejidas en tonos verdes",
    opciones: [
      {
        id: "paleta",
        label: "Paleta de flores",
        tipo: "opcion",
        valores: [{ valor: "Verdes" }, { valor: "Rosados" }, { valor: "Cálidos" }],
        ayuda: "Cada paleta combina varios tonos. ¿Querés colores a medida? Escribinos.",
      },
    ],
    destacado: true,
  },
]

export function getProducto(slug: string): Producto | undefined {
  return PRODUCTOS.find((p) => p.slug === slug)
}

export function productosPorCategoria(categoria: Categoria | "Todos"): Producto[] {
  if (categoria === "Todos") return PRODUCTOS
  return PRODUCTOS.filter((p) => p.categoria === categoria)
}

/** Formatea un precio en colones: 24000 -> "₡24.000" */
export function formatColones(monto: number): string {
  return "₡" + monto.toLocaleString("es-CR")
}

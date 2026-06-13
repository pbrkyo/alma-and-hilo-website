// Procesa TODO el catálogo a WebP en public/products/ (borrón y cuenta nueva).
// products/catalog/* = foto limpia (fondo claro); products/* = foto editorial.
// Empareja por nombre. Uso: node scripts/process-catalog.mjs
import sharp from "sharp"
import { mkdir, readdir, unlink } from "node:fs/promises"

const OUT = "public/products"
await mkdir(OUT, { recursive: true })

// Limpiar webps viejos para dejar solo el set actual
for (const f of await readdir(OUT)) {
  if (f.endsWith(".webp")) await unlink(`${OUT}/${f}`)
}

// destino.webp <- origen
const MAP = {
  // Tops (limpia + escena)
  "top-margarita.webp": "products/catalog/top-beige.png",
  "top-margarita-escena.webp": "products/top-beige.jpeg",
  "bralette-helecho.webp": "products/catalog/top-verde.png",
  "bralette-helecho-escena.webp": "products/top-verde.png",
  "top-jardin.webp": "products/catalog/top-negro.png",
  "top-jardin-escena.webp": "products/top-negro.png",
  "top-brote.webp": "products/catalog/top-oliva.png",
  "top-brote-escena.webp": "products/top-oliva.jpeg",
  "blusa-espuma.webp": "products/catalog/blusa-blanca.png",
  "blusa-espuma-escena.webp": "products/blusa-blanca.jpeg",
  // Bolsos
  "bolso-saco.webp": "products/catalog/bolso-verde.png",
  "bolso-saco-escena.webp": "products/bolso-verde.jpeg",
  "bolso-mercado.webp": "products/catalog/bolso cafe.png",
  "bolso-mercado-escena.webp": "products/bolso-cafe.jpeg",
  "bolso-negro.webp": "products/catalog/bolso-negro.png",
  "bolso-negro-escena.webp": "products/bolso-negro.jpeg",
  "cartera-nube.webp": "products/catalog/cartera-beige.png",
  "cartera-nube-escena.webp": "products/cartera-beige.png",
  // Bolso Luna (3 colores) + escena editorial grupal
  "bolso-luna.webp": "products/catalog/duskbag-lunar.png",
  "bolso-luna-amarillo.webp": "products/catalog/duskbag-amarillo.png",
  "bolso-luna-rosa.webp": "products/catalog/duskbag-rosa.png",
  "bolso-luna-escena.webp": "products/duskbags.jpeg",
  // Gorros: dos colores con sus escenas editoriales
  "gorro-red.webp": "products/catalog/mesh-hat2.png",
  "gorro-red-negro.webp": "products/catalog/mesh-hat1.png",
  "gorro-red-cafe.webp": "products/catalog/mesh-hat4.png",
  "gorro-red-crudo.webp": "products/catalog/mesh-hat6.png",
  "gorro-red-escena.webp": "products/mesh-hats.jpeg",
  "gorro-rubi.webp": "products/catalog/mesh-hat5.png",
  "gorro-rubi-escena.webp": "products/mesh-hats2.jpeg",
  // Flores (3 paletas)
  "flores-verde.webp": "products/catalog/flores1.png",
  "flores-rosa.webp": "products/catalog/flores2.png",
  "flores-tierra.webp": "products/catalog/flores3.png",
}

let n = 0
for (const [dest, src] of Object.entries(MAP)) {
  const { size } = await sharp(src)
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(`${OUT}/${dest}`)
  console.log(`${dest}  (${(size / 1024).toFixed(0)} KB)`)
  n++
}
console.log(`\n${n} imágenes procesadas (set completo).`)

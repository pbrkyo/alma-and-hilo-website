// Procesa las imágenes nuevas del catálogo (products/catalog + products/ raíz)
// a WebP optimizado en public/products/, con nombres limpios por producto.
// Uso: node scripts/process-catalog.mjs
import sharp from "sharp"
import { mkdir } from "node:fs/promises"

const OUT = "public/products"
await mkdir(OUT, { recursive: true })

// origen -> nombre webp destino
const MAP = {
  "products/catalog/top-beige.png": "top-margarita.webp",
  "products/catalog/top-verdeblanco.png": "bralette-helecho.webp",
  "products/catalog/top-negro.png": "top-jardin.webp",
  "products/catalog/top-oliva.png": "top-brote.webp",
  "products/catalog/blusa-blanca.png": "blusa-espuma.webp",
  "products/catalog/bolso-verde.png": "bolso-saco.webp",
  "products/catalog/bolso cafe.png": "bolso-mercado.webp",
  "products/catalog/beige-handbag.png": "cartera-nube.webp",
  "products/bolsogris.jpeg": "cartera-nube-gris.webp",
  "products/lunar-duskbag.png": "bolso-luna.webp",
  "products/lunar-duskbag-outside.png": "bolso-luna-lifestyle.webp",
  "products/yellow-duskbag.png": "bolso-luna-amarillo.webp",
  "products/pink-duskbag.png": "bolso-luna-rosa.webp",
  "products/catalog/mesh-hat2.png": "gorro-red.webp",
  "products/catalog/mesh-hat4.png": "gorro-red-cafe.webp",
  "products/catalog/mesh-hat6.png": "gorro-red-crudo.webp",
  "products/catalog/mesh-hat1.png": "gorro-red-negro.webp",
}

for (const [src, dest] of Object.entries(MAP)) {
  const { size } = await sharp(src)
    .resize({ width: 1400, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(`${OUT}/${dest}`)
  console.log(`${src} -> ${dest} (${(size / 1024).toFixed(0)} KB)`)
}
console.log(`\n${Object.keys(MAP).length} imágenes procesadas.`)

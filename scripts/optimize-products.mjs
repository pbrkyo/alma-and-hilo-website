// Convierte los JPEG originales de products/ a WebP optimizado en public/products/.
// Uso: node scripts/optimize-products.mjs
import sharp from "sharp"
import { readdir, mkdir } from "node:fs/promises"
import path from "node:path"

const SRC = "products"
const OUT = "public/products"
const MAX_WIDTH = 1600 // master; next/image genera los tamaños menores

await mkdir(OUT, { recursive: true })
const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f))

for (const file of files) {
  const name = path.parse(file).name
  const out = path.join(OUT, `${name}.webp`)
  const { size } = await sharp(path.join(SRC, file))
    .resize({ width: MAX_WIDTH, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(out)
  console.log(`${file} -> ${out} (${(size / 1024).toFixed(0)} KB)`)
}
console.log(`\n${files.length} imágenes optimizadas.`)

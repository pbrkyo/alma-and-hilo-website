// Convierte las texturas PNG generadas a WebP 512px y borra los PNG.
import sharp from "sharp"
import { unlink } from "node:fs/promises"

for (const n of ["tejido-crudo", "hilo-fibra"]) {
  const out = `public/textures/${n}.webp`
  const info = await sharp(`public/textures/${n}.png`).resize(512, 512).webp({ quality: 80 }).toFile(out)
  await unlink(`public/textures/${n}.png`)
  console.log(`${out} ${Math.round(info.size / 1024)}KB`)
}

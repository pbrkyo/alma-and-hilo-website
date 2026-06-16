// Genera 6 imágenes editoriales para la grilla de Instagram, partiendo de las
// piezas LIMPIAS del catálogo (image-to-image): cada pieza se recoloca en una
// escena lifestyle nueva, manteniendo el producto idéntico al de referencia.
// Uso: GEMINI_API_KEY=... node scripts/generate-instagram.mjs
import { readFile, writeFile, mkdir } from "node:fs/promises"
import sharp from "sharp"

const KEY = process.env.GEMINI_API_KEY
if (!KEY) {
  console.error("Falta GEMINI_API_KEY")
  process.exit(1)
}
const MODEL = "gemini-2.5-flash-image"
const OUT = "public/instagram"
await mkdir(OUT, { recursive: true })

// Estilo común — paleta de la marca, look editorial de IG, formato cuadrado
const STYLE =
  "Editorial Instagram lifestyle photograph, square 1:1 composition, soft warm natural window light, " +
  "muted artisanal palette of ecru #F5F0E6, sage and olive green, warm wood and linen, calm handmade mood, " +
  "shallow depth of field, no people, no faces, no text or logos. Keep the crocheted product EXACTLY as in " +
  "the reference image (same colors, stitch pattern and shape); only restyle the surrounding scene."

// Cada entrada: referencia limpia del catálogo + descripción de la escena nueva
const items = [
  {
    name: "ig-top-oliva",
    ref: "products/catalog/top-oliva.png",
    scene:
      "An olive-green ribbed crochet crop top laid flat on a marble surface, styled with delicate gold " +
      "hoop earrings, a sprig of eucalyptus and a folded linen garment beside it, flat-lay from above.",
  },
  {
    name: "ig-bolso-verde",
    ref: "products/catalog/bolso-verde.png",
    scene:
      "An olive-green crochet drawstring bag resting on a rustic wooden table next to a small ceramic dish, " +
      "a fountain pen and dried lavender, in a sunlit artisan studio.",
  },
  {
    name: "ig-mesh-hat",
    ref: "products/catalog/mesh-hat1.png",
    scene:
      "A crochet mesh summer hat placed on a brass hat stand on a linen runner, with smooth river stones and " +
      "a sprig of dried wheat nearby, soft minimal still life.",
  },
  {
    name: "ig-cartera-beige",
    ref: "products/catalog/cartera-beige.png",
    scene:
      "A chunky beige crochet clutch bag held in soft focus on a warm stone ledge outdoors, blurred " +
      "Mediterranean garden of olive trees and terracotta pots in golden-hour light behind it.",
  },
  {
    name: "ig-blusa-blanca",
    ref: "products/catalog/blusa-blanca.png",
    scene:
      "A cream crochet ruffle-sleeve blouse on a natural linen dress form, beside a stack of art books, " +
      "pampas grass in a stoneware vase and a marble countertop, warm editorial interior.",
  },
  {
    name: "ig-flores",
    ref: "products/catalog/flores1.png",
    scene:
      "Small handmade crochet flowers arranged on a cream ceramic plate on a linen cloth, with a wooden " +
      "crochet hook and a ball of cotton yarn beside them, soft overhead still life.",
  },
]

async function refPart(path) {
  const buf = await readFile(path)
  const ext = path.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg"
  return { inlineData: { mimeType: ext, data: buf.toString("base64") } }
}

for (const it of items) {
  console.log(`Generando ${it.name} (ref ${it.ref})...`)
  let ok = false
  for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
          body: JSON.stringify({
            contents: [{ parts: [await refPart(it.ref), { text: `${it.scene} ${STYLE}` }] }],
          }),
        },
      )
      if (!res.ok) {
        const t = await res.text()
        console.error(`  intento ${attempt} error ${res.status}: ${t.slice(0, 200)}`)
        await new Promise((r) => setTimeout(r, 4000))
        continue
      }
      const data = await res.json()
      const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)
      if (!part) {
        console.error(`  intento ${attempt} sin imagen:`, JSON.stringify(data).slice(0, 160))
        await new Promise((r) => setTimeout(r, 4000))
        continue
      }
      const buf = Buffer.from(part.inlineData.data, "base64")
      await sharp(buf)
        .resize(1080, 1080, { fit: "cover", position: "centre" })
        .webp({ quality: 82 })
        .toFile(`${OUT}/${it.name}.webp`)
      console.log(`  OK -> ${OUT}/${it.name}.webp`)
      ok = true
    } catch (e) {
      console.error(`  intento ${attempt} excepción: ${e.message}`)
      await new Promise((r) => setTimeout(r, 4000))
    }
  }
  if (!ok) console.error(`  FALLÓ ${it.name}`)
}
console.log("listo")

// Genera swatches de los tipos de puntada para el configurador "Hacé tu pieza".
// Mismo color (sage/oliva) en todos para que se comparen entre sí.
// Uso: GEMINI_API_KEY=... node scripts/generate-stitches.mjs
import { writeFile, mkdir } from "node:fs/promises"

const KEY = process.env.GEMINI_API_KEY
if (!KEY) {
  console.error("Falta GEMINI_API_KEY")
  process.exit(1)
}

const MODEL = "gemini-2.5-flash-image"
const OUT = "public/stitches"
const COLOR = "sage green olive (#7C8450) cotton yarn"

const prompts = {
  calado:
    `Top-down macro photograph of a crochet swatch in open lacy mesh stitch (punto calado), made of ${COLOR}, ` +
    "airy net pattern with visible holes, on a flat plain cream #F5F0E6 background, soft even studio light, " +
    "square composition, the swatch fills the frame, no hands, no objects.",
  firme:
    `Top-down macro photograph of a crochet swatch in tight solid single-crochet stitch (punto firme), made of ${COLOR}, ` +
    "dense even rows with no holes, on a flat plain cream #F5F0E6 background, soft even studio light, " +
    "square composition, the swatch fills the frame, no hands, no objects.",
  trapillo:
    "Top-down macro photograph of a crochet swatch made of thick chunky t-shirt yarn (trapillo) in sage green olive, " +
    "very thick visible chunky stitches, on a flat plain cream #F5F0E6 background, soft even studio light, " +
    "square composition, the swatch fills the frame, no hands, no objects.",
  granny:
    "Top-down macro photograph of crochet granny squares, each square with a flower motif, in sage green olive with " +
    "cream and soft brown centers, joined together, on a flat plain cream #F5F0E6 background, soft even studio light, " +
    "square composition, fills the frame, no hands, no objects.",
  acanalado:
    `Top-down macro photograph of a crochet swatch in raised vertical ribbed stitch (punto acanalado), made of ${COLOR}, ` +
    "clear vertical ribs and texture, on a flat plain cream #F5F0E6 background, soft even studio light, " +
    "square composition, the swatch fills the frame, no hands, no objects.",
}

await mkdir(OUT, { recursive: true })

for (const [name, prompt] of Object.entries(prompts)) {
  console.log(`Generando ${name}...`)
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
    },
  )
  if (!res.ok) {
    console.error(`  Error ${res.status}: ${(await res.text()).slice(0, 300)}`)
    continue
  }
  const data = await res.json()
  const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)
  if (!part) {
    console.error("  Sin imagen:", JSON.stringify(data).slice(0, 200))
    continue
  }
  await writeFile(`${OUT}/${name}.png`, Buffer.from(part.inlineData.data, "base64"))
  console.log(`  OK -> ${OUT}/${name}.png`)
}

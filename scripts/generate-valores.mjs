// Genera imágenes que representan los valores de la marca para la sección
// "Tejido a mano, con intención" (manos tejiendo, hilos naturales).
// Uso: GEMINI_API_KEY=... node scripts/generate-valores.mjs
import { writeFile, mkdir } from "node:fs/promises"
import sharp from "sharp"

const KEY = process.env.GEMINI_API_KEY
if (!KEY) {
  console.error("Falta GEMINI_API_KEY")
  process.exit(1)
}
const MODEL = "gemini-2.5-flash-image"
const OUT = "public/valores"
await mkdir(OUT, { recursive: true })

const STYLE =
  "Editorial lifestyle photography, soft warm window light, muted natural palette of ecru #F5F0E6, " +
  "sage green #7C8450 and warm wood, calm artisanal mood, shallow depth of field, 4:3 landscape."

const prompts = {
  "manos-tejiendo":
    "Close-up of the hands of a brown-skinned woman crocheting with sage green and cream cotton yarn, " +
    "holding a wooden crochet hook mid-stitch. No face, only hands and the crochet work. " + STYLE,
  "hilos-naturales":
    "Still life of natural cotton yarn balls in sage green, cream and soft terracotta arranged on a linen " +
    "cloth, with a wooden crochet hook and a half-finished crochet piece beside them. No people. " + STYLE,
}

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
  const buf = Buffer.from(part.inlineData.data, "base64")
  await sharp(buf).resize({ width: 1400 }).webp({ quality: 80 }).toFile(`${OUT}/${name}.webp`)
  console.log(`  OK -> ${OUT}/${name}.webp`)
}

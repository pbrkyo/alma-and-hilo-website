// Assets del hero "la mesa de la artesana", generados con Gemini.
// Estilo derivado de las fotos editoriales de products/: luz cálida de ventana,
// lino, madera clara, paleta crudo/oliva/verde alma/arena/miel.
// Uso: GEMINI_API_KEY=... node scripts/generate-hero-assets.mjs
import { writeFile, mkdir } from "node:fs/promises"

const KEY = process.env.GEMINI_API_KEY
if (!KEY) {
  console.error("Falta GEMINI_API_KEY")
  process.exit(1)
}

const MODEL = "gemini-2.5-flash-image"
const OUT = "public/hero"

const STYLE =
  "Editorial product photography style, soft warm window light from the left, " +
  "muted natural palette: ecru #F5F0E6, sand #D9C9AE, olive green #7C8450, deep forest green #2E4233, honey #B8862B. " +
  "Clean, minimal, high-end handmade brand aesthetic."

const prompts = {
  // Fondo ambiental de pantalla completa, muy sutil
  "ambiente-lino": `Top-down photograph of a smooth ecru linen tablecloth surface (#F5F0E6 tones), very subtle fabric weave, soft warm light gradient from upper left corner, gentle shadows, almost uniform, low contrast, no objects. ${STYLE} Wide 16:9 composition.`,

  // Guirnalda esquina superior izquierda
  "guirnalda-sup": `Corner arrangement of handmade crochet flowers and leaves (olive green #7C8450, deep green #2E4233, sand #D9C9AE and cream yarn), with a thin strand of olive yarn connecting them, photographed top-down on a perfectly flat solid ecru background #F5F0E6. The arrangement hugs the TOP-LEFT corner of the frame in an L shape, the rest of the image is empty flat #F5F0E6. No shadows except tiny soft contact shadows. ${STYLE}`,

  // Esquina inferior derecha: ovillo + gancho
  "guirnalda-inf": `A small ball of olive green t-shirt yarn (trapillo) with a wooden crochet hook resting on it and two small crochet flowers in cream and honey yellow yarn, photographed top-down on a perfectly flat solid ecru background #F5F0E6, arranged in the BOTTOM-RIGHT corner of the frame, rest of image empty flat #F5F0E6. Tiny soft contact shadows only. ${STYLE}`,

  // Flor pequeña para marcar las puntadas de La Hebra
  "flor-hebra": `One single small handmade crochet flower, olive green yarn petals with cream center, photographed perfectly top-down, centered on a flat solid ecru background #F5F0E6, tiny soft contact shadow. Square composition, the flower fills 70% of the frame. ${STYLE}`,
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
    console.error(`  Error ${res.status}: ${(await res.text()).slice(0, 400)}`)
    continue
  }
  const data = await res.json()
  const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)
  if (!part) {
    console.error("  Sin imagen:", JSON.stringify(data).slice(0, 300))
    continue
  }
  await writeFile(`${OUT}/${name}.png`, Buffer.from(part.inlineData.data, "base64"))
  console.log(`  OK -> ${OUT}/${name}.png`)
}

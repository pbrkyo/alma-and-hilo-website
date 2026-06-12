// Genera texturas de marca con la API de Gemini (imagen).
// La key NO vive en el repo: exportá GEMINI_API_KEY antes de correr.
// Uso: GEMINI_API_KEY=... node scripts/generate-textures.mjs
import { writeFile, mkdir } from "node:fs/promises"

const KEY = process.env.GEMINI_API_KEY
if (!KEY) {
  console.error("Falta GEMINI_API_KEY")
  process.exit(1)
}

const MODEL = "gemini-2.5-flash-image"
const OUT = "public/textures"

const prompts = {
  "tejido-crudo": [
    "Seamless tileable texture of handmade crochet fabric, knitted with thick ecru raw cotton yarn",
    "(color #F5F0E6 with #D9C9AE shadows). Top-down macro photograph, even soft warm lighting,",
    "visible chain stitches in neat rows, subtle natural fiber detail. No objects, no hands,",
    "no border, edge-to-edge repeating pattern, flat and uniform.",
  ].join(" "),
  "hilo-fibra": [
    "Seamless tileable close-up texture of a single strand of twisted cotton t-shirt yarn (trapillo),",
    "olive green color (#7C8450), showing the diagonal twist of the fibers. Macro photography,",
    "soft even light, edge-to-edge repeating pattern, no background objects, flat.",
  ].join(" "),
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
    console.error(`  Error ${res.status}: ${(await res.text()).slice(0, 500)}`)
    continue
  }
  const data = await res.json()
  const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)
  if (!part) {
    console.error("  Sin imagen en la respuesta:", JSON.stringify(data).slice(0, 300))
    continue
  }
  await writeFile(`${OUT}/${name}.png`, Buffer.from(part.inlineData.data, "base64"))
  console.log(`  OK -> ${OUT}/${name}.png`)
}

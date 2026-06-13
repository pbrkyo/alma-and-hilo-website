// Regenera el hero "estudio vacío con plantas" (el preferido por el cliente),
// MISMO concepto que el video original (commit fc7c672) pero en 1080p y con
// más detalle. Sin referenceImages (para poder usar negativePrompt).
// Uso: GEMINI_API_KEY=... node scripts/generate-hero-empty-hd.mjs
import { writeFile, mkdir } from "node:fs/promises"

const KEY = process.env.GEMINI_API_KEY
if (!KEY) {
  console.error("Falta GEMINI_API_KEY")
  process.exit(1)
}

const BASE = "https://generativelanguage.googleapis.com/v1beta"
const MODEL = "veo-3.1-generate-preview"

// Prompt original del video preferido (fc7c672) + lenguaje de alta calidad.
const PROMPT =
  "Ultra high quality, photorealistic, razor-sharp 4K detail, cinematic interior film look. " +
  "Cinematic drone-glide camera moving forward through a beautiful, completely empty artisanal crochet " +
  "studio in Cartago, Costa Rica — the space is unoccupied, no people anywhere in the entire video. " +
  "Beige and sage green color palette, tastefully decorated: handmade crochet pieces (bags, tops, hats) " +
  "displayed on wooden shelves and hanging racks, lush green potted plants (monstera, ferns, pothos), " +
  "warm soft window light. The camera glides in through the entrance, passes close to a wooden work table " +
  "with crochet tools laid out — wooden crochet hooks, sage and beige yarn balls, scissors, measuring tape — " +
  "and then pulls back to end in a steady, perfectly composed wide shot of the empty studio, " +
  "usable as a website hero background. Editorial interior cinematography, smooth gimbal movement, " +
  "rich detail, crisp focus, beautiful natural light. " +
  "No people, no hands, no faces, no text, no captions, no watermark."

const NEGATIVE_PROMPT =
  "person, woman, man, people, human, hands, face, human figure, silhouette, mannequin with face, text, watermark"

async function start() {
  const res = await fetch(`${BASE}/models/${MODEL}:predictLongRunning`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
    body: JSON.stringify({
      instances: [{ prompt: PROMPT }],
      parameters: { aspectRatio: "16:9", resolution: "1080p", negativePrompt: NEGATIVE_PROMPT },
    }),
  })
  const body = await res.text()
  if (!res.ok) throw new Error(`${res.status} ${body.slice(0, 300)}`)
  return JSON.parse(body).name
}

console.log(`Generando en 1080p (${MODEL})...`)
const opName = await start()
console.log(`Operación: ${opName}`)

let result = null
for (let i = 0; i < 96; i++) {
  await new Promise((r) => setTimeout(r, 5000))
  const res = await fetch(`${BASE}/${opName}`, { headers: { "x-goog-api-key": KEY } })
  const op = await res.json()
  if (op.error) {
    console.error("Error:", JSON.stringify(op.error).slice(0, 400))
    process.exit(1)
  }
  if (op.done) {
    result = op.response
    break
  }
  if (i % 6 === 0) console.log(`  ...generando (${(i * 5) / 60} min)`)
}
if (!result) {
  console.error("Timeout")
  process.exit(1)
}

const sample = result.generateVideoResponse?.generatedSamples?.[0] ?? result.generatedVideos?.[0]
const uri = sample?.video?.uri ?? sample?.video?.videoUri
if (!uri) {
  console.error("Sin video:", JSON.stringify(result).slice(0, 500))
  process.exit(1)
}
console.log("Descargando...")
const dl = await fetch(uri, { headers: { "x-goog-api-key": KEY }, redirect: "follow" })
if (!dl.ok) {
  console.error(`Descarga falló: ${dl.status}`)
  process.exit(1)
}
await mkdir("assets-raw", { recursive: true })
const buf = Buffer.from(await dl.arrayBuffer())
await writeFile("assets-raw/studio-empty-hd-raw.mp4", buf)
console.log(`OK -> assets-raw/studio-empty-hd-raw.mp4 (${(buf.length / 1024 / 1024).toFixed(1)}MB)`)

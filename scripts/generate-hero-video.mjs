// Genera el video del hero con Veo (API de Gemini): recorrido entrando al
// taller de crochet en Cartago. Prompt definido por el cliente.
// Uso: GEMINI_API_KEY=... node scripts/generate-hero-video.mjs
import { writeFile, mkdir } from "node:fs/promises"

const KEY = process.env.GEMINI_API_KEY
if (!KEY) {
  console.error("Falta GEMINI_API_KEY")
  process.exit(1)
}

const BASE = "https://generativelanguage.googleapis.com/v1beta"
const MODELS = ["veo-3.1-generate-preview", "veo-3.0-generate-001", "veo-3.0-fast-generate-001"]

const PROMPT =
  "super stylish video going inside a beautiful artisanal crochet studio based in Cartago Costa Rica, " +
  "with beige and sage colors influencing the scene, tastefully decorated, smooth drone-like camera glide " +
  "moving forward through the entrance, focusing on different handmade crochet pieces (bags, tops, hats), " +
  "1 shot focusing on the crochet tools, dont show the face of the brown skin woman only the hands no face, " +
  "warm soft window light, editorial cinematography, the video has to end in a steady wide shot of the studio " +
  "that can be used as a hero section in a website. No text, no captions, no watermark."

async function startOperation(model) {
  const res = await fetch(`${BASE}/models/${model}:predictLongRunning`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
    body: JSON.stringify({
      instances: [{ prompt: PROMPT }],
      parameters: { aspectRatio: "16:9" },
    }),
  })
  const body = await res.text()
  if (!res.ok) {
    console.error(`  ${model}: ${res.status} ${body.slice(0, 300)}`)
    return null
  }
  return JSON.parse(body).name
}

let opName = null
let usedModel = null
for (const model of MODELS) {
  console.log(`Intentando ${model}...`)
  opName = await startOperation(model)
  if (opName) {
    usedModel = model
    break
  }
}
if (!opName) {
  console.error("Ningún modelo Veo disponible con esta key")
  process.exit(1)
}
console.log(`Operación iniciada (${usedModel}): ${opName}`)

// Poll hasta que termine (máx ~8 min)
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
  console.error("Timeout esperando el video")
  process.exit(1)
}

const sample =
  result.generateVideoResponse?.generatedSamples?.[0] ?? result.generatedVideos?.[0] ?? null
const uri = sample?.video?.uri ?? sample?.video?.videoUri
if (!uri) {
  console.error("Respuesta sin video:", JSON.stringify(result).slice(0, 600))
  process.exit(1)
}
console.log("Descargando video...")
const dl = await fetch(uri, { headers: { "x-goog-api-key": KEY }, redirect: "follow" })
if (!dl.ok) {
  console.error(`Descarga falló: ${dl.status}`)
  process.exit(1)
}
await mkdir("assets-raw", { recursive: true })
const buf = Buffer.from(await dl.arrayBuffer())
await writeFile("assets-raw/studio-tour-raw.mp4", buf)
console.log(`OK -> assets-raw/studio-tour-raw.mp4 (${(buf.length / 1024 / 1024).toFixed(1)}MB)`)

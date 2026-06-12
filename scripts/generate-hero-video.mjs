// Genera el video del hero con Veo 3.1 (API de Gemini): recorrido por el
// taller de crochet en Cartago, VACÍO (sin personas), usando fotos reales
// de producto como reference images para que las piezas del video sean las
// de la marca. Uso: GEMINI_API_KEY=... node scripts/generate-hero-video.mjs
import { writeFile, mkdir } from "node:fs/promises"
import sharp from "sharp"

const KEY = process.env.GEMINI_API_KEY
if (!KEY) {
  console.error("Falta GEMINI_API_KEY")
  process.exit(1)
}

const BASE = "https://generativelanguage.googleapis.com/v1beta"
// Solo Veo 3.1: es el único que soporta referenceImages (y con referencias
// no se permite negativePrompt — el "sin personas" va en el prompt)
const MODELS = ["veo-3.1-generate-preview"]

// Fotos reales de producto (máx 3 referencias en Veo 3.1)
const REFERENCE_PHOTOS = [
  "products/green_shoulder_bag.jpeg",
  "products/beige_top.jpeg",
  "products/black_white_brown_sand_mesh_hats.jpeg",
]

const PROMPT =
  "Cinematic drone-glide camera moving forward through a beautiful, completely empty artisanal crochet " +
  "studio in Cartago, Costa Rica — the space is unoccupied, no people anywhere in the entire video. " +
  "The studio displays the exact handmade crochet pieces from the reference images: the sage green " +
  "drawstring bag with pompom cords, the beige halter crochet top with small flowers, and the open-mesh " +
  "crochet hats in black, white, brown and sand — placed naturally on wooden shelves, hanging racks and stands. " +
  "Beige and sage green color palette, tastefully decorated with lush green potted plants (monstera, ferns, " +
  "pothos), warm soft window light. The camera glides in through the entrance, passes close to a wooden work " +
  "table with crochet tools laid out — wooden crochet hooks, sage and beige yarn balls, scissors, measuring " +
  "tape — and then pulls back to end in a steady, perfectly composed wide shot of the empty studio, " +
  "usable as a website hero background. Editorial interior cinematography, smooth gimbal movement. " +
  "The studio is completely unoccupied from the first frame to the last: no people, no person, no woman, " +
  "no man, no hands, no faces, no silhouettes, no human figures of any kind. No text, no captions, no watermark."

// Reducir las fotos para el payload (1024px JPEG)
const referenceImages = []
for (const file of REFERENCE_PHOTOS) {
  const buf = await sharp(file).resize({ width: 1024 }).jpeg({ quality: 85 }).toBuffer()
  referenceImages.push({
    image: { bytesBase64Encoded: buf.toString("base64"), mimeType: "image/jpeg" },
    referenceType: "asset",
  })
  console.log(`Referencia: ${file} (${Math.round(buf.length / 1024)}KB)`)
}

async function startOperation(model) {
  const res = await fetch(`${BASE}/models/${model}:predictLongRunning`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
    body: JSON.stringify({
      instances: [{ prompt: PROMPT, referenceImages }],
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

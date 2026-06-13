// Genera el hero con Veo 3.1 image-to-video: usa el PRIMER FRAME exacto del
// video preferido como semilla, para obtener una versión nueva en 1080p nativo
// que arranca idéntica y sigue el mismo recorrido del taller vacío con plantas.
// Uso: GEMINI_API_KEY=... node scripts/generate-hero-i2v.mjs <init.png>
import { writeFile, mkdir, readFile } from "node:fs/promises"
import sharp from "sharp"

const KEY = process.env.GEMINI_API_KEY
if (!KEY) {
  console.error("Falta GEMINI_API_KEY")
  process.exit(1)
}

const BASE = "https://generativelanguage.googleapis.com/v1beta"
const MODEL = "veo-3.1-generate-preview"
const INIT = process.argv[2] ?? "assets-raw/init-frame.png"

// Mismo prompt del video preferido (fc7c672) + lenguaje de alta calidad.
const PROMPT =
  "Ultra high quality, photorealistic, razor-sharp 4K detail, cinematic interior film look. " +
  "Continue this exact scene: a smooth cinematic drone-glide camera moving slowly forward through a " +
  "beautiful, completely empty artisanal crochet studio in Cartago, Costa Rica — the space is unoccupied, " +
  "no people anywhere in the entire video. Beige and sage green color palette, tastefully decorated: " +
  "handmade crochet pieces (bags, tops, hats) displayed on wooden shelves and hanging racks, lush green " +
  "potted plants (monstera, ferns, pothos), warm soft window light. The camera glides forward, passes close " +
  "to a wooden work table with crochet tools laid out — wooden crochet hooks, sage and beige yarn balls, " +
  "scissors, measuring tape — and then pulls back to end in a steady, perfectly composed wide shot of the " +
  "empty studio, usable as a website hero background. Editorial interior cinematography, smooth gimbal " +
  "movement, rich detail, crisp focus. No people, no hands, no faces, no text, no captions, no watermark."

// Semilla: el primer frame exacto, en 1080p JPEG de alta calidad
const initBuf = await sharp(await readFile(INIT))
  .resize({ width: 1920, height: 1080, fit: "cover" })
  .jpeg({ quality: 95 })
  .toBuffer()
console.log(`Semilla: ${INIT} -> ${Math.round(initBuf.length / 1024)}KB`)

async function start() {
  const res = await fetch(`${BASE}/models/${MODEL}:predictLongRunning`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
    body: JSON.stringify({
      instances: [
        {
          prompt: PROMPT,
          image: { bytesBase64Encoded: initBuf.toString("base64"), mimeType: "image/jpeg" },
        },
      ],
      parameters: { aspectRatio: "16:9", resolution: "1080p" },
    }),
  })
  const body = await res.text()
  if (!res.ok) throw new Error(`${res.status} ${body.slice(0, 400)}`)
  return JSON.parse(body).name
}

console.log(`Generando image-to-video en 1080p (${MODEL})...`)
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
await writeFile("assets-raw/studio-i2v-raw.mp4", buf)
console.log(`OK -> assets-raw/studio-i2v-raw.mp4 (${(buf.length / 1024 / 1024).toFixed(1)}MB)`)

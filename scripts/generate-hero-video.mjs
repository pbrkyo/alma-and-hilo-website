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

// Fotos reales de producto como referencia (máx 3 en Veo 3.1). Elegidas
// por cobertura de categoría y fidelidad a la paleta: bolso, top y gorros.
// El resto del catálogo se describe con precisión en el prompt.
const REFERENCE_PHOTOS = [
  "products/green_shoulder_bag.jpeg",
  "products/beige_top.jpeg",
  "products/black_white_brown_sand_mesh_hats.jpeg",
]

const PROMPT = [
  // Calidad y cámara
  "Ultra high quality, photorealistic, razor-sharp 4K detail, cinematic interior film look.",
  "A single smooth gimbal drone-glide shot moving slowly forward through the front door and into a beautiful,",
  "completely empty artisanal crochet studio in Cartago, Costa Rica. No people, ever.",
  // Atmósfera y paleta
  "Warm soft natural window light, calm and inviting. Strict color palette of beige, ecru, cream, sage green,",
  "olive and warm terracotta accents, on whitewashed walls with natural oak wood furniture and a tile floor.",
  "Tastefully decorated with lush green potted plants — large monstera, trailing pothos and ferns — on the floor,",
  "on shelves and hanging in macrame holders.",
  // Productos reales (referencias + catálogo descrito con precisión)
  "The studio displays a rich collection of handmade crochet pieces, exactly in the brand's style:",
  "— a sage green crochet drawstring pouch bag with pompom cord ties (from the reference image),",
  "— a beige halter crochet top decorated with small crochet daisies at the neckline (from the reference image),",
  "— open-mesh crochet bucket hats in black, brown, sand and cream displayed on wooden head stands (from the reference image),",
  "— a cream ivory crochet crop blouse with delicate ruffled cap sleeves on a linen dress form,",
  "— an olive green ribbed sleeveless crop top on another bust stand,",
  "— a black granny-square crochet bralette with small flower motifs in brown, sage and sand,",
  "— a terracotta open-mesh market tote bag hanging on a hook,",
  "— a small black crossbody crochet bag with subtle silver metallic thread and fringe,",
  "— assorted balls of sage, ecru and terracotta yarn in woven baskets.",
  "Everything arranged naturally and elegantly on floating oak shelves, a hanging clothing rack, bust forms and a display table.",
  // Recorrido y plano final
  "Mid-way, the camera passes close over a wooden work table with crochet tools neatly laid out: wooden crochet",
  "hooks, sage and beige yarn balls, scissors and a measuring tape. Then the camera pulls back and settles into a",
  "steady, perfectly composed, symmetrical wide shot of the whole empty studio — ideal as a website hero background.",
  // Restricciones duras
  "The studio is completely unoccupied from the first frame to the very last: absolutely no people, no person,",
  "no woman, no man, no hands, no faces, no silhouettes, no reflections of people, no human figures of any kind.",
  "No text, no captions, no logos, no watermark.",
].join(" ")

// Preparar las fotos de referencia (1280px JPEG de buena calidad)
const referenceImages = []
for (const file of REFERENCE_PHOTOS) {
  const buf = await sharp(file).resize({ width: 1280 }).jpeg({ quality: 90 }).toBuffer()
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
      // 1080p = máxima resolución de Veo 3.1 en 16:9
      parameters: { aspectRatio: "16:9", resolution: "1080p" },
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

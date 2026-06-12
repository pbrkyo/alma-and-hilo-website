// Edita el frame final del video del hero con Nano Banana (Gemini image):
// quita a la persona y agrega plantas, manteniendo el resto idéntico.
// Uso: GEMINI_API_KEY=... node scripts/clean-hero-frame.mjs <frame.png>
import { readFile, writeFile } from "node:fs/promises"

const KEY = process.env.GEMINI_API_KEY
if (!KEY) {
  console.error("Falta GEMINI_API_KEY")
  process.exit(1)
}

const input = process.argv[2] ?? "assets-raw/final-frame.png"
const img = await readFile(input)

const INSTRUCTION =
  "Edit this photo of an artisanal crochet studio: remove the woman at the table completely " +
  "(fill the space naturally with the table and the studio behind her, keep the crochet pieces on the table), " +
  "and add a few lush green potted plants (monstera, fern, pothos) tastefully placed among the wooden shelves " +
  "and near the windows. Keep everything else exactly identical: same lighting, same colors, same composition, " +
  "same camera angle. Photorealistic, seamless edit."

const res = await fetch(
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent",
  {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { inlineData: { mimeType: "image/png", data: img.toString("base64") } },
            { text: INSTRUCTION },
          ],
        },
      ],
    }),
  },
)
if (!res.ok) {
  console.error(`Error ${res.status}: ${(await res.text()).slice(0, 400)}`)
  process.exit(1)
}
const data = await res.json()
const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData)
if (!part) {
  console.error("Sin imagen:", JSON.stringify(data).slice(0, 400))
  process.exit(1)
}
await writeFile("assets-raw/final-frame-clean.png", Buffer.from(part.inlineData.data, "base64"))
console.log("OK -> assets-raw/final-frame-clean.png")

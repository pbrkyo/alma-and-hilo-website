import { readFile } from "node:fs/promises"
import sharp from "sharp"
const KEY = process.env.GEMINI_API_KEY
const MODEL = process.env.MODEL || "gemini-3-pro-image-preview"
const ref = (await readFile("public/hero/estudio-poster.jpg")).toString("base64")
const prompt = "Recreate this exact same crochet studio scene, identical composition, framing, objects, colors and lighting, but in ultra high quality: sharp focus, crisp fine detail in the crochet textures and yarn, clean professional editorial photography, no blur, no noise. Same image, just higher fidelity."
const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
  method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
  body: JSON.stringify({ contents: [{ parts: [{ inlineData: { mimeType: "image/jpeg", data: ref } }, { text: prompt }] }] }),
})
if (!res.ok) { console.error(res.status, (await res.text()).slice(0,200)); process.exit(1) }
const d = await res.json()
const p = d.candidates?.[0]?.content?.parts?.find(x => x.inlineData)
if (!p) { console.error("no img", JSON.stringify(d).slice(0,160)); process.exit(1) }
await sharp(Buffer.from(p.inlineData.data, "base64")).resize({ width: 1920, withoutEnlargement: false }).jpeg({ quality: 92 }).toFile("public/hero/estudio-poster.jpg")
console.log("OK poster upgraded with", MODEL)

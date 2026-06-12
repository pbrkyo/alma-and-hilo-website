// Post-proceso de los assets del hero: crop, máscara de borde difuminado
// (para que se fundan con el fondo crudo) y conversión a WebP.
import sharp from "sharp"
import { unlink } from "node:fs/promises"

const DIR = "public/hero"

/** Máscara SVG radial: opaca en el centro dado, transparente hacia afuera. */
function radialMask(size, cx, cy, r) {
  return Buffer.from(
    `<svg width="${size}" height="${size}">
      <defs>
        <radialGradient id="g" gradientUnits="userSpaceOnUse" cx="${cx}" cy="${cy}" r="${r}">
          <stop offset="58%" stop-color="#fff" stop-opacity="1"/>
          <stop offset="96%" stop-color="#fff" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${size}" height="${size}" fill="url(#g)"/>
    </svg>`,
  )
}

async function maskAndSave(input, region, maskArgs, outName, outSize, quality = 80) {
  // sharp aplica composite después del resize: la máscara va al tamaño final
  const k = outSize / region.width
  const scaled = maskArgs.map((v) => v * k)
  await sharp(`${DIR}/${input}`)
    .extract(region)
    .resize(outSize, outSize)
    .composite([{ input: radialMask(outSize, ...scaled), blend: "dest-in" }])
    .webp({ quality })
    .toFile(`${DIR}/${outName}`)
  console.log(`OK ${outName}`)
}

// Fondo de lino: sin máscara, solo comprimir
await sharp(`${DIR}/ambiente-lino.png`).webp({ quality: 70 }).toFile(`${DIR}/ambiente-lino.webp`)
console.log("OK ambiente-lino.webp")

// Guirnalda superior izquierda: contenido pegado a (0,0)
await maskAndSave(
  "guirnalda-sup.png",
  { left: 0, top: 0, width: 760, height: 760 },
  [0, 0, 760],
  "guirnalda-sup.webp",
  640,
)

// Ovillo + gancho inferior derecha: contenido pegado a (1024,1024)
await maskAndSave(
  "guirnalda-inf.png",
  { left: 304, top: 304, width: 720, height: 720 },
  [720, 720, 720],
  "guirnalda-inf.webp",
  600,
)

// Flor para La Hebra: centro de la imagen, máscara circular
await maskAndSave(
  "flor-hebra.png",
  { left: 252, top: 232, width: 560, height: 560 },
  [280, 280, 280],
  "flor-hebra.webp",
  160,
  82,
)

for (const f of ["ambiente-lino", "guirnalda-sup", "guirnalda-inf", "flor-hebra"]) {
  await unlink(`${DIR}/${f}.png`)
}
console.log("PNG originales eliminados")

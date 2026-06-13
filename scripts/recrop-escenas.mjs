// Recorta cada foto editorial a 4:5 CENTRADA en la pieza (horneado en el
// archivo, no por CSS). cx/cy = centro de la pieza como fracción (verificado
// foto por foto). Uso: node scripts/recrop-escenas.mjs
import sharp from "sharp"

const OUT = "public/products"
const RATIO = 4 / 5 // ancho/alto

// destino-escena.webp <- [origen, cx, cy]
const MAP = {
  "top-margarita-escena.webp": ["products/top-beige.jpeg", 0.52, 0.46],
  "bralette-helecho-escena.webp": ["products/top-verde.png", 0.43, 0.5],
  "top-jardin-escena.webp": ["products/top-negro.png", 0.4, 0.52],
  "top-brote-escena.webp": ["products/top-oliva.jpeg", 0.47, 0.46],
  "blusa-espuma-escena.webp": ["products/blusa-blanca.jpeg", 0.46, 0.46],
  "bolso-saco-escena.webp": ["products/bolso-verde.jpeg", 0.55, 0.5],
  "bolso-negro-escena.webp": ["products/bolso-negro.jpeg", 0.45, 0.52],
  "bolso-mercado-escena.webp": ["products/bolso-cafe.jpeg", 0.4, 0.55],
  "cartera-nube-escena.webp": ["products/cartera-beige.png", 0.5, 0.5],
  "gorro-red-escena.webp": ["products/mesh-hats.jpeg", 0.5, 0.46],
  "gorro-rubi-escena.webp": ["products/mesh-hats2.jpeg", 0.46, 0.42],
  "bolso-luna-lunar-escena.webp": ["products/duskbag-lunar.png", 0.5, 0.46],
  "bolso-luna-amarillo-escena.webp": ["products/duskbag-amarillo.png", 0.5, 0.46],
  "bolso-luna-rosa-escena.webp": ["products/duskbag-rosa.png", 0.5, 0.46],
}

for (const [dest, [src, cx, cy]] of Object.entries(MAP)) {
  const img = sharp(src)
  const { width: W, height: H } = await img.metadata()
  // Caja 4:5 lo más grande posible
  let cropW, cropH
  if (W / H >= RATIO) {
    cropH = H
    cropW = Math.round(H * RATIO)
  } else {
    cropW = W
    cropH = Math.round(W / RATIO)
  }
  const left = Math.max(0, Math.min(W - cropW, Math.round(cx * W - cropW / 2)))
  const top = Math.max(0, Math.min(H - cropH, Math.round(cy * H - cropH / 2)))
  const { size } = await img
    .extract({ left, top, width: cropW, height: cropH })
    .resize(1000, 1250)
    .webp({ quality: 80 })
    .toFile(`${OUT}/${dest}`)
  console.log(`${dest}  ${cropW}x${cropH} @ (${left},${top})  ${(size / 1024).toFixed(0)}KB`)
}
console.log(`\n${Object.keys(MAP).length} escenas recortadas y centradas.`)

// Procesa los logos de marca:
//  - public/logo-wordmark.png : wordmark "Alma & Hilo" con fondo transparente
//    (para el header), recortado y con alfa por luminancia.
//  - app/icon.png / app/apple-icon.png : favicon desde el logo circular verde.
import sharp from "sharp"

// 1) Wordmark transparente — chroma key sobre el crema (conserva verde, sage y gris)
{
  const trimmed = await sharp("images/logo-horizontal.png").trim({ threshold: 16 }).toBuffer()
  const { data, info } = await sharp(trimmed).ensureAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: W, height: H, channels } = info
  const cream = [243, 239, 230]
  const T0 = 24 // <= esto: 100% transparente (crema)
  const T1 = 52 // >= esto: 100% opaco (marca); en medio, feather
  for (let i = 0; i < data.length; i += channels) {
    const d = Math.max(
      Math.abs(data[i] - cream[0]),
      Math.abs(data[i + 1] - cream[1]),
      Math.abs(data[i + 2] - cream[2]),
    )
    data[i + 3] = d <= T0 ? 0 : d >= T1 ? 255 : Math.round(((d - T0) / (T1 - T0)) * 255)
  }
  await sharp(data, { raw: { width: W, height: H, channels } }).png().toFile("public/logo-wordmark.png")
  console.log(`logo-wordmark.png ${W}x${H}`)
}

// 2) Favicon circular (esquinas transparentes)
{
  const base = await sharp("images/logo-circular.png").trim({ threshold: 18 }).resize(512, 512, { fit: "cover" }).toBuffer()
  const mask = Buffer.from(`<svg width="512" height="512"><circle cx="256" cy="256" r="255" fill="#fff"/></svg>`)
  const round = await sharp(base).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer()
  await sharp(round).toFile("app/icon.png")
  await sharp(round).resize(180, 180).toFile("app/apple-icon.png")
  console.log("app/icon.png + app/apple-icon.png")
}

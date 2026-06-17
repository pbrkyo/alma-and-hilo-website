import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ADMIN_COOKIE, verifyAdmin } from "@/lib/auth"
import { uploadProductImage } from "@/lib/blob"

export async function POST(req: Request) {
  const value = (await cookies()).get(ADMIN_COOKIE)?.value
  if (!(await verifyAdmin(value))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  const form = await req.formData()
  const file = form.get("file")
  const slug = (form.get("slug") as string) || "img"
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Sin archivo" }, { status: 400 })
  }
  try {
    const buf = Buffer.from(await file.arrayBuffer())
    const ext = file.type === "image/jpeg" ? "jpg" : "webp"
    const contentType = file.type || "image/webp"
    const url = await uploadProductImage(slug, buf, ext, contentType)
    return NextResponse.json({ url })
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error al subir" },
      { status: 500 },
    )
  }
}

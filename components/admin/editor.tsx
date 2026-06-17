"use client"

import { useState, useTransition, useRef } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, ArrowUp, ArrowDown, Loader2, ImagePlus } from "lucide-react"
import { saveProducto } from "@/app/admin/actions"
import {
  CATEGORIAS,
  type Producto,
  type OpcionCustomizacion,
} from "@/lib/products"

// Redimensiona y codifica en el navegador (máx 1600px, webp) para no depender de
// sharp en el servidor y subir archivos livianos. Respeta la orientación EXIF.
async function processImage(file: File): Promise<{ blob: Blob; ext: string }> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" })
  const max = 1600
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height))
  const w = Math.round(bitmap.width * scale)
  const h = Math.round(bitmap.height * scale)
  const canvas = document.createElement("canvas")
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext("2d")
  if (!ctx) throw new Error("No se pudo procesar la imagen")
  ctx.drawImage(bitmap, 0, 0, w, h)
  bitmap.close()
  const toBlob = (type: string, q: number) =>
    new Promise<Blob | null>((res) => canvas.toBlob(res, type, q))
  const webp = await toBlob("image/webp", 0.82)
  if (webp) return { blob: webp, ext: "webp" }
  const jpg = await toBlob("image/jpeg", 0.85)
  if (jpg) return { blob: jpg, ext: "jpg" }
  throw new Error("No se pudo procesar la imagen")
}

async function uploadFile(file: File, slug: string): Promise<string> {
  const { blob, ext } = await processImage(file)
  const fd = new FormData()
  fd.append("file", blob, `${slug || "img"}.${ext}`)
  fd.append("slug", slug)
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
  if (!res.ok) throw new Error("No se pudo subir la imagen")
  return (await res.json()).url as string
}

export function AdminEditor({
  producto: inicial,
  isNew,
}: {
  producto: Producto
  isNew: boolean
}) {
  const router = useRouter()
  const [p, setP] = useState<Producto>(inicial)
  const [saving, startSave] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const originalSlug = isNew ? undefined : inicial.slug

  const set = (patch: Partial<Producto>) => setP((prev) => ({ ...prev, ...patch }))

  function guardar() {
    setError(null)
    if (!p.nombre.trim()) return setError("Poné un nombre.")
    startSave(async () => {
      try {
        await saveProducto(p, originalSlug)
        router.push("/admin")
        router.refresh()
      } catch (e) {
        setError(e instanceof Error ? e.message : "No se pudo guardar")
      }
    })
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-6">
      {/* Imagen principal (portada del catálogo) */}
      <Section title="Imagen principal" hint="La que se ve en la página de inicio.">
        <SingleImage
          slug={p.slug || "img"}
          value={p.escena}
          onChange={(url) => set({ escena: url })}
        />
      </Section>

      {/* Galería (al entrar al producto) */}
      <Section title="Galería" hint="Las fotos que se ven al entrar al producto.">
        <Gallery
          slug={p.slug || "img"}
          values={p.imagenes}
          onChange={(imagenes) => set({ imagenes })}
        />
      </Section>

      {/* Datos */}
      <Section title="Datos">
        <Field label="Nombre">
          <input className={inputCls} value={p.nombre} onChange={(e) => set({ nombre: e.target.value })} />
        </Field>
        <Field label="Categoría">
          <select
            className={inputCls}
            value={p.categoria}
            onChange={(e) => set({ categoria: e.target.value as Producto["categoria"] })}
          >
            {CATEGORIAS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="Frase corta (gancho)">
          <input className={inputCls} value={p.gancho} onChange={(e) => set({ gancho: e.target.value })} />
        </Field>
        <Field label="Descripción">
          <textarea
            rows={4}
            className={inputCls}
            value={p.descripcion}
            onChange={(e) => set({ descripcion: e.target.value })}
          />
        </Field>
        <Field label="Materiales">
          <input className={inputCls} value={p.materiales} onChange={(e) => set({ materiales: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Precio desde (₡)">
            <input
              type="number"
              inputMode="numeric"
              className={inputCls}
              value={p.precioDesde || ""}
              onChange={(e) => set({ precioDesde: Number(e.target.value) || 0 })}
            />
          </Field>
          <Field label="Elaboración">
            <input className={inputCls} value={p.elaboracion} onChange={(e) => set({ elaboracion: e.target.value })} />
          </Field>
        </div>
        <Field label="Texto alternativo (accesibilidad)">
          <input className={inputCls} value={p.alt} onChange={(e) => set({ alt: e.target.value })} />
        </Field>
        <label className="mt-1 flex items-center gap-2 font-sans text-sm text-[#2E4233]">
          <input
            type="checkbox"
            checked={!!p.destacado}
            onChange={(e) => set({ destacado: e.target.checked })}
            className="h-4 w-4 accent-[#2E4233]"
          />
          Destacar en la portada
        </label>
      </Section>

      {/* Opciones de personalización */}
      <Section title="Opciones" hint="Colores, tallas, etc. que la clienta puede elegir.">
        <Options value={p.opciones} onChange={(opciones) => set({ opciones })} />
      </Section>

      {error && <p className="mb-3 font-sans text-sm text-[#9a3b3b]">{error}</p>}

      <button
        onClick={guardar}
        disabled={saving}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#2E4233] px-6 py-4 font-sans text-sm uppercase tracking-widest text-[#F5F0E6] transition-colors hover:bg-[#3D5743] disabled:opacity-50"
      >
        {saving && <Loader2 className="h-4 w-4 animate-spin" />}
        {saving ? "Guardando…" : isNew ? "Crear producto" : "Guardar cambios"}
      </button>
      <p className="mt-3 text-center font-sans text-xs text-[#5C5347]">
        Los cambios se publican en ~1-2 minutos.
      </p>
    </div>
  )
}

const inputCls =
  "w-full rounded-lg border border-[#D9C9AE] bg-white px-3 py-2.5 font-sans text-[#2E4233] focus:border-[#7C8450] focus:outline-none focus:ring-1 focus:ring-[#7C8450]"

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 rounded-xl border border-[#D9C9AE] bg-white/60 p-4">
      <h2 className="font-display text-lg text-[#2E4233]">{title}</h2>
      {hint && <p className="mb-3 font-sans text-xs text-[#5C5347]">{hint}</p>}
      <div className="mt-2 space-y-3">{children}</div>
    </section>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-sans text-sm text-[#2E4233]">{label}</span>
      {children}
    </label>
  )
}

function SingleImage({
  slug,
  value,
  onChange,
}: {
  slug: string
  value?: string
  onChange: (url: string | undefined) => void
}) {
  const [busy, setBusy] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  async function pick(file?: File) {
    if (!file) return
    setBusy(true)
    try {
      onChange(await uploadFile(file, slug))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-[#EDE6D8]">
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        {busy && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/20">
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </span>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
        <button
          onClick={() => ref.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-[#7C8450] px-4 py-2 font-sans text-sm text-[#2E4233]"
        >
          <ImagePlus className="h-4 w-4" />
          {value ? "Cambiar" : "Subir"}
        </button>
        {value && (
          <button onClick={() => onChange(undefined)} className="font-sans text-xs text-[#9a3b3b]">
            Quitar
          </button>
        )}
      </div>
    </div>
  )
}

function Gallery({
  slug,
  values,
  onChange,
}: {
  slug: string
  values: string[]
  onChange: (v: string[]) => void
}) {
  const [busy, setBusy] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  async function add(files?: FileList | null) {
    if (!files?.length) return
    setBusy(true)
    try {
      const urls: string[] = []
      for (const f of Array.from(files)) urls.push(await uploadFile(f, slug))
      onChange([...values, ...urls])
    } finally {
      setBusy(false)
    }
  }
  const move = (i: number, d: -1 | 1) => {
    const j = i + d
    if (j < 0 || j >= values.length) return
    const next = [...values]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  const remove = (i: number) => onChange(values.filter((_, k) => k !== i))

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {values.map((url, i) => (
          <div key={url + i} className="relative h-24 w-20 overflow-hidden rounded-lg bg-[#EDE6D8]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 flex justify-between bg-black/40 px-1 py-0.5">
              <button onClick={() => move(i, -1)} aria-label="Mover izquierda" className="text-white disabled:opacity-30" disabled={i === 0}>
                <ArrowUp className="h-3.5 w-3.5 -rotate-90" />
              </button>
              <button onClick={() => remove(i)} aria-label="Quitar" className="text-white">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => move(i, 1)} aria-label="Mover derecha" className="text-white disabled:opacity-30" disabled={i === values.length - 1}>
                <ArrowDown className="h-3.5 w-3.5 -rotate-90" />
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={() => ref.current?.click()}
          className="flex h-24 w-20 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-[#7C8450] text-[#7C8450]"
        >
          {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Plus className="h-5 w-5" />}
          <span className="font-sans text-[10px]">Agregar</span>
        </button>
      </div>
      <input ref={ref} type="file" accept="image/*" multiple hidden onChange={(e) => add(e.target.files)} />
    </div>
  )
}

function Options({
  value,
  onChange,
}: {
  value: OpcionCustomizacion[]
  onChange: (v: OpcionCustomizacion[]) => void
}) {
  const update = (i: number, patch: Partial<OpcionCustomizacion>) =>
    onChange(value.map((o, k) => (k === i ? { ...o, ...patch } : o)))
  const addOpcion = () =>
    onChange([
      ...value,
      { id: `opt-${Date.now()}`, label: "", tipo: "opcion", valores: [{ valor: "" }] },
    ])
  const removeOpcion = (i: number) => onChange(value.filter((_, k) => k !== i))

  return (
    <div className="space-y-4">
      {value.map((op, i) => (
        <div key={op.id} className="rounded-lg border border-[#D9C9AE] p-3">
          <div className="flex items-center gap-2">
            <input
              className={inputCls}
              placeholder="Nombre (ej. Color del hilo)"
              value={op.label}
              onChange={(e) => update(i, { label: e.target.value })}
            />
            <button onClick={() => removeOpcion(i)} aria-label="Quitar opción" className="p-2 text-[#9a3b3b]">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <select
              className={inputCls}
              value={op.tipo}
              onChange={(e) => update(i, { tipo: e.target.value as OpcionCustomizacion["tipo"] })}
            >
              <option value="opcion">Lista (tallas, etc.)</option>
              <option value="color">Colores</option>
            </select>
          </div>
          <div className="mt-2 space-y-2">
            {op.valores.map((v, vi) => (
              <div key={vi} className="flex items-center gap-2">
                {op.tipo === "color" && (
                  <input
                    type="color"
                    value={v.hex || "#7C8450"}
                    onChange={(e) =>
                      update(i, {
                        valores: op.valores.map((x, k) => (k === vi ? { ...x, hex: e.target.value } : x)),
                      })
                    }
                    className="h-9 w-9 shrink-0 rounded border border-[#D9C9AE]"
                  />
                )}
                <input
                  className={inputCls}
                  placeholder="Valor (ej. Crudo)"
                  value={v.valor}
                  onChange={(e) =>
                    update(i, {
                      valores: op.valores.map((x, k) => (k === vi ? { ...x, valor: e.target.value } : x)),
                    })
                  }
                />
                <button
                  onClick={() => update(i, { valores: op.valores.filter((_, k) => k !== vi) })}
                  aria-label="Quitar valor"
                  className="p-2 text-[#9b9384]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              onClick={() => update(i, { valores: [...op.valores, { valor: "" }] })}
              className="font-sans text-sm text-[#7C8450]"
            >
              + Agregar valor
            </button>
          </div>
          <input
            className={`${inputCls} mt-2`}
            placeholder="Texto de ayuda (opcional)"
            value={op.ayuda || ""}
            onChange={(e) => update(i, { ayuda: e.target.value || undefined })}
          />
        </div>
      ))}
      <button
        onClick={addOpcion}
        className="inline-flex items-center gap-2 rounded-lg border border-[#7C8450] px-4 py-2 font-sans text-sm text-[#2E4233]"
      >
        <Plus className="h-4 w-4" />
        Agregar opción
      </button>
    </div>
  )
}

"use client"

import { useState, type ReactNode } from "react"
import { ArrowLeft, ArrowRight, Check, MessageCircle, Sparkles } from "lucide-react"
import { buildCustomPedido, buildWhatsAppUrl } from "@/lib/whatsapp"
import { HILOS } from "@/lib/products"

type Paso = {
  id: "prenda" | "colores" | "detalles"
  titulo: string
  subtitulo: string
}

const PASOS: Paso[] = [
  { id: "prenda", titulo: "¿Qué soñás tejer?", subtitulo: "Elegí el tipo de pieza para empezar." },
  { id: "colores", titulo: "Elegí tus colores", subtitulo: "Combiná los que quieras. Después afinamos el tono." },
  { id: "detalles", titulo: "Los detalles que la hacen tuya", subtitulo: "Sumá toques especiales (opcional)." },
]

const PRENDAS = ["Top o blusa", "Bolso o cartera", "Gorro o accesorio", "Vestido", "Otra cosa"]

const DETALLES = ["Flecos", "Borlas / pompones", "Forro de tela"]

export function Configurator() {
  const [paso, setPaso] = useState(0)
  const [prenda, setPrenda] = useState<string>()
  const [colores, setColores] = useState<string[]>([])
  const [detallesSel, setDetallesSel] = useState<string[]>([])
  const [notas, setNotas] = useState("")

  const esUltimo = paso === PASOS.length
  const pasoActual = PASOS[paso]

  const puedeSeguir =
    (pasoActual?.id === "prenda" && !!prenda) ||
    pasoActual?.id === "colores" ||
    pasoActual?.id === "detalles"

  const toggle = (arr: string[], set: (v: string[]) => void, v: string) =>
    set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])

  const detallesTexto = [...detallesSel, notas.trim()].filter(Boolean).join(", ")
  const waUrl = buildWhatsAppUrl(
    buildCustomPedido({
      prenda,
      colores: colores.join(", ") || undefined,
      detalles: detallesTexto || undefined,
    }),
  )

  return (
    <div className="mx-auto max-w-3xl px-6 py-10 md:py-16">
      {/* Progreso */}
      <div className="mb-10 flex items-center justify-center gap-2">
        {PASOS.map((p, i) => (
          <span
            key={p.id}
            className={`h-2 rounded-full transition-all duration-500 ${
              i < paso ? "w-8 bg-[#7C8450]" : i === paso && !esUltimo ? "w-8 bg-[#2E4233]" : "w-2 bg-[#D9C9AE]"
            }`}
          />
        ))}
        <span
          className={`h-2 rounded-full transition-all duration-500 ${
            esUltimo ? "w-8 bg-[#2E4233]" : "w-2 bg-[#D9C9AE]"
          }`}
        />
      </div>

      {!esUltimo ? (
        <div>
          <div className="mb-8 text-center">
            <span className="font-sans text-sm uppercase tracking-[0.3em] text-[#5F6740]">
              Paso {paso + 1} de {PASOS.length}
            </span>
            <h1 className="mt-3 font-display text-3xl font-medium text-[#2E4233] md:text-4xl">
              {pasoActual.titulo}
            </h1>
            <p className="mt-2 font-sans text-[#5C5347]">{pasoActual.subtitulo}</p>
          </div>

          {/* Paso prenda */}
          {pasoActual.id === "prenda" && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {PRENDAS.map((p) => (
                <SelectCard key={p} activo={prenda === p} onClick={() => setPrenda(p)}>
                  {p}
                </SelectCard>
              ))}
            </div>
          )}

          {/* Paso colores */}
          {pasoActual.id === "colores" && (
            <div className="flex flex-wrap justify-center gap-4">
              {Object.values(HILOS).map((h) => {
                const activo = colores.includes(h.nombre)
                return (
                  <button
                    key={h.nombre}
                    onClick={() => toggle(colores, setColores, h.nombre)}
                    className="flex flex-col items-center gap-2"
                    aria-pressed={activo}
                  >
                    <span
                      className={`relative flex h-14 w-14 items-center justify-center rounded-full border transition-all ${
                        activo
                          ? "border-[#2E4233] ring-2 ring-[#2E4233] ring-offset-2 ring-offset-[#F5F0E6]"
                          : "border-[#D9C9AE]"
                      }`}
                      style={{ backgroundColor: h.hex }}
                    >
                      {activo && <Check className="h-5 w-5" style={{ color: isLight(h.hex) ? "#2E4233" : "#F5F0E6" }} />}
                    </span>
                    <span className="font-sans text-xs text-[#5C5347]">{h.nombre}</span>
                  </button>
                )
              })}
            </div>
          )}

          {/* Paso detalles */}
          {pasoActual.id === "detalles" && (
            <div>
              <div className="flex flex-wrap justify-center gap-3">
                {DETALLES.map((d) => {
                  const activo = detallesSel.includes(d)
                  return (
                    <button
                      key={d}
                      onClick={() => toggle(detallesSel, setDetallesSel, d)}
                      aria-pressed={activo}
                      className={`rounded-full border px-5 py-2.5 font-sans text-sm transition-all ${
                        activo
                          ? "border-[#2E4233] bg-[#2E4233] text-[#F5F0E6]"
                          : "border-[#D9C9AE] text-[#2E4233] hover:border-[#7C8450]"
                      }`}
                    >
                      {d}
                    </button>
                  )
                })}
              </div>
              <textarea
                value={notas}
                onChange={(e) => setNotas(e.target.value)}
                rows={3}
                placeholder="¿Algo más en mente? Contanos acá (medidas, inspiración, una foto que tengás…)"
                className="mt-6 w-full rounded-2xl border border-[#D9C9AE] bg-white px-4 py-3 font-sans text-sm text-[#2E4233] placeholder:text-[#5C5347]/60 focus:border-[#7C8450] focus:outline-none focus:ring-1 focus:ring-[#7C8450]"
              />
            </div>
          )}

          {/* Navegación */}
          <div className="mt-10 flex items-center justify-between">
            <button
              onClick={() => setPaso((p) => Math.max(0, p - 1))}
              disabled={paso === 0}
              className="inline-flex items-center gap-2 font-sans text-sm text-[#5C5347] transition-colors hover:text-[#2E4233] disabled:invisible"
            >
              <ArrowLeft className="h-4 w-4" />
              Atrás
            </button>
            <button
              onClick={() => setPaso((p) => p + 1)}
              disabled={!puedeSeguir}
              className="inline-flex items-center gap-2 rounded-lg bg-[#2E4233] px-7 py-3 font-sans text-sm uppercase tracking-widest text-[#F5F0E6] transition-all hover:bg-[#3D5743] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {paso === PASOS.length - 1 ? "Ver mi pieza" : "Seguir"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        // Resumen final
        <div className="text-center">
          <Sparkles className="mx-auto h-10 w-10 text-[#7C8450]" />
          <h1 className="mt-4 font-display text-3xl font-medium text-[#2E4233] md:text-4xl">
            ¡Tu pieza está lista para nacer!
          </h1>
          <p className="mt-2 font-sans text-[#5C5347]">Esto es lo que vamos a tejer para vos:</p>

          <dl className="mx-auto mt-8 max-w-md space-y-3 rounded-2xl border border-[#D9C9AE] bg-white p-6 text-left">
            <Resumen label="Tipo de pieza" valor={prenda} />
            <Resumen label="Colores" valor={colores.join(", ")} />
            <Resumen label="Detalles" valor={detallesTexto} />
          </dl>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-8 py-4 font-sans text-base font-medium uppercase tracking-wider text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#1ebe5b]"
          >
            <MessageCircle className="h-5 w-5" />
            Pedir por WhatsApp
          </a>
          <div>
            <button
              onClick={() => setPaso(0)}
              className="mt-5 font-sans text-sm text-[#5C5347] underline-offset-4 transition-colors hover:text-[#2E4233] hover:underline"
            >
              Empezar de nuevo
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SelectCard({
  activo,
  onClick,
  children,
}: {
  activo: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={activo}
      className={`rounded-2xl border p-5 text-center font-display text-lg transition-all duration-200 ${
        activo
          ? "border-[#2E4233] bg-[#2E4233] text-[#F5F0E6]"
          : "border-[#D9C9AE] bg-white text-[#2E4233] hover:border-[#7C8450] hover:shadow-sm"
      }`}
    >
      {children}
    </button>
  )
}

function Resumen({ label, valor }: { label: string; valor?: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-[#F5F0E6] pb-2 last:border-0 last:pb-0">
      <dt className="font-sans text-sm text-[#5C5347]">{label}</dt>
      <dd className="text-right font-sans text-sm font-medium text-[#2E4233]">
        {valor || <span className="font-normal text-[#5C5347]/60">Sin elegir</span>}
      </dd>
    </div>
  )
}

function isLight(hex: string): boolean {
  const h = hex.replace("#", "")
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 > 150
}

"use client"

import { useEffect, useState } from "react"
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react"

type State = "ready" | "building" | "error" | "unknown"

export function PublishStatus() {
  const [state, setState] = useState<State>("unknown")

  useEffect(() => {
    let alive = true
    async function tick() {
      if (document.hidden) return
      try {
        const res = await fetch("/api/admin/status", { cache: "no-store" })
        if (!res.ok) return
        const data = await res.json()
        if (alive) setState(data.state as State)
      } catch {
        /* ignora */
      }
    }
    tick()
    const id = setInterval(tick, 7000)
    return () => {
      alive = false
      clearInterval(id)
    }
  }, [])

  if (state === "unknown") return null // sin VERCEL_API_TOKEN configurado

  const map = {
    building: {
      icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
      text: "Publicando…",
      cls: "border-[#C9962E]/40 bg-[#F6EBD3] text-[#8a6a1f]",
    },
    ready: {
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
      text: "Publicado",
      cls: "border-[#7C8450]/40 bg-[#EAEFDC] text-[#5F6740]",
    },
    error: {
      icon: <AlertCircle className="h-3.5 w-3.5" />,
      text: "Error al publicar",
      cls: "border-[#9a3b3b]/40 bg-[#f6e3e3] text-[#9a3b3b]",
    },
  }[state]

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 font-sans text-xs ${map.cls}`}
      title="Estado de publicación de la tienda"
    >
      {map.icon}
      {map.text}
    </span>
  )
}

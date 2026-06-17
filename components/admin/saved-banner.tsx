"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, X } from "lucide-react"

export function SavedBanner() {
  const [show, setShow] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setShow(false), 9000)
    return () => clearTimeout(t)
  }, [])
  if (!show) return null

  return (
    <div className="mb-4 flex items-start gap-3 rounded-lg border border-[#7C8450]/40 bg-[#EAEFDC] p-3.5">
      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#5F6740]" />
      <div className="flex-1 font-sans text-sm text-[#2E4233]">
        <p className="font-medium">Cambios guardados.</p>
        <p className="text-[#5C5347]">
          La tienda se actualiza en ~1-2 minutos.{" "}
          <a
            href="https://almayhilo.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-[#2E4233]"
          >
            Ver la web
          </a>
        </p>
      </div>
      <button onClick={() => setShow(false)} aria-label="Cerrar" className="p-0.5 text-[#5C5347]">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

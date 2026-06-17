"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, LogOut } from "lucide-react"

export function AdminBar({ title, backHref }: { title: string; backHref?: string }) {
  const router = useRouter()

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" })
    router.push("/admin/login")
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[#D9C9AE] bg-[#F5F0E6]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-3 px-5 py-3">
        <div className="flex min-w-0 items-center gap-2">
          {backHref && (
            <Link href={backHref} aria-label="Atrás" className="-ml-1 p-1 text-[#2E4233]">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          )}
          <h1 className="truncate font-display text-xl text-[#2E4233]">{title}</h1>
        </div>
        <button
          onClick={logout}
          className="inline-flex shrink-0 items-center gap-1.5 font-sans text-sm text-[#5C5347] hover:text-[#2E4233]"
        >
          <LogOut className="h-4 w-4" />
          Salir
        </button>
      </div>
    </header>
  )
}

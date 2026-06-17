"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(false)
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
    setLoading(false)
    if (res.ok) router.push("/admin")
    else setError(true)
  }

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[#F5F0E6] px-6">
      <form onSubmit={submit} className="w-full max-w-sm">
        <h1 className="mb-2 text-center font-display text-3xl text-[#2E4233]">Alma &amp; Hilo</h1>
        <p className="mb-8 text-center font-sans text-sm text-[#5C5347]">Panel del catálogo</p>
        <label className="mb-2 block font-sans text-sm text-[#2E4233]">Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
          className="w-full rounded-lg border border-[#D9C9AE] bg-white px-4 py-3 font-sans text-[#2E4233] focus:border-[#7C8450] focus:outline-none focus:ring-1 focus:ring-[#7C8450]"
        />
        {error && (
          <p className="mt-2 font-sans text-sm text-[#9a3b3b]">Contraseña incorrecta.</p>
        )}
        <button
          type="submit"
          disabled={loading || !password}
          className="mt-6 w-full rounded-lg bg-[#2E4233] px-6 py-3 font-sans text-sm uppercase tracking-widest text-[#F5F0E6] transition-colors hover:bg-[#3D5743] disabled:opacity-40"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </main>
  )
}

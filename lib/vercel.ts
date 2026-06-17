import "server-only"

// Consulta el estado del último deployment de producción para mostrar
// "Publicando…/Publicado" en el admin. Sigue SIEMPRE el deployment más reciente,
// así que guardados encadenados (build 1 corriendo + guardás otro → build 2)
// mantienen el estado en "Publicando…" hasta que el último build queda listo.

const PROJECT = process.env.VERCEL_PROJECT_ID || "prj_gNiklJpuCI4RouzjoYayvYo7a3hl"
const TEAM = process.env.VERCEL_TEAM_ID || "team_EEw5hL0x2MGmZPjp9AMYF2NX"

export type PublishState = "ready" | "building" | "error" | "unknown"

export async function getPublishStatus(): Promise<{ state: PublishState; at?: number }> {
  const token = process.env.VERCEL_API_TOKEN
  if (!token) return { state: "unknown" }
  try {
    const url = `https://api.vercel.com/v6/deployments?projectId=${PROJECT}&teamId=${TEAM}&target=production&limit=1`
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    if (!res.ok) return { state: "unknown" }
    const data = await res.json()
    const d = data.deployments?.[0]
    if (!d) return { state: "unknown" }
    const s = String(d.state || d.readyState || "").toUpperCase()
    const state: PublishState =
      s === "READY" ? "ready" : s === "ERROR" || s === "CANCELED" ? "error" : "building"
    return { state, at: d.created }
  } catch {
    return { state: "unknown" }
  }
}

// Auth mínima del admin: una sola clave (env ADMIN_PASSWORD). La cookie guarda
// un HMAC determinístico de la clave, verificable en el middleware (edge) y en
// los route handlers (node) con Web Crypto. Suficiente para una sola usuaria
// sobre HTTPS. Sin node:crypto para que funcione también en el edge.

export const ADMIN_COOKIE = "ah_admin"
const PAYLOAD = "alma-admin-v1"

function b64url(bytes: Uint8Array): string {
  let s = ""
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")
}

/** Token determinístico = HMAC-SHA256(ADMIN_PASSWORD, PAYLOAD). */
export async function adminToken(secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  )
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(PAYLOAD))
  return b64url(new Uint8Array(sig))
}

/** Verifica el valor de la cookie contra la clave del entorno. */
export async function verifyAdmin(cookieValue?: string): Promise<boolean> {
  const secret = process.env.ADMIN_PASSWORD
  if (!secret || !cookieValue) return false
  try {
    return cookieValue === (await adminToken(secret))
  } catch {
    return false
  }
}

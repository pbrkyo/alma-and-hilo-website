import { NextResponse } from "next/server"
import { ADMIN_COOKIE, adminToken } from "@/lib/auth"

export async function POST(req: Request) {
  const { password } = await req.json().catch(() => ({ password: "" }))
  const secret = process.env.ADMIN_PASSWORD
  if (!secret || password !== secret) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, await adminToken(secret), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 días
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 })
  return res
}

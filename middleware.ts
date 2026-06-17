import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { ADMIN_COOKIE, verifyAdmin } from "@/lib/auth"

// Protege el admin. Deja pasar la pantalla de login y su API.
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next()
  }

  const ok = await verifyAdmin(req.cookies.get(ADMIN_COOKIE)?.value)
  if (ok) return NextResponse.next()

  if (pathname.startsWith("/api/")) {
    return new NextResponse("No autorizado", { status: 401 })
  }
  const url = req.nextUrl.clone()
  url.pathname = "/admin/login"
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}

import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { ADMIN_COOKIE, verifyAdmin } from "@/lib/auth"
import { getPublishStatus } from "@/lib/vercel"

export async function GET() {
  const value = (await cookies()).get(ADMIN_COOKIE)?.value
  if (!(await verifyAdmin(value))) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }
  return NextResponse.json(await getPublishStatus())
}

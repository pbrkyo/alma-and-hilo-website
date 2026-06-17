import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Panel · Alma & Hilo",
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[100dvh] bg-[#F5F0E6]">{children}</div>
}

"use client"

import { MessageCircle } from "lucide-react"
import { buildWhatsAppUrl, WHATSAPP_GENERAL_MESSAGE } from "@/lib/whatsapp"

export function WhatsAppFab() {
  return (
    <a
      href={buildWhatsAppUrl(WHATSAPP_GENERAL_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chateá con nosotras por WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg hover:bg-[#1ebe5b] hover:scale-110 transition-all duration-300"
    >
      <MessageCircle className="w-7 h-7" />
    </a>
  )
}

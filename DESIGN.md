# DESIGN.md — Alma & Hilo

Sistema de diseño del sitio. Toda decisión visual nueva debe ser coherente con este documento.
Aprobado en Fase 1 (jun 2026). Dirección: **artesanal, cálido, hecho a mano — nunca template de ecommerce**.

---

## Paleta — "Del cesto de hilos"

La paleta sale directamente de las fotos reales de producto (tops oliva, algodón crudo,
madera cálida). Familia verde/crudo/oliva, **sin acentos fuera de familia** (decisión del
cliente: se descartó el rojo).

| Token | Nombre | Hex | Uso |
|---|---|---|---|
| `--verde-alma` | Verde Alma | `#2E4233` | Color de marca. Headers, texto fuerte, fondos oscuros |
| `--crudo` | Crudo | `#F5F0E6` | Fondo principal — algodón sin teñir, no blanco frío |
| `--oliva` | Oliva | `#7C8450` | Secundario. La Hebra (elemento firma), hovers, detalles |
| `--arena` | Arena | `#D9C9AE` | Neutro cálido. Bordes, tags, separadores |
| `--miel` | Miel | `#B8862B` | Acento pequeño (sale del bolso amarillo de trapillo). Solo micro-detalles |
| `--cacao` | Cacao | `#33291F` | Texto de cuerpo — café oscuro cálido en vez de negro |

Reglas:
- Texto de cuerpo siempre Cacao sobre Crudo (contraste AA+).
- Miel nunca para texto pequeño (no pasa AA sobre Crudo); solo iconos/detalles decorativos ≥ 24px o sobre Verde Alma.
- WhatsApp green (`#25D366`) se reserva EXCLUSIVAMENTE para CTAs de compra — es señal de "acá se compra".

## Tipografías

| Rol | Fuente | Por qué |
|---|---|---|
| Display | **Fraunces** (variable, optical + SOFT axis) | Serif blanda de terminales redondeadas; en pesos altos se siente moldeada a mano, como puntada de trapillo |
| Body | **Karla** | Grotesca humanista, cálida y muy legible en móvil |

- Cargadas con `next/font` (self-hosted, `font-display: swap`), subset latin.
- Variables CSS: `--font-display` (Fraunces), `--font-body` (Karla).
- Display en itálica para palabras emotivas ("amor", "a mano") — uso puntual.

## Elemento firma — **La Hebra**

Un hilo continuo color **Oliva** que cose el sitio de arriba a abajo:

1. **Nace en el hero**: la escena Three.js ("El hilo que teje") teje una hebra en tiempo real.
2. **Baja por el sitio**: un SVG path continuo en el margen/centro que se dibuja con el
   scroll (GSAP ScrollTrigger), con puntadas visibles donde "engancha" cada sección.
3. **Borda los títulos**: los headings de sección llevan un subrayado de puntada que se
   dibuja al entrar en viewport.
4. **Remata en el footer**: la hebra termina en un pequeño nudo junto al CTA de WhatsApp.

Significado: el hilo que une — madre e hija, la artesana y quien recibe la pieza.
Performance: es un SVG + stroke-dashoffset, costo casi nulo.

## Layout

- **Mobile-first** (diseñar a 380px primero). La mayoría del tráfico viene de Instagram.
- Las fotos de producto son paisaje (2752×1536): cards editoriales horizontales en
  desktop, full-width en móvil. No grid cuadrado genérico.
- Fondos con textura sutil: grano + patrón de puntada en CSS/SVG (nunca imágenes pesadas).
- Bordes: radios suaves (`0.75rem` en cards), nunca pill-buttons genéricos.

## Animación

- **GSAP + ScrollTrigger** para coreografía: entrada del hero (logo → headline → CTA),
  reveals por sección, dibujo de La Hebra.
- **Three.js** solo en el hero, lazy-loaded (`next/dynamic`), < 1MB de assets críticos.
- `prefers-reduced-motion`: fallback estático elegante (imagen + fade simple). Sin WebGL: mismo fallback.
- Una secuencia bien coreografiada > efectos regados. No animar por animar.

## Voz y copy

- Español natural de Costa Rica, cálido y cercano (vos/usted suave, "pura vida" sin caricatura).
- Lo hecho a mano se comunica como **valor**, no como demora: "se hace para vos, 5–10 días".
- WhatsApp es EL checkout: todos los caminos terminan en un mensaje pre-armado natural.

## Assets

- Fotos de producto: originales JPEG en `products/` (fuera de git), servidas como WebP
  optimizado desde `public/products/` vía `next/image` (optimización de Vercel activa).
- Texturas generadas: Gemini API (key local del cliente, nunca en el repo) o crops de
  fotos reales. Guardar como WebP/AVIF comprimido.

"use client"

// "El hilo que teje": una hebra de trapillo que va formando puntos de cadeneta
// en tiempo real. Vanilla Three.js (sin R3F) para mantener el bundle liviano.
// Se carga con next/dynamic desde el hero — nunca en el bundle inicial.

import { useEffect, useRef } from "react"
import * as THREE from "three"

const OLIVA = 0x7c8450
const ARENA = 0xd9c9ae
const VERDE_ALMA = 0x2e4233

/** Curva de una fila de puntos de cadeneta: bucles que avanzan en x. */
function chainCurve(loops: number, spacing: number, radius: number, yWave: number): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = []
  const STEPS = 28
  for (let i = 0; i <= loops * STEPS; i++) {
    const t = i / STEPS
    const theta = t * Math.PI * 2
    const x = t * spacing + Math.cos(theta) * radius * 0.55
    const y = Math.sin(theta) * radius + Math.sin(t * 0.7) * yWave
    const z = Math.cos(theta * 2) * radius * 0.22
    pts.push(new THREE.Vector3(x, y, z))
  }
  return new THREE.CatmullRomCurve3(pts)
}

type Strand = {
  mesh: THREE.Mesh
  totalIndices: number
  ringIndices: number
  progress: number
  /** Posición vertical relativa a la mitad visible de la cámara (-1 abajo, 1 arriba) */
  yRel: number
}

function makeStrand(
  loops: number,
  spacing: number,
  radius: number,
  tubeRadius: number,
  color: number,
  yRel: number,
  zOffset: number,
  fiberBump: THREE.Texture | null,
): Strand {
  const curve = chainCurve(loops, spacing, radius, 0.18)
  const tubularSegments = loops * 36
  const radialSegments = 7
  const geometry = new THREE.TubeGeometry(curve, tubularSegments, tubeRadius, radialSegments, false)
  const material = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.92,
    metalness: 0,
    bumpMap: fiberBump ?? undefined,
    bumpScale: 0.6,
  })
  const mesh = new THREE.Mesh(geometry, material)
  // Centrar la fila; la altura final se asigna en resize() según la cámara
  const width = loops * spacing
  mesh.position.set(-width / 2, 0, zOffset)
  geometry.setDrawRange(0, 0)
  return {
    mesh,
    totalIndices: tubularSegments * radialSegments * 6,
    ringIndices: radialSegments * 6,
    progress: 0,
    yRel,
  }
}

export default function YarnScene({ onKnitted }: { onKnitted?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const onKnittedRef = useRef(onKnitted)
  onKnittedRef.current = onKnitted

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" })
    } catch {
      return // sin WebGL: el hero ya muestra el fallback estático detrás
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 60)
    camera.position.set(0, 0, 9)

    // Luz cálida de taller: hemisferio crudo + direccional desde la ventana
    scene.add(new THREE.HemisphereLight(0xf5f0e6, 0x33291f, 0.95))
    const sun = new THREE.DirectionalLight(0xfff2dc, 1.6)
    sun.position.set(-4, 5, 6)
    scene.add(sun)
    const rim = new THREE.DirectionalLight(0xd9c9ae, 0.5)
    rim.position.set(4, -3, 2)
    scene.add(rim)

    const group = new THREE.Group()
    scene.add(group)

    // Textura de fibra de trapillo (generada con Gemini, ver scripts/generate-textures.mjs)
    const fiberBump = new THREE.TextureLoader().load("/textures/hilo-fibra.webp")
    fiberBump.wrapS = fiberBump.wrapT = THREE.RepeatWrapping
    fiberBump.repeat.set(24, 1)

    // Tres hebras que enmarcan la composición (arriba y abajo, nunca sobre el texto)
    const strands: Strand[] = [
      makeStrand(9, 1.05, 0.34, 0.065, OLIVA, 0.78, 0, fiberBump),
      makeStrand(8, 1.18, 0.4, 0.05, VERDE_ALMA, 0.95, -1.1, fiberBump),
      makeStrand(10, 0.95, 0.3, 0.05, ARENA, -0.84, -0.5, fiberBump),
    ]
    strands.forEach((s) => group.add(s.mesh))

    group.rotation.z = -0.07

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    // Mouse parallax (lerp suave)
    const target = { x: 0, y: 0 }
    const current = { x: 0, y: 0 }
    const onPointer = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2
      target.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    if (!reduceMotion) window.addEventListener("pointermove", onPointer, { passive: true })

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = container
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      // En pantallas angostas alejamos la cámara para que quepa el tejido
      camera.position.z = w / h < 0.8 ? 13 : w / h < 1.2 ? 11 : 9
      camera.updateProjectionMatrix()
      // Bandas arriba/abajo proporcionales a la altura visible
      const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.position.z
      strands.forEach((s) => {
        s.mesh.position.y = s.yRel * halfH
      })
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    // Pausar cuando el hero no está en viewport o la pestaña está oculta
    let inView = true
    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
    })
    io.observe(container)

    const clock = new THREE.Clock()
    const KNIT_SECONDS = 5
    let knittedNotified = false
    let raf = 0

    const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

    const animate = () => {
      raf = requestAnimationFrame(animate)
      if (!inView || document.hidden) return
      const elapsed = clock.getElapsedTime()
      const dt = Math.min(clock.getDelta(), 0.05)

      // Tejido progresivo (con reduce-motion aparece ya tejido)
      strands.forEach((s, i) => {
        const delay = i * 0.55
        const p = reduceMotion ? 1 : easeOut(Math.min(Math.max((elapsed - delay) / KNIT_SECONDS, 0), 1))
        if (p !== s.progress) {
          s.progress = p
          const rings = Math.floor((p * s.totalIndices) / s.ringIndices)
          s.mesh.geometry.setDrawRange(0, rings * s.ringIndices)
        }
      })

      if (!knittedNotified && (reduceMotion || elapsed > KNIT_SECONDS + 1.2)) {
        knittedNotified = true
        onKnittedRef.current?.()
      }

      if (!reduceMotion) {
        // Respiración + parallax
        current.x += (target.x - current.x) * Math.min(dt * 3, 1)
        current.y += (target.y - current.y) * Math.min(dt * 3, 1)
        group.rotation.y = current.x * 0.16
        group.rotation.x = current.y * 0.1 + Math.sin(elapsed * 0.4) * 0.02
        group.position.y = Math.sin(elapsed * 0.55) * 0.08
      }

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("pointermove", onPointer)
      ro.disconnect()
      io.disconnect()
      strands.forEach((s) => {
        s.mesh.geometry.dispose()
        ;(s.mesh.material as THREE.Material).dispose()
      })
      fiberBump.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div ref={containerRef} className="absolute inset-0 [&>canvas]:h-full [&>canvas]:w-full" aria-hidden="true" />
}

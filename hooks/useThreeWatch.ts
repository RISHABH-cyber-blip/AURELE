import { useEffect, useRef } from 'react'
import * as THREE from 'three'

/**
 * useThreeWatch
 * Builds a simple procedural watch (case, bezel, dial, hands, strap lugs)
 * entirely from primitives — no .glb model needed yet.
 */
export function useThreeWatch() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    rotY: 0.4,
    rotX: 0,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    autoRotate: true,
    autoTimer: null as ReturnType<typeof setTimeout> | null,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100)
    camera.position.set(0, 0.35, 5.2)

    const resize = () => {
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    scene.add(new THREE.AmbientLight(0xfff6ea, 0.6))
    const key = new THREE.DirectionalLight(0xfff2dd, 1.1)
    key.position.set(4, 6, 5)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xb8935f, 0.4)
    rim.position.set(-4, -2, -3)
    scene.add(rim)

    const group = new THREE.Group()
    scene.add(group)

    const goldMat = new THREE.MeshStandardMaterial({ color: 0xb8935f, metalness: 0.75, roughness: 0.28 })
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.4, roughness: 0.5 })
    const dialMat = new THREE.MeshStandardMaterial({ color: 0xfaf6f0, metalness: 0.1, roughness: 0.6 })
    const strapMat = new THREE.MeshStandardMaterial({ color: 0x2a2622, metalness: 0.1, roughness: 0.85 })

    const bezel = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.32, 64), goldMat)
    bezel.rotation.x = Math.PI / 2
    group.add(bezel)

    const dial = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.12, 0.1, 64), dialMat)
    dial.rotation.x = Math.PI / 2
    dial.position.z = 0.17
    group.add(dial)

    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2
      const tick = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.14, 0.02), darkMat)
      tick.position.set(Math.sin(angle) * 0.95, Math.cos(angle) * 0.95, 0.22)
      tick.rotation.z = -angle
      group.add(tick)
    }

    const hourHand = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.55, 0.03), darkMat)
    hourHand.position.set(0, 0.25, 0.24)
    hourHand.rotation.z = -Math.PI / 3
    group.add(hourHand)

    const minuteHand = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.85, 0.03), darkMat)
    minuteHand.position.set(0, 0.4, 0.25)
    minuteHand.rotation.z = -Math.PI / 1.6
    group.add(minuteHand)

    const secondHand = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.95, 0.03), goldMat)
    const secondPivot = new THREE.Group()
    secondPivot.add(secondHand)
    secondHand.position.set(0, 0.45, 0)
    secondPivot.position.z = 0.26
    group.add(secondPivot)

    const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.1, 16), goldMat)
    pin.rotation.x = Math.PI / 2
    pin.position.z = 0.27
    group.add(pin)

    ;[1, -1].forEach((dir) => {
      const strap = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.14), strapMat)
      strap.position.set(0, dir * 1.55, -0.02)
      group.add(strap)
    })

    group.scale.setScalar(0.85)

    const s = stateRef.current
    const onDown = (e: PointerEvent) => {
      s.isDragging = true
      s.autoRotate = false
      s.lastX = e.clientX
      s.lastY = e.clientY
      if (s.autoTimer) clearTimeout(s.autoTimer)
    }
    const onUp = () => {
      s.isDragging = false
      s.autoTimer = setTimeout(() => { s.autoRotate = true }, 2500)
    }
    const onMove = (e: PointerEvent) => {
      if (!s.isDragging) return
      s.rotY += (e.clientX - s.lastX) * 0.01
      s.rotX = Math.max(-0.4, Math.min(0.4, s.rotX + (e.clientY - s.lastY) * 0.005))
      s.lastX = e.clientX
      s.lastY = e.clientY
    }

    canvas.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointermove', onMove)

    const clock = new THREE.Clock()
    let raf: number

    const animate = () => {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      if (s.autoRotate) s.rotY += 0.0035
      group.rotation.y += (s.rotY - group.rotation.y) * 0.08
      group.rotation.x += (s.rotX - group.rotation.x) * 0.08
      group.position.y = Math.sin(t * 1.1) * 0.08

      secondPivot.rotation.z = -((Date.now() / 1000) % 60) * ((Math.PI * 2) / 60)

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      canvas.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointermove', onMove)
      renderer.dispose()
    }
  }, [])

  return canvasRef
}
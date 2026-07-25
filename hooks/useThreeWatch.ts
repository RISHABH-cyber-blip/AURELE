import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

export interface WatchColorConfig {
  caseHex: string
  dialHex: string
  strapHex: string
}

/**
 * useThreeWatch
 * Loads the real watch.glb model (from public/models/) instead of
 * building primitives. Every mesh name is logged to the console on load
 * — check your browser DevTools console once, note the names printed,
 * and send them back so we can target case/dial/strap precisely for
 * the live color configurator.
 *
 * Until we know the real names, this applies a best-guess color tint
 * to ALL meshes whose name contains "case", "dial", or "strap"
 * (case-insensitive) — common naming conventions — so the configurator
 * still does *something* useful immediately.
 */
export function useThreeWatch(config: WatchColorConfig) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const configRef = useRef(config)
  configRef.current = config

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
    camera.position.set(0, 0.4, 4.2)

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

    scene.add(new THREE.AmbientLight(0xfff6ea, 0.7))
    const key = new THREE.DirectionalLight(0xfff2dd, 1.3)
    key.position.set(4, 6, 5)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xb8935f, 0.4)
    rim.position.set(-4, -2, -3)
    scene.add(rim)

    const group = new THREE.Group()
    scene.add(group)

    // Tracks meshes we've identified as case/dial/strap, so the render
    // loop can lerp their color live without re-traversing every frame.
    const targetedMeshes: { case: THREE.Mesh[]; dial: THREE.Mesh[]; strap: THREE.Mesh[] } = {
      case: [], dial: [], strap: [],
    }

    const loader = new GLTFLoader()
    loader.load(
      '/models/watch.glb',
      (gltf: { scene: THREE.Group }) => {
        const model = gltf.scene

        // Auto-center and auto-scale, same approach as the reference
        // shoe project's README documents for swapping in real models.
        const box = new THREE.Box3().setFromObject(model)
        const size = box.getSize(new THREE.Vector3()).length()
        const center = box.getCenter(new THREE.Vector3())
        model.position.x -= center.x
        model.position.y -= center.y
        model.position.z -= center.z
        const targetSize = 2.6
        model.scale.setScalar(targetSize / size)

        console.log('--- Aurele: watch.glb mesh names (send these back for precise color-targeting) ---')
        model.traverse((child: THREE.Object3D) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            mesh.castShadow = true
            mesh.receiveShadow = true
            console.log(' •', mesh.name || '(unnamed mesh)')

            const nameLower = mesh.name.toLowerCase()
            if (nameLower.includes('case') || nameLower.includes('bezel')) targetedMeshes.case.push(mesh)
            else if (nameLower.includes('dial') || nameLower.includes('face')) targetedMeshes.dial.push(mesh)
            else if (nameLower.includes('strap') || nameLower.includes('band')) targetedMeshes.strap.push(mesh)
          }
        })
        console.log('--- end mesh list ---')

        group.add(model)
      },
      undefined,
      (error: ErrorEvent | Error) => console.error('Error loading watch.glb — check the file exists at public/models/watch.glb:', error)
    )

    group.scale.setScalar(1.15)

    /* ── Interaction ── */
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

    const tmpColor = new THREE.Color()
    const clock = new THREE.Clock()
    let raf: number

    const animate = () => {
      raf = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      if (s.autoRotate) s.rotY += 0.0035
      group.rotation.y += (s.rotY - group.rotation.y) * 0.08
      group.rotation.x += (s.rotX - group.rotation.x) * 0.08
      group.position.y = Math.sin(t * 1.1) * 0.08

      const cfg = configRef.current
      const applyColor = (meshes: THREE.Mesh[], hex: string) => {
        tmpColor.set(hex)
        meshes.forEach((mesh) => {
          const mat = mesh.material as THREE.MeshStandardMaterial
          if (mat?.color) mat.color.lerp(tmpColor, 0.06)
        })
      }
      applyColor(targetedMeshes.case, cfg.caseHex)
      applyColor(targetedMeshes.dial, cfg.dialHex)
      applyColor(targetedMeshes.strap, cfg.strapHex)

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
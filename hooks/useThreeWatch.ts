import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

export interface WatchColorConfig {
  caseHex: string
  dialHex: string
  strapHex: string
}

export function useThreeWatch(config: WatchColorConfig) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const configRef = useRef(config)
  configRef.current = config

  const stateRef = useRef({
    rotY: 0.4, rotX: 0, isDragging: false, lastX: 0, lastY: 0,
    // start without auto-rotation; enable a very slow rotation after idle
    autoRotate: false,
    autoRotateSpeed: 0,
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

    const targetedMeshes: { case: THREE.Mesh[]; dial: THREE.Mesh[]; strap: THREE.Mesh[] } = {
      case: [], dial: [], strap: [],
    }

    // ── Fallback: the original procedural watch, used automatically if
    // the real .glb fails to load for ANY reason. Page never breaks. ──
    function buildFallbackWatch() {
      console.warn('watch.glb failed to load — showing procedural fallback watch instead. See error above for the real cause.')
      const goldMat = new THREE.MeshStandardMaterial({ color: 0xb8935f, metalness: 0.75, roughness: 0.28 })
      const darkMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.4, roughness: 0.5 })
      const dialMat = new THREE.MeshStandardMaterial({ color: 0xfaf6f0, metalness: 0.1, roughness: 0.6 })
      const strapMat = new THREE.MeshStandardMaterial({ color: 0x2a2622, metalness: 0.1, roughness: 0.85 })

      const bezel = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.3, 0.32, 64), goldMat)
      bezel.rotation.x = Math.PI / 2
      group.add(bezel)
      targetedMeshes.case.push(bezel)

      const dial = new THREE.Mesh(new THREE.CylinderGeometry(1.12, 1.12, 0.1, 64), dialMat)
      dial.rotation.x = Math.PI / 2
      dial.position.z = 0.17
      group.add(dial)
      targetedMeshes.dial.push(dial)

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
      ;[1, -1].forEach((dir) => {
        const strap = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.14), strapMat)
        strap.position.set(0, dir * 1.55, -0.02)
        group.add(strap)
        targetedMeshes.strap.push(strap)
      })

      group.scale.setScalar(0.6)
    }

    // ── Draco decoder — many Sketchfab downloads compress geometry with
    // Draco to save file size. Without this, GLTFLoader can silently fail
    // or throw on those files. Using Google's public CDN decoder — no
    // extra files needed in your project. ──
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

    const loader = new GLTFLoader()
    loader.setDRACOLoader(dracoLoader)

    loader.load(
      '/models/watch.glb',
      (gltf) => {
        const model = gltf.scene

        // IMPORTANT FIX: this model's strap extends far from the watch
        // face (confirmed by inspecting the file directly). Centering
        // using the WHOLE model's bounding box put the rotation pivot
        // out along the strap instead of on the watch face, causing it
        // to swing in a wide arc when rotated. Fix: compute the
        // centering box using only the watch-head meshes (Metal/Glass/
        // Background materials), excluding the strap/buckle geometry
        // (whose mesh names start with "Cube" in this file).
        const coreBox = new THREE.Box3()
        let hasCoreMeshes = false

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh && !child.name.startsWith('Cube')) {
            coreBox.expandByObject(child)
            hasCoreMeshes = true
          }
        })

        const box = hasCoreMeshes ? coreBox : new THREE.Box3().setFromObject(model)
        const size = box.getSize(new THREE.Vector3()).length()

        if (size === 0 || !isFinite(size)) {
          console.error('watch.glb loaded but has no visible geometry (size = 0). Falling back.')
          buildFallbackWatch()
          return
        }

        const center = box.getCenter(new THREE.Vector3())
        model.position.x -= center.x
        model.position.y -= center.y
        model.position.z -= center.z
        model.scale.setScalar(2.0 / size)

        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            mesh.castShadow = true
            mesh.receiveShadow = true

            if (Array.isArray(mesh.material)) {
              mesh.material = mesh.material.map((m) => m.clone())
            } else {
              mesh.material = mesh.material.clone()
            }

            const matName = Array.isArray(mesh.material)
              ? mesh.material[0]?.name
              : (mesh.material as THREE.Material).name

            if (matName === 'Metal') targetedMeshes.case.push(mesh)
            else if (matName === 'Background') targetedMeshes.dial.push(mesh)
            else if (matName === 'Cuero') targetedMeshes.strap.push(mesh)
          }
        })

        console.log(
          `Aurele: real watch model loaded, centered on watch face — targeting ${targetedMeshes.case.length} case, ` +
          `${targetedMeshes.dial.length} dial, ${targetedMeshes.strap.length} strap meshes.`
        )

        group.add(model)
      },
      undefined,
      (error: ErrorEvent | Error) => {
        console.error('Error loading watch.glb:', error)
        buildFallbackWatch()
      }
    )

    /* ── Interaction ── */
    const s = stateRef.current
    const onDown = (e: PointerEvent) => {
      s.isDragging = true; s.autoRotate = false; s.autoRotateSpeed = 0; s.lastX = e.clientX; s.lastY = e.clientY
      if (s.autoTimer) clearTimeout(s.autoTimer)
    }
    const onUp = () => {
      s.isDragging = false
      if (s.autoTimer) clearTimeout(s.autoTimer)
      // after a short idle, enable a very slow auto-rotate
      s.autoTimer = setTimeout(() => { s.autoRotate = true; s.autoRotateSpeed = 0.0003 }, 2500)
    }
    const onMove = (e: PointerEvent) => {
      if (!s.isDragging) return
      s.rotY += (e.clientX - s.lastX) * 0.01
      s.rotX = Math.max(-0.4, Math.min(0.4, s.rotX + (e.clientY - s.lastY) * 0.005))
      s.lastX = e.clientX; s.lastY = e.clientY
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
      if (s.autoRotate) s.rotY += s.autoRotateSpeed ?? 0.0003
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
      dracoLoader.dispose()
      renderer.dispose()
    }
  }, [])

  return canvasRef
}
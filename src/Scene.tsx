import { Canvas, useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const progress = { value: 0 }
const clamp = (value: number) => Math.min(1, Math.max(0, value))
const smooth = (value: number) => {
  const t = clamp(value)
  return t * t * (3 - 2 * t)
}
const LOAD_START = 1.65 / 8
const LOAD_END = 2.55 / 8
const LOAD_LENGTH = LOAD_START * 42
const roadTravel = (value: number) => value <= LOAD_START
  ? value * 42
  : value <= LOAD_END
    ? LOAD_LENGTH
    : LOAD_LENGTH + ((value - LOAD_END) / (1 - LOAD_END)) * (42 - LOAD_LENGTH)
const truckPositionX = (value: number) => 1.3 + smooth(value / 0.075) * 0.9

function brandTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 320
  const context = canvas.getContext('2d')
  if (!context) return new THREE.CanvasTexture(canvas)
  context.fillStyle = '#10213c'
  context.fillRect(0, 0, canvas.width, canvas.height)
  context.fillStyle = '#c6a15b'
  context.fillRect(0, 0, 18, canvas.height)
  context.fillStyle = '#ffffff'
  context.font = 'bold 118px Arial, sans-serif'
  context.fillText('DHA', 65, 144)
  context.fillStyle = '#d5b36d'
  context.font = 'bold 50px Arial, sans-serif'
  context.fillText('MOVERS & PACKERS', 68, 228)
  context.fillStyle = '#ffffff'
  context.font = '24px Arial, sans-serif'
  context.fillText('KARACHI  ·  INTERCITY ACROSS PAKISTAN', 70, 278)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

function Truck({ reducedMotion }: { reducedMotion: boolean }) {
  const wheels = useRef<THREE.Group>(null)
  const truck = useRef<THREE.Group>(null)
  const sidePanels = useRef<THREE.Group>(null)
  const rearDoors = useRef<THREE.Group>(null)
  const cargoBoxes = useRef<THREE.Group>(null)
  const loadingRamp = useRef<THREE.Group>(null)
  const logo = useMemo(brandTexture, [])

  useFrame(() => {
    const p = progress.value
    const scene = p * 8
    const loading = (scene >= 1.65 && scene <= 2.55) || (scene >= 7.45 && scene <= 8.05)
    const doorOpen = loading ? smooth(clamp((scene >= 7.45 ? scene - 7.45 : scene - 1.7) / 0.25)) : 0
    if (truck.current) {
      truck.current.position.x = reducedMotion ? 2.2 : truckPositionX(p)
      truck.current.position.z = roadTravel(p)
      truck.current.rotation.y = 0
      truck.current.scale.setScalar(reducedMotion ? 1 : 0.86 + smooth(p / 0.075) * 0.14)
    }
    if (sidePanels.current) {
      sidePanels.current.children.forEach(panel => {
        panel.position.y = panel.position.x > 0 ? 2.55 + doorOpen * 2.7 : 2.55
      })
    }
    if (rearDoors.current) {
      rearDoors.current.children.forEach((door, index) => {
        const side = index === 0 ? -1 : 1
        door.rotation.y = -side * doorOpen * 1.18
      })
    }
    if (loadingRamp.current) loadingRamp.current.visible = loading
    if (cargoBoxes.current) {
      const loadProgress = clamp((scene - 1.68) / 0.82)
      cargoBoxes.current.children.forEach((box, index) => {
        box.visible = scene >= 1.68 && loadProgress >= 0.3 + index * 0.18
      })
    }
    if (wheels.current) {
      const wheelAngle = reducedMotion ? 0 : -roadTravel(p) / 0.59
      wheels.current.children.forEach(wheel => {
        wheel.rotation.x = wheelAngle
      })
    }
  })

  const wheelPositions = [-2.05, -0.55, 2.55]
  return (
    <group ref={truck} position={[1.3, 0, 0]} castShadow>
      <mesh castShadow receiveShadow position={[0, 0.95, 0.2]}>
        <boxGeometry args={[2.75, 0.32, 7.05]} />
        <meshStandardMaterial color="#17253b" metalness={0.55} roughness={0.38} />
      </mesh>
      <group>
        <mesh castShadow receiveShadow position={[0, 3.94, -0.65]}>
          <boxGeometry args={[3.38, 0.12, 4.56]} />
          <meshStandardMaterial color="#f5f4ef" metalness={0.22} roughness={0.42} />
        </mesh>
        <mesh position={[0, 3.86, -0.65]}>
          <boxGeometry args={[3.2, 0.025, 4.34]} />
          <meshStandardMaterial color="#17243a" roughness={0.83} />
        </mesh>
        <mesh castShadow position={[0, 2.55, 1.57]}>
          <boxGeometry args={[3.34, 2.75, 0.1]} />
          <meshStandardMaterial color="#edece6" metalness={0.18} roughness={0.5} />
        </mesh>
        <mesh position={[0, 1.12, -0.65]}>
          <boxGeometry args={[3.1, 0.06, 4.28]} />
          <meshStandardMaterial color="#343a43" roughness={0.72} />
        </mesh>
        <mesh castShadow position={[0, 2.55, -2.91]}>
          <boxGeometry args={[3.35, 0.1, 0.1]} />
          <meshStandardMaterial color="#10213c" metalness={0.55} roughness={0.3} />
        </mesh>
      </group>
      <group ref={sidePanels}>
        {[-1, 1].map(side => (
          <group key={side} position={[side * 1.69, 2.55, -0.65]}>
            <mesh castShadow>
              <boxGeometry args={[0.09, 2.7, 4.38]} />
              <meshStandardMaterial color="#f8f7f2" metalness={0.2} roughness={0.4} />
            </mesh>
            <mesh position={[side * 0.043, 1.18, 0]} castShadow>
              <boxGeometry args={[0.025, 0.32, 4.38]} />
              <meshStandardMaterial color="#10213c" metalness={0.45} roughness={0.35} />
            </mesh>
            <mesh position={[side * 0.055, -1.15, 0]}>
              <boxGeometry args={[0.02, 0.11, 4.4]} />
              <meshStandardMaterial color="#c6a15b" metalness={0.7} roughness={0.26} />
            </mesh>
            <mesh position={[side * 0.052, 0.1, 0]} rotation={[0, side * Math.PI / 2, 0]}>
              <planeGeometry args={[3.48, 1.1]} />
              <meshBasicMaterial map={logo} toneMapped={false} />
            </mesh>
            {[-2.03, -1.35, -0.67, 0.01, 0.69, 1.37, 2.05].map(z => (
              <mesh key={z} position={[side * 0.06, 0.64, z]}>
                <boxGeometry args={[0.025, 0.04, 0.035]} />
                <meshStandardMaterial color="#b9b7b0" metalness={0.72} roughness={0.25} />
              </mesh>
            ))}
          </group>
        ))}
      </group>
      <group position={[0, 1.85, 2.8]}>
        <mesh castShadow position={[0, 0.18, 0]}>
          <boxGeometry args={[2.15, 1.95, 2.15]} />
          <meshStandardMaterial color="#10213c" metalness={0.42} roughness={0.32} />
        </mesh>
        <mesh castShadow position={[0, 0.59, 1.08]}>
          <boxGeometry args={[1.68, 0.89, 0.075]} />
          <meshPhysicalMaterial color="#8db4c3" metalness={0.48} roughness={0.16} clearcoat={0.9} />
        </mesh>
        <mesh position={[0, 0.12, 1.12]}>
          <boxGeometry args={[1.8, 0.055, 0.08]} />
          <meshStandardMaterial color="#d0ad67" metalness={0.8} roughness={0.23} />
        </mesh>
        <mesh castShadow position={[-0.54, -0.25, 1.09]}>
          <boxGeometry args={[0.075, 0.53, 0.08]} />
          <meshStandardMaterial color="#d0ad67" metalness={0.72} roughness={0.25} />
        </mesh>
        <mesh castShadow position={[0.54, -0.25, 1.09]}>
          <boxGeometry args={[0.075, 0.53, 0.08]} />
          <meshStandardMaterial color="#d0ad67" metalness={0.72} roughness={0.25} />
        </mesh>
        {[-1, 1].map(side => (
          <group key={side}>
            <mesh castShadow position={[side * 1.02, 0.44, 0.58]}>
              <boxGeometry args={[0.15, 0.16, 0.45]} />
              <meshStandardMaterial color="#d0ad67" metalness={0.72} roughness={0.25} />
            </mesh>
            <mesh castShadow position={[side * 1.08, 0.39, 0.88]}>
              <boxGeometry args={[0.26, 0.31, 0.28]} />
              <meshStandardMaterial color="#10213c" metalness={0.55} roughness={0.28} />
            </mesh>
            <mesh position={[side * 1.091, 0.4, -0.08]}>
              <boxGeometry args={[0.045, 0.78, 0.76]} />
              <meshPhysicalMaterial color="#8db4c3" metalness={0.42} roughness={0.16} clearcoat={0.9} />
            </mesh>
            <mesh position={[side * 1.1, 0.4, -0.08]}>
              <boxGeometry args={[0.055, 0.045, 0.8]} />
              <meshStandardMaterial color="#d0ad67" metalness={0.72} roughness={0.25} />
            </mesh>
            <mesh position={[side * 0.72, 0.22, 1.095]}>
              <boxGeometry args={[0.38, 0.22, 0.08]} />
              <meshStandardMaterial color="#fff1bd" emissive="#f5bc48" emissiveIntensity={0.28} />
            </mesh>
            <mesh position={[side * 0.99, -0.55, 1.09]}>
              <boxGeometry args={[0.3, 0.15, 0.08]} />
              <meshStandardMaterial color="#bf3034" emissive="#50151a" />
            </mesh>
          </group>
        ))}
        {[-0.52, -0.26, 0, 0.26, 0.52].map(y => (
          <mesh key={y} position={[0, y - 0.3, 1.1]}>
            <boxGeometry args={[0.88, 0.04, 0.05]} />
            <meshStandardMaterial color="#8391a0" metalness={0.72} roughness={0.3} />
          </mesh>
        ))}
        <mesh castShadow position={[0, -0.87, 1.18]}>
          <boxGeometry args={[2.45, 0.2, 0.25]} />
          <meshStandardMaterial color="#aab3bd" metalness={0.76} roughness={0.26} />
        </mesh>
        <mesh castShadow position={[0, 0.68, -0.82]}>
          <boxGeometry args={[0.48, 0.95, 0.06]} />
          <meshStandardMaterial color="#10213c" metalness={0.35} roughness={0.35} />
        </mesh>
      </group>
      <group ref={loadingRamp} position={[3.1, 0.57, -1.2]} rotation={[0, 0, -0.38]} visible={false}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.8, 0.14, 3.4]} />
          <meshStandardMaterial color="#444a50" metalness={0.48} roughness={0.48} />
        </mesh>
        {Array.from({ length: 10 }, (_, index) => (
          <mesh key={index} position={[-1.25 + index * 0.28, 0.08, 0]}>
            <boxGeometry args={[0.075, 0.035, 3.35]} />
            <meshStandardMaterial color="#899098" metalness={0.62} roughness={0.38} />
          </mesh>
        ))}
      </group>
      <group ref={rearDoors}>
        {[-1, 1].map(side => (
          <group key={side} position={[side * 1.58, 2.55, -2.88]}>
            <group position={[-side * 0.78, 0, 0]}>
              <mesh castShadow>
                <boxGeometry args={[1.53, 2.65, 0.09]} />
                <meshStandardMaterial color="#ecebe5" roughness={0.46} />
              </mesh>
              <mesh position={[0, 0, 0.052]}>
                <boxGeometry args={[0.035, 2.56, 0.025]} />
                <meshStandardMaterial color="#9a9da0" metalness={0.72} roughness={0.26} />
              </mesh>
              {[-0.63, 0.63].map(x => (
                <mesh key={x} position={[x, 0, 0.06]}>
                  <boxGeometry args={[0.055, 2.63, 0.035]} />
                  <meshStandardMaterial color="#c6a15b" metalness={0.78} roughness={0.25} />
                </mesh>
              ))}
              <mesh position={[0, 0, 0.07]}>
                <boxGeometry args={[0.07, 0.5, 0.04]} />
                <meshStandardMaterial color="#344254" metalness={0.68} roughness={0.34} />
              </mesh>
            </group>
          </group>
        ))}
      </group>
      <group ref={cargoBoxes}>
        {[0, 1, 2, 3].map(index => (
          <group key={index} visible={false} position={[index % 2 === 0 ? -0.55 : 0.48, 1.48 + Math.floor(index / 2) * 0.75, -1.55 + (index % 2) * 1.02]}>
            <CardboardBox size={[0.9, 0.72, 0.82]} shade={index % 2 === 0 ? '#b78350' : '#cb9b68'} />
          </group>
        ))}
      </group>
      <LoadingCrew reducedMotion={reducedMotion} />
      <group ref={wheels}>
        {wheelPositions.map(z => [-1, 1].map(side => (
          <group key={`${z}-${side}`} position={[side * 1.43, 0.56, z]}>
            <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.59, 0.59, 0.34, 28]} />
              <meshStandardMaterial color="#20252b" roughness={0.88} metalness={0.05} />
            </mesh>
            <mesh castShadow position={[side * 0.19, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.34, 0.34, 0.08, 24]} />
              <meshStandardMaterial color="#b9c1ca" metalness={0.88} roughness={0.24} />
            </mesh>
            <mesh position={[side * 0.24, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.105, 0.105, 0.09, 16]} />
              <meshStandardMaterial color="#c6a15b" metalness={0.83} roughness={0.2} />
            </mesh>
            <mesh position={[side * 0.245, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
              <torusGeometry args={[0.47, 0.035, 8, 32]} />
              <meshStandardMaterial color="#353b42" roughness={0.82} />
            </mesh>
            {Array.from({ length: 20 }, (_, tread) => {
              const angle = tread * Math.PI / 10
              return (
                <mesh key={tread} position={[side * 0.245, Math.sin(angle) * 0.565, Math.cos(angle) * 0.565]} rotation={[angle, 0, 0]}>
                  <boxGeometry args={[0.11, 0.075, 0.055]} />
                  <meshStandardMaterial color="#343a41" roughness={0.9} />
                </mesh>
              )
            })}
            {Array.from({ length: 8 }, (_, index) => {
              const angle = index * Math.PI / 4
              return (
                <mesh key={index} position={[side * 0.245, Math.sin(angle) * 0.23, Math.cos(angle) * 0.23]} rotation={[angle, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.035, 0.035, 0.04, 8]} />
                  <meshStandardMaterial color="#5e6975" metalness={0.8} roughness={0.28} />
                </mesh>
              )
            })}
          </group>
        )))}
      </group>
    </group>
  )
}

function CardboardBox({ size, shade = '#b7824e' }: { size: [number, number, number]; shade?: string }) {
  const [width, height, depth] = size
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color={shade} roughness={0.88} />
      </mesh>
      <mesh position={[0, height / 2 + 0.006, 0]} castShadow>
        <boxGeometry args={[width * 0.2, 0.014, depth * 0.98]} />
        <meshStandardMaterial color="#dfbd7d" roughness={0.72} />
      </mesh>
      <mesh position={[0, 0, depth / 2 + 0.006]}>
        <boxGeometry args={[0.018, height * 0.94, 0.012]} />
        <meshStandardMaterial color="#91623e" roughness={0.9} />
      </mesh>
      <mesh position={[0, height / 2 + 0.012, 0]}>
        <boxGeometry args={[width * 0.025, 0.012, depth * 0.96]} />
        <meshStandardMaterial color="#ae8958" roughness={0.85} />
      </mesh>
    </group>
  )
}

function LoadingCrew({ reducedMotion }: { reducedMotion: boolean }) {
  const workers = useRef<(THREE.Group | null)[]>([])
  const colors = ['#c67842', '#486d5b', '#55718d', '#9b6744']
  const trips = [0.02, 0.25, 0.49, 0.72]
  const duration = 0.27

  useFrame(({ clock }) => {
    const scene = progress.value * 8
    const loadingProgress = clamp((scene - 1.68) / 0.82)
    workers.current.forEach((worker, index) => {
      if (!worker) return
      const elapsed = loadingProgress - trips[index]
      const active = scene >= 1.68 && scene <= 2.55 && elapsed >= 0 && elapsed <= duration
      worker.visible = active
      if (!active) return
      const walk = clamp(elapsed / duration)
      worker.position.set(4.5 - smooth(walk) * 2.35, reducedMotion ? 0 : Math.abs(Math.sin(clock.elapsedTime * 8)) * 0.035, -1.35 + index * 0.78)
      worker.rotation.y = -Math.PI / 2
      worker.rotation.z = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 8) * 0.018
      worker.children[2].rotation.x = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 8 + index) * 0.12
      worker.children[5].rotation.x = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 8 + index) * 0.18
      worker.children[6].rotation.x = reducedMotion ? 0 : -Math.sin(clock.elapsedTime * 8 + index) * 0.18
    })
  })

  return <>{trips.map((_, index) => (
    <group key={index} ref={node => { workers.current[index] = node }} visible={false}>
      <mesh position={[0, 1.16, 0]} castShadow>
        <capsuleGeometry args={[0.16, 0.47, 5, 10]} />
        <meshStandardMaterial color={colors[index]} roughness={0.83} />
      </mesh>
      <mesh position={[0, 1.72, 0]} castShadow>
        <sphereGeometry args={[0.16, 18, 14]} />
        <meshStandardMaterial color="#bc896b" roughness={0.8} />
      </mesh>
      <group position={[0, 0.4, 0]}>
        <mesh position={[-0.12, 0.27, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.43, 4, 8]} />
          <meshStandardMaterial color="#263346" roughness={0.9} />
        </mesh>
        <mesh position={[0.12, 0.27, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.43, 4, 8]} />
          <meshStandardMaterial color="#263346" roughness={0.9} />
        </mesh>
        <mesh position={[-0.12, -0.02, 0.08]} castShadow>
          <boxGeometry args={[0.16, 0.08, 0.28]} />
          <meshStandardMaterial color="#272a2d" roughness={0.84} />
        </mesh>
        <mesh position={[0.12, -0.02, 0.08]} castShadow>
          <boxGeometry args={[0.16, 0.08, 0.28]} />
          <meshStandardMaterial color="#272a2d" roughness={0.84} />
        </mesh>
      </group>
      <mesh position={[-0.055, 1.2, 0.158]}>
        <boxGeometry args={[0.055, 0.65, 0.018]} />
        <meshStandardMaterial color="#f1d184" roughness={0.55} />
      </mesh>
      <mesh position={[0.055, 1.2, 0.158]}>
        <boxGeometry args={[0.055, 0.65, 0.018]} />
        <meshStandardMaterial color="#f1d184" roughness={0.55} />
      </mesh>
      <mesh position={[-0.24, 1.26, 0.1]} rotation={[1.05, 0, -0.16]} castShadow>
        <capsuleGeometry args={[0.065, 0.36, 4, 8]} />
        <meshStandardMaterial color={colors[index]} roughness={0.82} />
      </mesh>
      <mesh position={[0.24, 1.26, 0.1]} rotation={[1.05, 0, 0.16]} castShadow>
        <capsuleGeometry args={[0.065, 0.36, 4, 8]} />
        <meshStandardMaterial color={colors[index]} roughness={0.82} />
      </mesh>
      <group position={[0, 1.27, 0.55]}>
        <CardboardBox size={[0.56, 0.54, 0.52]} shade={index % 2 ? '#c39160' : '#b78350'} />
      </group>
    </group>
  ))}</>
}

function FloatingBoxes({ count, reducedMotion }: { count: number; reducedMotion: boolean }) {
  const boxes = useRef<(THREE.Group | null)[]>([])
  const rng = useMemo(() => Array.from({ length: count }, (_, index) => ({
    position: new THREE.Vector3(5.2 + (index % 3) * 0.66, 1.3 + Math.floor(index / 3) * 0.8, -1.8 + (index % 4) * 0.88),
    rotation: new THREE.Euler(0.13 * (index % 3), 0.23 * index, 0.08 * (index % 2)),
    size: [0.65 + (index % 3) * 0.12, 0.55 + (index % 2) * 0.15, 0.6 + (index % 4) * 0.08] as [number, number, number],
    shade: ['#b78350', '#cb9b68', '#a97648', '#d3aa79'][index % 4],
    phase: index * 1.7,
  })), [count])

  useFrame(({ clock }) => {
    const load = smooth((progress.value - 0.205) / 0.09)
    rng.forEach((box, index) => {
      const node = boxes.current[index]
      if (!node) return
      const scene = progress.value * 8
      node.visible = scene >= 1.65 && scene <= 2.55
      const destination = new THREE.Vector3(
        truckPositionX(progress.value) + ((index % 3) - 1) * 0.85,
        1.45 + Math.floor(index / 6) * 0.53,
        roadTravel(progress.value) - 0.75 + ((index % 4) - 1.5) * 0.68,
      )
      node.position.lerpVectors(box.position, destination, load)
      const movement = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.6 + box.phase)
      if (!reducedMotion) node.position.y += Math.sin(clock.elapsedTime * 1.2 + box.phase) * 0.08 * (1 - load)
      node.rotation.set(box.rotation.x + load * 0.08, box.rotation.y + (1 - load) * movement * 0.2, box.rotation.z)
      node.scale.setScalar(1 - load * 0.12)
    })
  })

  return <>{rng.map((box, index) => (
    <group key={index} ref={node => { boxes.current[index] = node }} position={box.position.toArray()} rotation={box.rotation}>
      <CardboardBox size={box.size} shade={box.shade} />
    </group>
  ))}</>
}

function FurnishedHome() {
  const wall = '#e9e4d8'
  const trim = '#b69970'
  const windowGlass = '#88adba'
  return (
    <group position={[1, 0, -0.35]} rotation={[0, -Math.PI / 2, 0]}>
      <mesh position={[0, 0.13, 0]} castShadow receiveShadow>
        <boxGeometry args={[7.25, 0.26, 5.1]} />
        <meshStandardMaterial color="#a9a391" roughness={0.95} />
      </mesh>
      <mesh position={[0, 0.23, 0]} receiveShadow>
        <boxGeometry args={[7.7, 0.12, 5.55]} />
        <meshStandardMaterial color="#c3b59b" roughness={0.96} />
      </mesh>
      <mesh position={[0, 1.86, -2.36]} castShadow receiveShadow>
        <boxGeometry args={[7.05, 3.2, 0.18]} />
        <meshStandardMaterial color={wall} roughness={0.91} />
      </mesh>
      {[-3.43, 3.43].map(x => (
        <mesh key={x} position={[x, 1.86, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.18, 3.2, 4.9]} />
          <meshStandardMaterial color={wall} roughness={0.91} />
        </mesh>
      ))}
      <mesh position={[-2.72, 1.85, 2.36]} castShadow>
        <boxGeometry args={[1.42, 3.12, 0.18]} />
        <meshStandardMaterial color={wall} roughness={0.91} />
      </mesh>
      <mesh position={[0.35, 1.85, 2.36]} castShadow>
        <boxGeometry args={[1.72, 3.12, 0.18]} />
        <meshStandardMaterial color={wall} roughness={0.91} />
      </mesh>
      <mesh position={[2.75, 1.85, 2.36]} castShadow>
        <boxGeometry args={[1.35, 3.12, 0.18]} />
        <meshStandardMaterial color={wall} roughness={0.91} />
      </mesh>
      <mesh position={[-1.25, 3.34, 2.36]} castShadow>
        <boxGeometry args={[1.55, 0.22, 0.22]} />
        <meshStandardMaterial color={trim} roughness={0.78} />
      </mesh>
      <mesh position={[1.42, 3.34, 2.36]} castShadow>
        <boxGeometry args={[1.48, 0.22, 0.22]} />
        <meshStandardMaterial color={trim} roughness={0.78} />
      </mesh>
      <mesh position={[0, 3.48, 2.36]} castShadow>
        <boxGeometry args={[7.15, 0.18, 0.3]} />
        <meshStandardMaterial color="#eee8dc" roughness={0.87} />
      </mesh>
      <mesh position={[0, 3.55, 2.36]} castShadow>
        <shapeGeometry args={[new THREE.Shape().setFromPoints([
          new THREE.Vector2(-3.52, 0),
          new THREE.Vector2(3.52, 0),
          new THREE.Vector2(0, 1.7),
        ])]} />
        <meshStandardMaterial color="#e5dfd2" roughness={0.92} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 1.7, 0]} receiveShadow>
        <boxGeometry args={[6.7, 0.1, 4.55]} />
        <meshStandardMaterial color="#b99a70" roughness={0.83} />
      </mesh>
      <mesh position={[0, 2.25, -0.42]} castShadow>
        <boxGeometry args={[0.14, 2.35, 0.12]} />
        <meshStandardMaterial color="#d8cfbd" roughness={0.9} />
      </mesh>
      <mesh position={[0, 3.36, 0]} castShadow>
        <boxGeometry args={[0.28, 0.22, 5.15]} />
        <meshStandardMaterial color="#69594a" roughness={0.87} />
      </mesh>
      {[-1, 1].map(side => (
        <group key={side} position={[side * 1.55, 2.15, 2.47]}>
          <mesh castShadow>
            <boxGeometry args={[1.32, 1.38, 0.1]} />
            <meshStandardMaterial color={trim} roughness={0.72} />
          </mesh>
          <mesh position={[0, 0, 0.065]}>
            <boxGeometry args={[1.1, 1.16, 0.035]} />
            <meshPhysicalMaterial color={windowGlass} roughness={0.2} metalness={0.16} clearcoat={0.7} />
          </mesh>
          <mesh position={[0, 0, 0.09]}>
            <boxGeometry args={[0.055, 1.12, 0.035]} />
            <meshStandardMaterial color="#efe8d9" roughness={0.62} />
          </mesh>
          <mesh position={[0, 0, 0.09]}>
            <boxGeometry args={[1.08, 0.055, 0.035]} />
            <meshStandardMaterial color="#efe8d9" roughness={0.62} />
          </mesh>
          <mesh position={[0, -0.76, 0.05]}>
            <boxGeometry args={[1.53, 0.12, 0.22]} />
            <meshStandardMaterial color={trim} roughness={0.78} />
          </mesh>
        </group>
      ))}
      <group position={[2.08, 1.25, 2.49]}>
        <mesh position={[0, 0, 0.03]} castShadow>
          <boxGeometry args={[1.05, 2.42, 0.12]} />
          <meshStandardMaterial color="#604832" roughness={0.75} />
        </mesh>
        <mesh position={[-0.28, 0.25, 0.1]}>
          <boxGeometry args={[0.36, 0.52, 0.025]} />
          <meshPhysicalMaterial color="#84aab6" roughness={0.2} clearcoat={0.7} />
        </mesh>
        <mesh position={[-0.42, -0.08, 0.12]}>
          <sphereGeometry args={[0.045, 10, 8]} />
          <meshStandardMaterial color="#d3b875" metalness={0.7} roughness={0.25} />
        </mesh>
      </group>
      <mesh position={[0, 0.35, 2.82]} castShadow>
        <boxGeometry args={[1.55, 0.22, 0.85]} />
        <meshStandardMaterial color="#b49a78" roughness={0.86} />
      </mesh>
      <mesh position={[0, 0.18, 3.24]} castShadow>
        <boxGeometry args={[1.7, 0.2, 0.16]} />
        <meshStandardMaterial color="#95836a" roughness={0.84} />
      </mesh>
      <group position={[-1.35, 0, 0.2]}>
        <mesh position={[0, 0.64, 0]} castShadow>
          <boxGeometry args={[2, 0.68, 0.92]} />
          <meshStandardMaterial color="#63776e" roughness={0.9} />
        </mesh>
        <mesh position={[0, 1.16, -0.28]} castShadow>
          <boxGeometry args={[2, 0.54, 0.32]} />
          <meshStandardMaterial color="#73887d" roughness={0.88} />
        </mesh>
        {[-0.7, 0.7].map(x => (
          <mesh key={x} position={[x, 0.23, 0.08]} castShadow>
            <boxGeometry args={[0.22, 0.45, 0.76]} />
            <meshStandardMaterial color="#755943" roughness={0.82} />
          </mesh>
        ))}
      </group>
      <group position={[1.02, 0, -0.38]}>
        <mesh position={[0, 0.88, 0]} castShadow>
          <boxGeometry args={[1.2, 0.1, 0.85]} />
          <meshStandardMaterial color="#986e49" roughness={0.82} />
        </mesh>
        {[-0.46, 0.46].map(x => [-0.29, 0.29].map(z => (
          <mesh key={`${x}-${z}`} position={[x, 0.48, z]} castShadow>
            <boxGeometry args={[0.07, 0.78, 0.07]} />
            <meshStandardMaterial color="#755943" roughness={0.82} />
          </mesh>
        )))}
        {[-0.34, 0.34].map(x => (
          <mesh key={x} position={[x, 0.97, 0.02]}>
            <cylinderGeometry args={[0.12, 0.12, 0.035, 16]} />
            <meshStandardMaterial color="#e4dfd2" roughness={0.76} />
          </mesh>
        ))}
      </group>
      <group position={[-2.65, 0, -1.12]}>
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[0.76, 0.78, 0.76]} />
          <meshStandardMaterial color="#866445" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.84, 0]}>
          <boxGeometry args={[0.84, 0.06, 0.84]} />
          <meshStandardMaterial color="#634934" roughness={0.82} />
        </mesh>
      </group>
      <mesh position={[-1.45, 0.54, 2.12]} castShadow>
        <boxGeometry args={[0.72, 0.55, 0.14]} />
        <meshStandardMaterial color="#bd8d61" roughness={0.88} />
      </mesh>
      <group position={[-4.25, 0, 0.5]}>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[2.1, 0.2, 6.2]} />
          <meshStandardMaterial color="#79806a" roughness={1} />
        </mesh>
        {[-2.1, 0, 2.1].map(z => (
          <group key={z} position={[0, 0, z]}>
            <mesh position={[0, 0.5, 0]} castShadow>
              <sphereGeometry args={[0.48, 12, 10]} />
              <meshStandardMaterial color="#5c725a" roughness={0.92} />
            </mesh>
            <mesh position={[0, 1.08, 0]} castShadow>
              <sphereGeometry args={[0.35, 12, 10]} />
              <meshStandardMaterial color="#6d805e" roughness={0.92} />
            </mesh>
          </group>
        ))}
      </group>
      <group position={[4.15, 0, -3.1]}>
        <mesh position={[0, 0.8, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.26, 1.6, 10]} />
          <meshStandardMaterial color="#73563e" roughness={0.93} />
        </mesh>
        <mesh position={[0, 2.25, 0]} castShadow>
          <coneGeometry args={[1.25, 2.2, 9]} />
          <meshStandardMaterial color="#46644c" roughness={0.94} />
        </mesh>
      </group>
      <group>
        <mesh castShadow position={[2.2, 4.77, -1.4]}>
          <boxGeometry args={[0.8, 1.25, 0.9]} />
          <meshStandardMaterial color="#a89a83" roughness={0.92} />
        </mesh>
        <mesh castShadow position={[-1.7, 4.15, 0]} rotation={[0, 0, 0.56]}>
          <boxGeometry args={[4.5, 0.18, 5.25]} />
          <meshStandardMaterial color="#55483d" roughness={0.84} />
        </mesh>
        <mesh castShadow position={[1.7, 4.15, 0]} rotation={[0, 0, -0.56]}>
          <boxGeometry args={[4.5, 0.18, 5.25]} />
          <meshStandardMaterial color="#615347" roughness={0.84} />
        </mesh>
        <mesh castShadow position={[0, 5.07, 0]}>
          <boxGeometry args={[0.62, 0.18, 5.4]} />
          <meshStandardMaterial color="#625a50" roughness={0.86} />
        </mesh>
      </group>
      <group position={[0, 0, 4.7]}>
        <mesh position={[0, 0.22, 0]} castShadow>
          <boxGeometry args={[2.6, 0.22, 8.2]} />
          <meshStandardMaterial color="#b0a48e" roughness={0.94} />
        </mesh>
        {[-3, -1, 1, 3].map(x => (
          <mesh key={x} position={[x, 0.78, 0]}>
            <boxGeometry args={[0.08, 1.0, 0.08]} />
            <meshStandardMaterial color="#d7c8a6" roughness={0.86} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function HomeCrew({ reducedMotion }: { reducedMotion: boolean }) {
  const crew = useRef<THREE.Group>(null)
  const workers = useRef<(THREE.Group | null)[]>([])
  useFrame(({ clock }) => {
    const scene = progress.value * 8
    const atHome = scene >= 2.75 && scene < 5.05
    const finalArrival = scene >= 7.45 && scene <= 8.05
    const active = atHome || finalArrival
    if (crew.current) {
      crew.current.visible = active
      crew.current.position.set(1, 0, -0.35)
      crew.current.rotation.y = -Math.PI / 2
    }
    if (!active) return
    const move = atHome
      ? smooth(clamp((scene - 2.8) / 1.7))
      : smooth(clamp((scene - 7.45) / 0.5))
    workers.current.forEach((worker, index) => {
      if (!worker) return
      const offset = index * 0.8
      worker.position.set(2.1 - move * 1.5 - offset * 0.25, reducedMotion ? 0 : Math.abs(Math.sin(clock.elapsedTime * 7 + index)) * 0.035, 2.3 + move * 5.3 - offset)
      worker.rotation.y = 0
      worker.children[2].rotation.x = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 7 + index) * 0.12
      worker.children[5].rotation.x = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 7 + index) * 0.15
      worker.children[6].rotation.x = reducedMotion ? 0 : -Math.sin(clock.elapsedTime * 7 + index) * 0.15
    })
  })

  return (
    <group ref={crew} visible={false}>
      {[0, 1].map(index => (
        <group key={index} ref={node => { workers.current[index] = node }}>
          <mesh position={[0, 1.15, 0]} castShadow>
            <capsuleGeometry args={[0.17, 0.48, 5, 10]} />
            <meshStandardMaterial color={index === 0 ? '#c67842' : '#486d5b'} roughness={0.83} />
          </mesh>
          <mesh position={[0, 1.72, 0]} castShadow>
            <sphereGeometry args={[0.16, 18, 14]} />
            <meshStandardMaterial color="#bc896b" roughness={0.8} />
          </mesh>
          <group position={[0, 0.4, 0]}>
            {[-0.12, 0.12].map(x => (
              <group key={x} position={[x, 0.27, 0]}>
                <mesh castShadow>
                  <capsuleGeometry args={[0.07, 0.43, 4, 8]} />
                  <meshStandardMaterial color="#263346" roughness={0.9} />
                </mesh>
                <mesh position={[0, -0.29, 0.08]} castShadow>
                  <boxGeometry args={[0.16, 0.08, 0.28]} />
                  <meshStandardMaterial color="#272a2d" roughness={0.84} />
                </mesh>
              </group>
            ))}
          </group>
          <mesh position={[-0.055, 1.2, 0.158]}>
            <boxGeometry args={[0.055, 0.65, 0.018]} />
            <meshStandardMaterial color="#f1d184" roughness={0.55} />
          </mesh>
          <mesh position={[0.055, 1.2, 0.158]}>
            <boxGeometry args={[0.055, 0.65, 0.018]} />
            <meshStandardMaterial color="#f1d184" roughness={0.55} />
          </mesh>
          <mesh position={[-0.24, 1.25, 0.12]} rotation={[1.05, 0, -0.16]} castShadow>
            <capsuleGeometry args={[0.065, 0.36, 4, 8]} />
            <meshStandardMaterial color={index === 0 ? '#c67842' : '#486d5b'} roughness={0.82} />
          </mesh>
          <mesh position={[0.24, 1.25, 0.12]} rotation={[1.05, 0, 0.16]} castShadow>
            <capsuleGeometry args={[0.065, 0.36, 4, 8]} />
            <meshStandardMaterial color={index === 0 ? '#c67842' : '#486d5b'} roughness={0.82} />
          </mesh>
          <group position={[0, 1.27, 0.55]} rotation={[0, -0.12, 0]}>
            <CardboardBox size={[0.6, 0.58, 0.54]} shade={index === 0 ? '#b78350' : '#cb9b68'} />
          </group>
        </group>
      ))}
    </group>
  )
}

function Office() {
  return (
    <group position={[6.5, 0, 0]}>
      <mesh position={[0, 2.1, -1.2]}>
        <boxGeometry args={[5.4, 4.4, 0.12]} />
        <meshStandardMaterial color="#20344d" roughness={0.75} />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[5.5, 0.14, 3.1]} />
        <meshStandardMaterial color="#9b9c9a" roughness={0.82} />
      </mesh>
      {[-1.55, 0.1, 1.75].map(x => (
        <group key={x} position={[x, 0, -0.18]}>
          <mesh position={[0, 1.04, 0]} castShadow>
            <boxGeometry args={[1.35, 0.13, 0.76]} />
            <meshStandardMaterial color="#a98055" roughness={0.72} />
          </mesh>
          {[-0.52, 0.52].map(dx => (
            <mesh key={dx} position={[dx, 0.55, 0]} castShadow>
              <boxGeometry args={[0.06, 0.9, 0.06]} />
              <meshStandardMaterial color="#5b6874" metalness={0.55} roughness={0.4} />
            </mesh>
          ))}
          <mesh position={[0, 1.62, -0.2]} castShadow>
            <boxGeometry args={[0.48, 0.36, 0.04]} />
            <meshStandardMaterial color="#202d40" roughness={0.35} />
          </mesh>
          <mesh position={[0, 1.21, 0.7]} castShadow>
            <boxGeometry args={[0.7, 0.08, 0.66]} />
            <meshStandardMaterial color="#566879" roughness={0.72} />
          </mesh>
          <mesh position={[0, 1.48, 0.98]} castShadow>
            <boxGeometry args={[0.7, 0.48, 0.1]} />
            <meshStandardMaterial color="#566879" roughness={0.72} />
          </mesh>
        </group>
      ))}
      <CardboardBox size={[0.62, 0.58, 0.58]} shade="#bc8b5c" />
      <group position={[0.45, 0.82, -0.35]}>
        <mesh castShadow>
          <boxGeometry args={[0.75, 0.52, 0.48]} />
          <meshStandardMaterial color="#242d38" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.27, 0.01]}>
          <boxGeometry args={[0.73, 0.025, 0.46]} />
          <meshStandardMaterial color="#c6a15b" metalness={0.6} roughness={0.3} />
        </mesh>
      </group>
    </group>
  )
}

function PackingMaterials() {
  return (
    <group position={[6.2, 0, 0]}>
      <CardboardBox size={[1.1, 1.05, 0.9]} shade="#c18e5c" />
      <group position={[1.45, 0, 0.3]} rotation={[0, 0, -0.1]}>
        <mesh position={[0, 0.24, 0]} castShadow>
          <boxGeometry args={[1.45, 0.12, 0.98]} />
          <meshStandardMaterial color="#c9c8c2" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0.38, 0]} castShadow>
          <boxGeometry args={[1.45, 0.15, 0.98]} />
          <meshStandardMaterial color="#f0eee8" roughness={0.86} />
        </mesh>
        <mesh position={[0, 0.52, 0]} castShadow>
          <boxGeometry args={[1.45, 0.12, 0.98]} />
          <meshStandardMaterial color="#c9c8c2" roughness={0.9} />
        </mesh>
      </group>
      <group position={[-1.45, 0, 0.3]}>
        <mesh position={[0, 0.55, 0]}>
          <cylinderGeometry args={[0.55, 0.55, 0.65, 32]} />
          <meshStandardMaterial color="#d4a848" roughness={0.74} />
        </mesh>
        <mesh position={[0, 0.55, 0.36]}>
          <cylinderGeometry args={[0.08, 0.08, 0.1, 12]} />
          <meshStandardMaterial color="#564b37" roughness={0.8} />
        </mesh>
      </group>
      <mesh position={[0, 1.15, 0.28]} rotation={[0.14, 0, -0.12]} castShadow>
        <boxGeometry args={[1.02, 0.72, 0.85]} />
        <meshStandardMaterial color="#aa7949" roughness={0.9} />
      </mesh>
      <mesh position={[0, 1.52, 0.28]} rotation={[0.14, 0, -0.12]}>
        <boxGeometry args={[0.17, 0.018, 0.82]} />
        <meshStandardMaterial color="#e0bd7b" roughness={0.76} />
      </mesh>
    </group>
  )
}

function Roadside() {
  return (
    <group>
      {Array.from({ length: 40 }, (_, index) => {
        const side = index % 2 === 0 ? -1 : 1
        const z = -36 + Math.floor(index / 2) * 5
        const x = side * (11 + (index % 3) * 2)
        return (
          <group key={index} position={[x, 0, z]} scale={0.72}>
            <mesh position={[0, 1.2, 0]} castShadow>
              <cylinderGeometry args={[0.13, 0.2, 2.4, 8]} />
              <meshStandardMaterial color="#75593f" roughness={0.92} />
            </mesh>
            <mesh position={[0, 2.85, 0]} castShadow>
              <coneGeometry args={[1.05, 2.2, 9]} />
              <meshStandardMaterial color={index % 3 === 0 ? '#456c5a' : '#355947'} roughness={0.92} />
            </mesh>
          </group>
        )
      })}
      {[-1, 1].map(side => (
        <mesh key={side} position={[side * 6.5, 0.3, 0]}>
          <boxGeometry args={[0.12, 0.6, 72]} />
          <meshStandardMaterial color="#c6a15b" roughness={0.72} />
        </mesh>
      ))}
    </group>
  )
}

function Road() {
  const road = useRef<THREE.Group>(null)
  useFrame(() => {
    if (road.current) road.current.position.x = truckPositionX(progress.value)
  })
  return (
    <group ref={road}>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.11, 0]} receiveShadow>
        <planeGeometry args={[120, 190]} />
        <meshStandardMaterial color="#66715e" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.06, 0]} receiveShadow>
        <planeGeometry args={[9.5, 190]} />
        <meshStandardMaterial color="#343a40" roughness={0.94} />
      </mesh>
      {Array.from({ length: 36 }, (_, index) => (
        <mesh key={index} position={[0, -0.045, -100 + index * 6]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.12, 2.6]} />
          <meshBasicMaterial color="#e6d49d" />
        </mesh>
      ))}
      {[-4.35, 4.35].map(x => (
        <mesh key={x} position={[x, -0.045, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.11, 190]} />
          <meshBasicMaterial color="#d2b875" />
        </mesh>
      ))}
      <Roadside />
    </group>
  )
}

function SceneRig({ reducedMotion, mobile }: { reducedMotion: boolean; mobile: boolean }) {
  useFrame(({ camera, clock }) => {
    const p = progress.value
    const stage = p * 8
    const offset = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.2) * 0.08
    const homeFocus = Math.max(
      smooth(clamp((stage - 2.7) / 0.45)) * (1 - smooth(clamp((stage - 4.75) / 0.4))),
      smooth(clamp((stage - 7.35) / 0.35)),
    )
    const targetX = truckPositionX(p) + homeFocus * 4.9
    const targetZ = roadTravel(p) - homeFocus * 0.35
    const targetY = stage === 0 ? 1.55 : 2.25
    const distance = mobile ? [10.5 + homeFocus * 4, 5.2 + homeFocus, 17 + homeFocus * 4] : [7 + homeFocus * 8, 4.4 + homeFocus, 12 + homeFocus * 6]
    const viewSide = homeFocus > 0.5 ? -1 : 1
    camera.position.lerp(new THREE.Vector3(targetX + viewSide * distance[0] + offset, targetY + distance[1], targetZ + distance[2]), 0.055)
    camera.lookAt(targetX, targetY, targetZ)
  })
  return null
}

function ProgressWorld({ reducedMotion, mobile }: { reducedMotion: boolean; mobile: boolean }) {
  const house = useRef<THREE.Group>(null)
  const office = useRef<THREE.Group>(null)
  const packing = useRef<THREE.Group>(null)
  const distantHills = useRef<THREE.Group>(null)
  const background = useRef<THREE.Color>(null)
  const fog = useRef<THREE.Fog>(null)
  const dayColor = useMemo(() => new THREE.Color('#182539'), [])
  const eveningColor = useMemo(() => new THREE.Color('#4b4039'), [])

  useFrame(() => {
    const stage = progress.value * 8
    const routePosition = roadTravel(progress.value)
    const roadsideX = truckPositionX(progress.value) + 8.5
    if (house.current) house.current.position.set(roadsideX, 0, routePosition - 0.5)
    if (office.current) office.current.position.set(roadsideX, 0, routePosition)
    if (packing.current) packing.current.position.set(roadsideX, 0, routePosition)
    if (house.current) house.current.visible = (stage >= 2.75 && stage < 5.05) || (stage >= 7.45 && stage <= 8.05)
    if (office.current) office.current.visible = stage >= 4.7 && stage < 6.05
    if (packing.current) packing.current.visible = stage >= 5.72 && stage < 7.1
    if (distantHills.current) distantHills.current.visible = stage >= 6.7 && stage < 8.1
    const evening = smooth((stage - 6.7) / 1.3)
    background.current?.lerpColors(dayColor, eveningColor, evening)
    if (fog.current) {
      fog.current.color.copy(background.current ?? dayColor)
      fog.current.near = 24 - evening * 7
      fog.current.far = 72 - evening * 17
    }
  })

  return (
    <>
      <color ref={background} attach="background" args={['#182539']} />
      <fog ref={fog} attach="fog" args={['#182539', 24, 72]} />
      <ambientLight intensity={0.95} color="#dce4ed" />
      <hemisphereLight args={['#d9e7ff', '#4b5144', 0.8]} />
      <directionalLight castShadow position={[4, 11, 6]} intensity={2.2} color="#ffe6bd" shadow-mapSize-width={mobile ? 768 : 2048} shadow-mapSize-height={mobile ? 768 : 2048} />
      <directionalLight position={[-7, 5, -6]} intensity={0.85} color="#b2cce6" />
      <Road />
      <Truck reducedMotion={reducedMotion} />
      <FloatingBoxes count={mobile ? 7 : 12} reducedMotion={reducedMotion} />
      <group ref={house}><FurnishedHome /><HomeCrew reducedMotion={reducedMotion} /></group>
      <group ref={office}><Office /></group>
      <group ref={packing}><PackingMaterials /></group>
      <group ref={distantHills}>
        {[-1, 1].map(side => [0, 1, 2].map(index => (
          <mesh key={`${side}-${index}`} position={[side * (15 + index * 5), 1.5 + index * 0.8, -8 + index * 15]} scale={[5 + index, 2 + index * 0.65, 1]}>
            <coneGeometry args={[1, 2, 7]} />
            <meshStandardMaterial color={index === 0 ? '#92826e' : '#706c64'} roughness={1} />
          </mesh>
        )))}
      </group>
      <SceneRig reducedMotion={reducedMotion} mobile={mobile} />
    </>
  )
}

function hasWebGL() {
  try {
    return !!document.createElement('canvas').getContext('webgl2')
  } catch {
    return false
  }
}

export default function Scene() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 768)
  const [reducedMotion, setReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches)

  useEffect(() => {
    const update = () => {
      const story = document.getElementById('story')
      if (!story) {
        progress.value = 0
        return
      }
      const top = story.getBoundingClientRect().top + window.scrollY
      const range = Math.max(1, story.offsetHeight - window.innerHeight)
      progress.value = clamp((window.scrollY - top) / range)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    const resize = () => {
      setMobile(window.innerWidth < 768)
      update()
    }
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateMotionPreference = () => setReducedMotion(motionPreference.matches)
    window.addEventListener('resize', resize)
    motionPreference.addEventListener('change', updateMotionPreference)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', resize)
      motionPreference.removeEventListener('change', updateMotionPreference)
    }
  }, [])

  if (!hasWebGL()) return <div className="scene-fallback" aria-label="DHA Movers & Packers moving truck" />
  return (
    <div className="scene" aria-hidden="true">
      <Canvas shadows={!mobile} dpr={[1, mobile ? 1.35 : 2]} camera={{ fov: 43, position: [10, 6, 11], near: 0.1, far: 180 }}>
        <ProgressWorld reducedMotion={reducedMotion} mobile={mobile} />
      </Canvas>
    </div>
  )
}

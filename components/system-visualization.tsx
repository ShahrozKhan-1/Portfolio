"use client"

import { Canvas, useFrame } from "@react-three/fiber"
import { Float, OrbitControls, Sparkles } from "@react-three/drei"
import { useRef } from "react"
import * as THREE from "three"

function Core() {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.16
      ref.current.rotation.y += delta * 0.28
    }
  })
  return <mesh ref={ref}>
    <icosahedronGeometry args={[0.72, 1]} />
    <meshStandardMaterial color="#62e6e0" emissive="#164f55" emissiveIntensity={1.8} roughness={0.25} metalness={0.55} wireframe />
  </mesh>
}

function Orbit({ radius, speed, tilt, color }: { radius: number; speed: number; tilt: number; color: string }) {
  const ref = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.z += delta * speed
  })
  return <group ref={ref} rotation={[tilt, tilt * 0.4, 0]}>
    <mesh position={[radius, 0, 0]}>
      <sphereGeometry args={[0.07, 16, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <torusGeometry args={[radius, 0.008, 8, 96]} />
      <meshBasicMaterial color={color} transparent opacity={0.38} />
    </mesh>
  </group>
}

function Scene() {
  return <>
    <ambientLight intensity={0.5} />
    <pointLight position={[2, 2, 3]} color="#62e6e0" intensity={4} />
    <pointLight position={[-3, -1, 1]} color="#e7b86b" intensity={2} />
    <Float speed={1.2} rotationIntensity={0.15} floatIntensity={0.25}>
      <Core />
      <Orbit radius={1.2} speed={0.4} tilt={0.4} color="#62e6e0" />
      <Orbit radius={1.65} speed={-0.22} tilt={-0.8} color="#e7b86b" />
      <Orbit radius={2.05} speed={0.12} tilt={1.1} color="#9a9aaa" />
    </Float>
    <Sparkles count={38} scale={5.2} size={1.4} speed={0.25} color="#62e6e0" />
    <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.35} minPolarAngle={Math.PI / 2.4} maxPolarAngle={Math.PI / 1.8} />
  </>
}

export function SystemVisualization() {
  return <div className="system-visualization" aria-label="Interactive visualization of interconnected software systems" role="img">
    <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5.2], fov: 38 }}>
      <Scene />
    </Canvas>
    <div className="system-visual-label"><span className="status-dot" /> live system map <small>drag to inspect</small></div>
  </div>
}

export default SystemVisualization

'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Monogram() {
  const group = useRef<THREE.Group>(null)
  const core = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    if (!group.current || !core.current) return
    group.current.rotation.y += delta * 0.22
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.12
    core.current.rotation.z -= delta * 0.35
    core.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.8) * 0.035)
  })

  return (
    <group ref={group} position={[2.7, 0.35, -1.2]} scale={1.35}>
      <mesh ref={core}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshStandardMaterial color="#8b5cf6" emissive="#6d28d9" emissiveIntensity={1.8} roughness={0.22} metalness={0.7} wireframe />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.65, 0.035, 12, 96]} />
        <meshBasicMaterial color="#22d3ee" transparent opacity={0.8} />
      </mesh>
      <mesh rotation={[0, Math.PI / 3, Math.PI / 5]}>
        <torusGeometry args={[1.9, 0.018, 8, 96]} />
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.65} />
      </mesh>
      <mesh position={[0, 0, 0.2]}>
        <octahedronGeometry args={[0.64, 0]} />
        <meshStandardMaterial color="#22d3ee" emissive="#0891b2" emissiveIntensity={1.4} roughness={0.18} metalness={0.8} />
      </mesh>
    </group>
  )
}

'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const symbols = ['{ }', '< />', '=>', 'def', '01', '()']

export default function CodeParticles() {
  const points = useRef<THREE.Points>(null)
  const count = 240
  const [positions, colors] = useMemo(() => {
    const positionArray = new Float32Array(count * 3)
    const colorArray = new Float32Array(count * 3)
    const violet = new THREE.Color('#a78bfa')
    const cyan = new THREE.Color('#22d3ee')

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3
      positionArray[i3] = (Math.random() - 0.5) * 14
      positionArray[i3 + 1] = (Math.random() - 0.5) * 9
      positionArray[i3 + 2] = (Math.random() - 0.5) * 6 - 1
      const color = i % 3 === 0 ? cyan : violet
      color.toArray(colorArray, i3)
    }

    return [positionArray, colorArray]
  }, [])

  useFrame((state, delta) => {
    if (!points.current) return
    points.current.rotation.y += delta * 0.018
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.12) * 0.06
    points.current.position.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.18
  })

  return (
    <points ref={points} position={[0, 0, -2]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.045} vertexColors transparent opacity={0.75} sizeAttenuation blending={THREE.AdditiveBlending} />
    </points>
  )
}

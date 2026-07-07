'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const STATIC_PULSES = Array.from({ length: 15 }, () => ({
  direction: Math.random() > 0.5 ? 'horizontal' : 'vertical',
  lineIndex: Math.floor(Math.random() * 14),
  speed: Math.random() * 2 + 1,
  progress: Math.random(),
  size: Math.random() * 0.05 + 0.03,
}));

export default function ThreadWeave() {
  const groupRef = useRef<THREE.Group>(null);
  const pulseGroupRef = useRef<THREE.Group>(null);

  // Grid coordinates
  const threadsCount = 14;
  const spacing = 0.55;

  const threads = useMemo(() => {
    const list = [];
    const halfSize = ((threadsCount - 1) * spacing) / 2;

    for (let i = 0; i < threadsCount; i++) {
      const coord = i * spacing - halfSize;
      
      // Horizontal thread parameters
      list.push({
        id: `h-${i}`,
        type: 'horizontal',
        position: [0, coord, 0] as [number, number, number],
        rotation: [0, 0, Math.PI / 2] as [number, number, number],
        coord,
      });

      // Vertical thread parameters
      list.push({
        id: `v-${i}`,
        type: 'vertical',
        position: [coord, 0, 0.05] as [number, number, number], // offset z slightly for weave overlap
        rotation: [0, 0, 0] as [number, number, number],
        coord,
      });
    }
    return list;
  }, []);

  // Moving glowing light pulses along the thread lines
  const pulses = useMemo(() => STATIC_PULSES.map(p => ({ ...p })), []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    
    // Rotate entire grid slowly for cinematic view
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(time * 0.05) * 0.15;
      groupRef.current.rotation.y = Math.cos(time * 0.08) * 0.2;
    }

    // Animate the light pulses along the thread lines
    if (pulseGroupRef.current) {
      const children = pulseGroupRef.current.children;
      pulses.forEach((p, idx) => {
        const mesh = children[idx] as THREE.Mesh;
        if (!mesh) return;

        p.progress += delta * p.speed * 0.15;
        if (p.progress > 1) p.progress = 0;

        const halfSize = ((threadsCount - 1) * spacing) / 2;
        const linePos = p.lineIndex * spacing - halfSize;
        const traversePos = p.progress * (halfSize * 2) - halfSize;

        if (p.direction === 'horizontal') {
          mesh.position.set(traversePos, linePos, 0.08);
        } else {
          mesh.position.set(linePos, traversePos, 0.12);
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.3} />
      <directionalLight position={[2, 3, 5]} intensity={1.5} color="#ebdcb9" />
      <pointLight position={[-2, -3, -4]} intensity={0.5} color="#d4af37" />

      {/* Thread meshes forming a weave */}
      {threads.map((t) => (
        <mesh key={t.id} position={t.position} rotation={t.rotation}>
          <cylinderGeometry args={[0.025, 0.025, 8, 8]} />
          <meshPhysicalMaterial
            color={t.type === 'horizontal' ? '#faf8f5' : '#ebdcb9'}
            roughness={0.9}
            metalness={0.1}
            sheen={1.0}
            sheenColor={new THREE.Color('#d4af37')}
          />
        </mesh>
      ))}

      {/* Floating glowing light pulses */}
      <group ref={pulseGroupRef}>
        {pulses.map((p, idx) => (
          <mesh key={idx}>
            <sphereGeometry args={[p.size, 8, 8]} />
            <meshBasicMaterial color="#d4af37" />
          </mesh>
        ))}
      </group>
    </group>
  );
}

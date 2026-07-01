'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function FabricMacro() {
  const groupRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);

  // Generate detailed waving weave paths
  const gridSize = 24;
  const spacing = 0.28;

  const threads = useMemo(() => {
    const arr = [];
    const half = ((gridSize - 1) * spacing) / 2;

    for (let i = 0; i < gridSize; i++) {
      const coord = i * spacing - half;

      // Vertical (warp) thread paths
      const warpPoints = [];
      for (let y = -4; y <= 4; y += 0.4) {
        // Interlaces under and over horizontal threads
        // The sine wave cycles based on height y and index i
        const z = Math.sin((y * Math.PI) / spacing + i * Math.PI) * 0.055;
        warpPoints.push(new THREE.Vector3(coord, y, z));
      }
      const warpCurve = new THREE.CatmullRomCurve3(warpPoints);
      arr.push({ id: `warp-${i}`, curve: warpCurve, color: '#faf8f5' });

      // Horizontal (weft) thread paths
      const weftPoints = [];
      for (let x = -4; x <= 4; x += 0.4) {
        // Interlaces opposite to the warp
        const z = -Math.sin((x * Math.PI) / spacing + i * Math.PI) * 0.055;
        weftPoints.push(new THREE.Vector3(x, coord, z));
      }
      const weftCurve = new THREE.CatmullRomCurve3(weftPoints);
      arr.push({ id: `weft-${i}`, curve: weftCurve, color: '#ebdcb9' });
    }

    return arr;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Slow camera panning and slight mesh float
    if (groupRef.current) {
      groupRef.current.position.z = Math.sin(time * 0.2) * 0.1;
      groupRef.current.rotation.x = 0.35 + Math.sin(time * 0.05) * 0.05;
      groupRef.current.rotation.y = -0.3 + Math.cos(time * 0.05) * 0.05;
    }

    // Dynamic light tracking mouse slightly or drifting automatically
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(time * 0.8) * 3;
      lightRef.current.position.y = Math.cos(time * 0.6) * 3;
    }
  });

  return (
    <group ref={groupRef} scale={1.2}>
      <ambientLight intensity={0.2} />
      
      {/* Dynamic spotlight generating specular highlights on the fabric thread weaves */}
      <pointLight
        ref={lightRef}
        position={[0, 0, 3]}
        intensity={2.5}
        distance={10}
        color="#ebdcb9"
        decay={1}
      />
      <directionalLight position={[5, -5, 2]} intensity={0.6} color="#d4af37" />

      {threads.map((t) => (
        <mesh key={t.id}>
          <tubeGeometry args={[t.curve, 32, 0.045, 8, false]} />
          <meshPhysicalMaterial
            color={t.color}
            roughness={0.9}
            metalness={0.0}
            sheen={1.0}
            sheenColor={new THREE.Color('#d4af37')}
            sheenRoughness={0.4}
            clearcoat={0.15}
            clearcoatRoughness={0.3}
          />
        </mesh>
      ))}
    </group>
  );
}

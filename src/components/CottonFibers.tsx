'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function CottonFibers() {
  const groupRef = useRef<THREE.Group>(null);

  // Generate random curves representing cotton micro-fibers
  const fibers = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 25; i++) {
      const points = [];
      const startX = (Math.random() - 0.5) * 8;
      const startY = (Math.random() - 0.5) * 8;
      const startZ = (Math.random() - 0.5) * 4;
      
      points.push(new THREE.Vector3(startX, startY, startZ));
      points.push(new THREE.Vector3(
        startX + (Math.random() - 0.5) * 3,
        startY + (Math.random() - 0.5) * 4 + 2,
        startZ + (Math.random() - 0.5) * 2
      ));
      points.push(new THREE.Vector3(
        startX + (Math.random() - 0.5) * 4,
        startY + (Math.random() - 0.5) * 5 + 4,
        startZ + (Math.random() - 0.5) * 3
      ));

      const curve = new THREE.CatmullRomCurve3(points);
      
      arr.push({
        curve,
        thickness: Math.random() * 0.04 + 0.015,
        speed: Math.random() * 0.2 + 0.05,
        offset: Math.random() * Math.PI,
        opacity: Math.random() * 0.4 + 0.2,
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (groupRef.current) {
      // Slow organic rotation
      groupRef.current.rotation.y = Math.sin(time * 0.1) * 0.3;
      groupRef.current.rotation.x = Math.cos(time * 0.08) * 0.2;
      
      // Floating wave animation on children
      groupRef.current.children.forEach((child, i) => {
        const fiber = fibers[i];
        if (fiber) {
          child.position.y = Math.sin(time * fiber.speed + fiber.offset) * 0.15;
          child.position.x = Math.cos(time * 0.1 + i) * 0.1;
        }
      });
    }
  });

  return (
    <group ref={groupRef}>
      {/* Ambient lighting to illuminate fibers */}
      <ambientLight intensity={0.4} />
      <pointLight position={[5, 5, 5]} intensity={1.5} color="#ebdcb9" />
      <pointLight position={[-5, -5, -5]} intensity={0.8} color="#d4af37" />

      {fibers.map((f, i) => (
        <mesh key={i}>
          <tubeGeometry args={[f.curve, 20, f.thickness, 8, false]} />
          <meshPhysicalMaterial
            color="#faf8f5"
            roughness={0.9}
            metalness={0.0}
            transparent
            opacity={f.opacity}
            transmission={0.8} // makes fibers look glass-like and delicate
            thickness={0.2}
            sheen={1.0}
            sheenColor={new THREE.Color('#d4af37')}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

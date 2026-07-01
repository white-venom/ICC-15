'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Shirt3DProps {
  color?: string;
  metalness?: number;
  roughness?: number;
  sheen?: number;
  sheenColor?: string;
  foldProgress?: number; // 0 to 1 for buy/fold animation
  focusArea?: 'all' | 'collar' | 'sleeve' | 'button';
  waveIntensity?: number;
}

export default function Shirt3D({
  color = '#faf8f5',
  metalness = 0.05,
  roughness = 0.85,
  sheen = 0.9,
  sheenColor = '#ffffff',
  foldProgress = 0,
  focusArea = 'all',
  waveIntensity = 0.15,
}: Shirt3DProps) {
  const shirtGroup = useRef<THREE.Group>(null);
  
  // Keep references to animate the fabric wave
  const torsoRef = useRef<THREE.Mesh>(null);
  const leftSleeveRef = useRef<THREE.Mesh>(null);
  const rightSleeveRef = useRef<THREE.Mesh>(null);

  // Memoize materials to save draw calls
  const fabricMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color),
      roughness: roughness,
      metalness: metalness,
      clearcoat: 0.1,
      clearcoatRoughness: 0.4,
      sheen: sheen,
      sheenColor: new THREE.Color(sheenColor),
      sheenRoughness: 0.6,
      side: THREE.DoubleSide,
      flatShading: false,
    });
  }, [color, roughness, metalness, sheen, sheenColor]);

  const buttonMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#ebdcb9'), // Gold champagne buttons
      roughness: 0.1,
      metalness: 0.95,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });
  }, []);

  const placketMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(color).clone().multiplyScalar(0.95), // slightly darker contrast
      roughness: roughness + 0.05,
      metalness: metalness,
      sheen: sheen * 0.8,
    });
  }, [color, roughness, metalness, sheen]);

  // Handle gentle cloth waving physics on frame loop
  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    
    // Default rotation and float
    if (shirtGroup.current && foldProgress === 0) {
      // Gentle floating up and down
      shirtGroup.current.position.y = Math.sin(time * 0.8) * 0.15;
      
      // Auto-rotation when not inspected closely
      if (focusArea === 'all') {
        shirtGroup.current.rotation.y = time * 0.12;
      } else {
        // Slow damp toward focus positions
        shirtGroup.current.rotation.y = THREE.MathUtils.lerp(shirtGroup.current.rotation.y, 0, 0.05);
      }
    }

    // Fabric vertex animation
    if (waveIntensity > 0) {
      [torsoRef, leftSleeveRef, rightSleeveRef].forEach((ref) => {
        if (ref.current && ref.current.geometry) {
          const geom = ref.current.geometry;
          const pos = geom.attributes.position;
          
          // Modify vertices with custom wave noise
          for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const y = pos.getY(i);
            const z = pos.getZ(i);
            
            // Generate waving displacement based on vertex height and time
            const wave = Math.sin(y * 1.5 + time * 1.8) * Math.cos(x * 1.2 + time * 1.2) * waveIntensity * 0.05;
            
            // Shift vertices slightly outward along radial axes
            if (ref === torsoRef) {
              pos.setZ(i, z + wave);
            } else {
              pos.setX(i, x + wave);
            }
          }
          pos.needsUpdate = true;
        }
      });
    }

    // Purchase fold simulation
    if (shirtGroup.current && foldProgress > 0) {
      // Shrink and flatten group
      shirtGroup.current.scale.setScalar(THREE.MathUtils.lerp(shirtGroup.current.scale.x, 1 - foldProgress, 0.1));
      shirtGroup.current.rotation.x = THREE.MathUtils.lerp(shirtGroup.current.rotation.x, foldProgress * Math.PI * 0.5, 0.1);
      shirtGroup.current.rotation.y = THREE.MathUtils.lerp(shirtGroup.current.rotation.y, foldProgress * Math.PI * 0.5, 0.1);
    }
  });

  // Calculate focal transforms
  const groupOffset = useMemo(() => {
    switch (focusArea) {
      case 'collar':
        return { pos: [0, -1.8, 2], rot: [0.1, 0, 0] };
      case 'sleeve':
        return { pos: [-1.8, 0, 1.5], rot: [0, 0.5, -0.2] };
      case 'button':
        return { pos: [0, 0.5, 2.2], rot: [0, 0, 0] };
      default:
        return { pos: [0, 0, 0], rot: [0, 0, 0] };
    }
  }, [focusArea]);

  return (
    <group
      ref={shirtGroup}
      position={[groupOffset.pos[0], groupOffset.pos[1], groupOffset.pos[2]]}
      rotation={[groupOffset.rot[0], groupOffset.rot[1], groupOffset.rot[2]]}
    >
      {/* TORSO */}
      <mesh ref={torsoRef} material={fabricMaterial} castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.3, 3.6, 32, 16, true]} />
      </mesh>

      {/* PLACKET (Front Button strip) */}
      <mesh position={[0, 0, 1.25]} material={placketMaterial} castShadow>
        <boxGeometry args={[0.18, 3.6, 0.08]} />
      </mesh>

      {/* COLLAR BASE */}
      <group position={[0, 1.85, 0]}>
        <mesh material={fabricMaterial} castShadow>
          <cylinderGeometry args={[0.55, 0.6, 0.35, 32, 4, true]} />
        </mesh>
        
        {/* COLLAR FOLDS (Visual representation) */}
        <mesh position={[0, -0.05, 0.1]} rotation={[0.15, 0, 0]} material={fabricMaterial} castShadow>
          <cylinderGeometry args={[0.62, 0.66, 0.28, 32, 4, true, -Math.PI * 0.95, Math.PI * 1.9]} />
        </mesh>
      </group>

      {/* LEFT SLEEVE */}
      <group position={[1.4, 1.2, 0]} rotation={[0, 0, -0.65]}>
        <mesh ref={leftSleeveRef} material={fabricMaterial} castShadow>
          <cylinderGeometry args={[0.38, 0.28, 2.0, 16, 8, true]} />
        </mesh>
        {/* Left Cuff */}
        <mesh position={[0, -1.05, 0]} material={fabricMaterial} castShadow>
          <cylinderGeometry args={[0.29, 0.3, 0.25, 16]} />
        </mesh>
      </group>

      {/* RIGHT SLEEVE */}
      <group position={[-1.4, 1.2, 0]} rotation={[0, 0, 0.65]}>
        <mesh ref={rightSleeveRef} material={fabricMaterial} castShadow>
          <cylinderGeometry args={[0.38, 0.28, 2.0, 16, 8, true]} />
        </mesh>
        {/* Right Cuff */}
        <mesh position={[0, -1.05, 0]} material={fabricMaterial} castShadow>
          <cylinderGeometry args={[0.29, 0.3, 0.25, 16]} />
        </mesh>
      </group>

      {/* BUTTONS */}
      {[0.9, 0.3, -0.3, -0.9, -1.5].map((yOffset, i) => (
        <mesh
          key={i}
          position={[0, yOffset, 1.3]}
          rotation={[Math.PI / 2, 0, 0]}
          material={buttonMaterial}
          castShadow
        >
          <cylinderGeometry args={[0.05, 0.05, 0.03, 12]} />
        </mesh>
      ))}

      {/* HEM CURVES (Bottom of shirt) */}
      <mesh position={[0, -1.82, 0]} material={fabricMaterial}>
        <cylinderGeometry args={[1.3, 1.3, 0.06, 32, 1, false]} />
      </mesh>
    </group>
  );
}

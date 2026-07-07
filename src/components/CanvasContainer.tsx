'use client';

import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Center } from '@react-three/drei';
import * as THREE from 'three';

import Shirt3D from './Shirt3D';
import CottonFibers from './CottonFibers';
import ThreadWeave from './ThreadWeave';
import FabricMacro from './FabricMacro';

interface CanvasContainerProps {
  activeSection: string; // 'hero' | 'cotton' | 'thread' | 'fabric' | 'craftsmanship' | 'gentleman' | 'collection-white' | 'collection-black' | 'collection-blue' | 'buy'
  focusArea?: 'all' | 'collar' | 'sleeve' | 'button';
  foldProgress?: number; // 0 to 1
}

// 1. Global Interactive Light & Camera Rig
function SceneRig({
  activeSection,
  focusArea = 'all',
}: {
  activeSection: string;
  focusArea: 'all' | 'collar' | 'sleeve' | 'button';
}) {
  useThree(); // Initialize inside fiber context
  const spotlightRef = useRef<THREE.SpotLight>(null);

  useFrame((state) => {
    const { camera } = state;
    const time = state.clock.getElapsedTime();
    const pointer = state.pointer; // Normalized mouse coordinates [-1, 1]

    // Set camera base coordinates based on scroll section
    let targetX = 0;
    const targetY = 0;
    let targetZ = 5;

    if (activeSection === 'cotton') {
      targetZ = 4.5;
    } else if (activeSection === 'thread') {
      targetZ = 5.2;
    } else if (activeSection === 'fabric') {
      targetZ = 3.2;
    } else if (activeSection === 'craftsmanship') {
      // Offset slightly to the left to balance details UI on the right
      targetX = -1.2;
      targetZ = 4.8;
    } else if (activeSection.startsWith('collection')) {
      targetX = -1.0; // Left offset for editorial layout
      targetZ = 4.8;
    } else if (activeSection === 'buy') {
      targetX = 0;
      targetZ = 5;
    }

    // Add subtle camera reaction to mouse movement
    const cameraMouseX = targetX + pointer.x * 0.6;
    const cameraMouseY = targetY + pointer.y * 0.4;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, cameraMouseX, 0.05);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, cameraMouseY, 0.05);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.05);
    camera.lookAt(targetX, 0, 0);

    // Make spotlight follow the mouse cursor dynamically
    if (spotlightRef.current) {
      spotlightRef.current.position.x = pointer.x * 3.5;
      spotlightRef.current.position.y = pointer.y * 3.5 + 4;
    }
  });

  // Render atmospheric volumetric lighting setup
  const lightColor = activeSection === 'collection-blue'
    ? '#4169e1' // Royal blue light
    : activeSection === 'collection-black'
    ? '#e0e0e0' // Dramatic silver spotlight
    : '#ebdcb9'; // Warm luxury champagne/gold

  return (
    <>
      <ambientLight intensity={activeSection === 'collection-black' ? 0.05 : 0.15} />
      <directionalLight position={[-5, 5, 2]} intensity={0.5} color="#ffffff" />
      
      <spotLight
        ref={spotlightRef}
        position={[0, 5, 5]}
        angle={0.6}
        penumbra={0.9}
        intensity={activeSection === 'collection-black' ? 4.5 : 2.5}
        color={lightColor}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
    </>
  );
}

const PARTICLE_COUNT = 120;
const [STATIC_POSITIONS, STATIC_SPEEDS] = (() => {
  const pos = new Float32Array(PARTICLE_COUNT * 3);
  const spd = new Float32Array(PARTICLE_COUNT);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 10;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 5;
    spd[i] = Math.random() * 0.005 + 0.002;
  }
  return [pos, spd];
})();

// 2. Global Soft Ambient Particles
function AmbientParticles() {
  const pointsRef = useRef<THREE.Points>(null);

  const [positions] = React.useState(() => new Float32Array(STATIC_POSITIONS));
  const [speeds] = React.useState(() => new Float32Array(STATIC_SPEEDS));

  useFrame(() => {
    if (pointsRef.current) {
      const geo = pointsRef.current.geometry;
      const posAttr = geo.attributes.position;
      
      for (let i = 0; i < posAttr.count; i++) {
        let y = posAttr.getY(i);
        // Drift particles upward
        y += speeds[i];
        if (y > 5) {
          y = -5; // reset bottom
        }
        posAttr.setY(i, y);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#d4af37"
        size={0.025}
        transparent
        opacity={0.35}
        depthWrite={false}
      />
    </points>
  );
}

// 3. Main Container Component
export default function CanvasContainer({
  activeSection,
  focusArea = 'all',
  foldProgress = 0,
}: CanvasContainerProps) {
  
  // Decide which 3D model properties are needed based on collection type
  const isShirtVisible =
    activeSection === 'hero' ||
    activeSection === 'craftsmanship' ||
    activeSection.startsWith('collection') ||
    activeSection === 'buy';

  const shirtColor =
    activeSection === 'collection-black'
      ? '#080808'
      : activeSection === 'collection-blue'
      ? '#0f1a30' // Royal Dark Navy
      : '#faf8f5'; // White/Ivory

  const shirtMetalness = activeSection === 'collection-black' ? 0.2 : 0.05;
  const shirtRoughness = activeSection === 'collection-black' ? 0.6 : 0.85;

  return (
    <div className="fixed inset-0 w-full h-full z-[2] pointer-events-none bg-transparent">
      <Canvas
        shadows
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ pointerEvents: 'auto' }}
        data-cursor="interactive-3d"
      >
        {/* Particle Cloud */}
        <AmbientParticles />

        {/* Dynamic Light Rig */}
        <SceneRig activeSection={activeSection} focusArea={focusArea} />

        {/* 3D Scene Selector */}
        <Center>
          {isShirtVisible && (
            <Shirt3D
              color={shirtColor}
              metalness={shirtMetalness}
              roughness={shirtRoughness}
              focusArea={focusArea}
              foldProgress={foldProgress}
              waveIntensity={activeSection === 'hero' ? 0.18 : 0.05}
            />
          )}

          {activeSection === 'cotton' && <CottonFibers />}
          {activeSection === 'thread' && <ThreadWeave />}
          {activeSection === 'fabric' && <FabricMacro />}
        </Center>
      </Canvas>
    </div>
  );
}

"use client";

import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { Tin } from "./Tin";
import { Frost } from "./Frost";

interface TinSceneProps {
  progress: number;
  brandName?: string;
  brandColor?: string;
  prefersReducedMotion?: boolean;
}

function LightingRig({ progress }: { progress: number }) {
  const keyLightColor = useMemo(() => {
    const warm = new THREE.Color("#f8fafc");
    const ice = new THREE.Color("#bae6fd");
    return warm.lerp(ice, progress);
  }, [progress]);

  return (
    <>
      <ambientLight intensity={0.6 + progress * 0.2} color="#f0f9ff" />
      <directionalLight
        position={[4, 6, 4]}
        intensity={2.4}
        color={keyLightColor}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />
      <directionalLight position={[-4, 2, -2]} intensity={1.4} color="#38bdf8" />
      <spotLight position={[2, 4, -4]} intensity={2.8} angle={0.6} penumbra={0.8} color="#fde047" />
      <pointLight position={[0, -2, 2]} intensity={0.6} color="#7dd3fc" />
    </>
  );
}

export function TinScene({
  progress,
  brandName = "AURA",
  brandColor = "#0284c7",
  prefersReducedMotion = false,
}: TinSceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5.0], fov: 42 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        shadows
      >
        <LightingRig progress={progress} />
        <Suspense fallback={null}>
          <group position={[0, -0.1, 0]}>
            <Tin
              progress={progress}
              brandName={brandName}
              brandColor={brandColor}
              prefersReducedMotion={prefersReducedMotion}
            />
            <Frost progress={progress} canRadius={0.94} canHeight={3.6} maxBeads={52} />
          </group>
          <Environment preset="city" />
        </Suspense>
        <ContactShadows
          position={[0, -1.9, 0]}
          opacity={0.65}
          scale={7}
          blur={2.4}
          far={3}
          color="#030712"
        />
      </Canvas>
    </div>
  );
}

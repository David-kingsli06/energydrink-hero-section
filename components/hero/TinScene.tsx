"use client";

import React, { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { LumenLens } from "./Tin";

interface LensSceneProps {
  progress: number;
  prefersReducedMotion?: boolean;
}

/**
 * Lighting Rig calibrated for optical precision:
 * Lower key SpotLight by ~40% so reflections emanate organically
 * from the HDR environment rather than blow-out points.
 */
function OpticalLightingRig() {
  return (
    <>
      {/* Soft fill illumination */}
      <ambientLight intensity={0.5} color="#f8fafc" />

      {/* Reduced Key SpotLight (lowered by 40% to prevent hot specular bloom blowout) */}
      <spotLight
        position={[4, 5, 5]}
        intensity={1.7} // Reduced from 2.8+
        angle={0.55}
        penumbra={0.9}
        color="#fffbeb"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0001}
      />

      {/* Warm accent rim light for barrel silhouette separation */}
      <directionalLight
        position={[-3, 2, -3]}
        intensity={0.8}
        color="#fef08a"
      />

      {/* Cool opposing studio fill */}
      <directionalLight
        position={[-4, -1, 3]}
        intensity={0.6}
        color="#cbd5e1"
      />
    </>
  );
}

export function TinScene({ progress, prefersReducedMotion = false }: LensSceneProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        // Camera positioned back so lens fits comfortably within ~70% viewport height
        // FOV 38 degrees (between 35 and 40) for minimal perspective distortion
        camera={{ position: [0, 0, 7.2], fov: 38 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 0.95, // Exposure tuned around 0.95
        }}
        shadows
      >
        <OpticalLightingRig />

        <Suspense fallback={null}>
          {/* Offset the lens to the right of center (~60% across screen = x offset ~1.35) */}
          <group position={[1.35, 0, 0]}>
            <LumenLens
              progress={progress}
              prefersReducedMotion={prefersReducedMotion}
            />
          </group>

          {/* Slightly increased environment intensity for rich organic reflections */}
          <Environment preset="studio" environmentIntensity={1.25} />
        </Suspense>

        {/* Soft floor plane contact shadow */}
        <ContactShadows
          position={[1.35, -1.65, 0]}
          opacity={0.55}
          scale={8}
          blur={2.6}
          far={3.2}
          color="#020617"
        />
      </Canvas>
    </div>
  );
}

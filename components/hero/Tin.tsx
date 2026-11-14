"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface LensProps {
  progress: number;
  prefersReducedMotion?: boolean;
}

/**
 * Creates high-contrast engraved barrel texture for the focus & aperture rings
 * on a single continuous coaxial cylinder.
 */
function createBarrelMarkingsTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // Anodized matte black barrel body
    ctx.fillStyle = "#121316";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle micro-machined radial ribbing/knurling lines on focus ring area
    ctx.strokeStyle = "rgba(255, 255, 255, 0.07)";
    ctx.lineWidth = 2;
    for (let x = 0; x < canvas.width; x += 12) {
      ctx.beginPath();
      ctx.moveTo(x, 260);
      ctx.lineTo(x, 560);
      ctx.stroke();
    }

    // High contrast engraved distance scales
    ctx.font = "bold 26px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // White distance markings (meters & feet)
    const markings = ["0.85m", "1.0m", "1.2m", "1.5m", "2.0m", "3.0m", "5.0m", "∞"];
    const step = canvas.width / markings.length;

    markings.forEach((m, idx) => {
      const x = idx * step + step / 2;
      // Index tick mark
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(x - 2, 210, 4, 20);

      // Label
      ctx.fillStyle = m === "∞" || m === "0.85m" ? "#f59e0b" : "#f1f5f9"; // Amber accent on key markings
      ctx.fillText(m, x, 245);
    });

    // Front badge engravings
    ctx.fillStyle = "#f59e0b"; // Warm amber signature badge
    ctx.font = "bold 32px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText("LUMEN OPTICS  •  85mm F/1.4  •  NANO COATING", canvas.width / 2, 120);

    // Aperture f-stop ring engravings
    const fStops = ["1.4", "2.0", "2.8", "4.0", "5.6", "8.0", "11", "16"];
    const fStep = canvas.width / fStops.length;
    fStops.forEach((f, idx) => {
      const x = idx * fStep + fStep / 2;
      ctx.fillStyle = f === "1.4" ? "#f59e0b" : "#e2e8f0";
      ctx.fillText(`f/${f}`, x, 620);
      ctx.fillRect(x - 1.5, 590, 3, 14);
    });
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  return texture;
}

/**
 * Continuous LatheGeometry profile:
 * Built on a single continuous coaxial axis (z-axis when rotated or y-axis lathe)
 * with smooth transitions, beveled chams, mount flanges, barrel ribs, and front bezel.
 */
function createContinuousBarrelProfile(): THREE.Vector2[] {
  const points: THREE.Vector2[] = [];

  // Rear mount bayonet flange (z = -1.5)
  points.push(new THREE.Vector2(0.68, -1.5));
  points.push(new THREE.Vector2(0.74, -1.48));
  points.push(new THREE.Vector2(0.74, -1.38));
  points.push(new THREE.Vector2(0.82, -1.35));
  // Mount locking collar with smooth transition
  points.push(new THREE.Vector2(0.86, -1.25));
  points.push(new THREE.Vector2(0.86, -1.05));
  // Aperture ring groove bevel
  points.push(new THREE.Vector2(0.88, -0.98));
  points.push(new THREE.Vector2(0.88, -0.65));
  points.push(new THREE.Vector2(0.87, -0.62));
  // Focus ring barrel section
  points.push(new THREE.Vector2(0.92, -0.55));
  points.push(new THREE.Vector2(0.92, 0.45));
  points.push(new THREE.Vector2(0.90, 0.52));
  // Front barrel flare with beveled taper
  points.push(new THREE.Vector2(0.95, 0.75));
  points.push(new THREE.Vector2(0.98, 1.2));
  // Front filter thread & bezel rim
  points.push(new THREE.Vector2(1.02, 1.35));
  points.push(new THREE.Vector2(1.02, 1.48));
  points.push(new THREE.Vector2(0.98, 1.50));
  // Inner rim recession for front convex glass element
  points.push(new THREE.Vector2(0.88, 1.48));
  points.push(new THREE.Vector2(0.85, 1.36));
  // Internal light baffle chamber
  points.push(new THREE.Vector2(0.72, 1.15));
  points.push(new THREE.Vector2(0.70, 0.4));
  points.push(new THREE.Vector2(0.55, 0.0));
  points.push(new THREE.Vector2(0.55, -1.35));
  points.push(new THREE.Vector2(0.48, -1.45));
  points.push(new THREE.Vector2(0.48, -1.5));

  return points;
}

export function LumenLens({ progress, prefersReducedMotion = false }: LensProps) {
  const groupRef = useRef<THREE.Group>(null);
  const barrelTexture = useMemo(() => createBarrelMarkingsTexture(), []);

  // 1. One continuous lathe barrel geometry
  const barrelGeometry = useMemo(() => {
    return new THREE.LatheGeometry(createContinuousBarrelProfile(), 72);
  }, []);

  // 2. Front convex glass element: shallow convex dome seated FLUSH inside front rim
  const frontGlassGeometry = useMemo(() => {
    // Sphere segment with shallow curve (radius 2.2, height 0.18)
    return new THREE.SphereGeometry(2.1, 48, 16, 0, Math.PI * 2, 0, 0.42);
  }, []);

  // 3. Accent ring: thin lathe/torus wrapped fully around the barrel near front bezel
  const accentRingGeometry = useMemo(() => {
    return new THREE.TorusGeometry(0.985, 0.016, 24, 64);
  }, []);

  // 4. Aperture blades assembly (9 iris blades visible through the glass behind front elements)
  const bladeGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.38, 0.14);
    shape.lineTo(0.35, 0.38);
    shape.lineTo(-0.06, 0.32);
    shape.closePath();
    return new THREE.ShapeGeometry(shape);
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (prefersReducedMotion) {
      // Horizontal static resting state
      groupRef.current.rotation.set(0.04, 0.5, 0.02);
      return;
    }

    // Constraint: Horizontal or very slightly tilted (under 15 degrees = ~0.26 rad)
    // Never turn into a steep diagonal
    const targetRotX = (Math.sin(progress * Math.PI) * 0.08) + 0.04; // max ~0.12 rad (~6.8 deg)
    const targetRotY = progress * Math.PI * 1.4 + 0.45; // Smooth turntable spin
    const targetRotZ = (Math.cos(progress * Math.PI) * 0.05) - 0.02; // max ~0.05 rad (< 3 deg)

    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetRotX, 6, delta);
    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotY, 6, delta);
    groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, targetRotZ, 6, delta);
  });

  return (
    // Coaxial assembly centered along the shared Z-axis
    <group ref={groupRef} rotation={[0, 0.45, 0]}>
      {/* 1. Main Continuous Barrel (LatheGeometry with smooth chamfers & beveled joints) */}
      {/* Rotated so lathe y-axis aligns with optic axis */}
      <mesh
        geometry={barrelGeometry}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        receiveShadow
      >
        <meshPhysicalMaterial
          color="#16181d"
          metalness={0.88}
          roughness={0.28}
          clearcoat={0.35}
          clearcoatRoughness={0.2}
          map={barrelTexture}
        />
      </mesh>

      {/* 2. Amber Accent Ring: Wrapped flush around the barrel near the front (no floating) */}
      <mesh
        geometry={accentRingGeometry}
        position={[0, 0, 1.18]}
        castShadow
      >
        <meshStandardMaterial
          color="#d97706"
          metalness={0.95}
          roughness={0.18}
          emissive="#78350f"
          emissiveIntensity={0.25}
        />
      </mesh>

      {/* 3. Front Glass Element: Shallow convex dome seated flush inside the recessed front rim */}
      <mesh
        geometry={frontGlassGeometry}
        position={[0, 0, -0.66]} // Sunk into the barrel
        rotation={[0, 0, 0]}
      >
        <meshPhysicalMaterial
          roughness={0.05} // Low roughness
          clearcoat={0.6} // Reduced specular blowout
          clearcoatRoughness={0.06}
          transmission={0.95} // High realistic glass transmission
          ior={1.52} // Optical Crown Glass IOR
          thickness={0.8}
          color="#fffbeb" // Faint warm optical coating tint
          attenuationColor="#fef3c7"
          attenuationDistance={1.2}
          transparent
          reflectivity={0.5}
        />
      </mesh>

      {/* 4. Internal Aperture Iris Blades (Coaxial behind the glass inside the barrel) */}
      <group position={[0, 0, 0.05]}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <mesh
            key={i}
            geometry={bladeGeometry}
            rotation={[0, 0, (i * Math.PI * 2) / 9 + (progress * 0.4)]}
          >
            <meshStandardMaterial
              color="#0f1115"
              metalness={0.8}
              roughness={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Internal lens element highlight (optical green-magenta antireflective anti-halation reflex) */}
      <mesh position={[0, 0, 0.6]}>
        <ringGeometry args={[0.2, 0.72, 32]} />
        <meshBasicMaterial
          color="#10b981"
          transparent
          opacity={0.06}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

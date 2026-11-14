"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface TinProps {
  progress: number;
  brandName?: string;
  brandColor?: string;
  prefersReducedMotion?: boolean;
}

/**
 * Procedural profile of an aluminum energy drink can with realistic proportions
 */
function createCanProfile(): THREE.Vector2[] {
  const points: THREE.Vector2[] = [];
  points.push(new THREE.Vector2(0, -1.8));
  points.push(new THREE.Vector2(0.3, -1.75));
  points.push(new THREE.Vector2(0.75, -1.78));
  points.push(new THREE.Vector2(0.88, -1.8));
  points.push(new THREE.Vector2(0.92, -1.76));
  points.push(new THREE.Vector2(0.93, -1.65));
  points.push(new THREE.Vector2(0.94, -1.2));
  points.push(new THREE.Vector2(0.94, 1.2));
  points.push(new THREE.Vector2(0.92, 1.45));
  points.push(new THREE.Vector2(0.82, 1.65));
  points.push(new THREE.Vector2(0.84, 1.74));
  points.push(new THREE.Vector2(0.85, 1.78));
  points.push(new THREE.Vector2(0.81, 1.8));
  points.push(new THREE.Vector2(0.79, 1.74));
  points.push(new THREE.Vector2(0, 1.74));
  return points;
}

/**
 * High-definition crisp brand label with metallic typography
 */
function createBrandLabelTexture(brandName: string, brandColor: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#06090e");
    gradient.addColorStop(0.3, brandColor);
    gradient.addColorStop(0.7, "#0d131f");
    gradient.addColorStop(1, brandColor);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 64) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }

    ctx.fillStyle = "#ffffff";
    ctx.font = "900 180px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(brandName.toUpperCase(), canvas.width / 2, canvas.height * 0.43);

    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.fillRect(canvas.width / 2 - 280, canvas.height * 0.54, 560, 4);

    ctx.font = "600 36px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.fillText("ZERO SUGAR • SUB-ZERO ENERGY", canvas.width / 2, canvas.height * 0.62);

    ctx.font = "500 24px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.fillText("330 ML / 11.2 FL OZ", canvas.width / 2, canvas.height * 0.72);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

/**
 * Drop & Bounce calculation:
 * Starts in full view at center (y = 0) at progress 0, drops slightly during scroll
 * with a realistic physical spring bounce to rest firmly on the ground shadow plane.
 */
function calculateDropY(p: number): number {
  if (p <= 0.02) return 0; // Perfectly centered resting hero on load
  if (p >= 0.28) return 0; // Firmly rested on the floor plane

  const t = (p - 0.02) / 0.26; // 0 to 1 during the initial drop-bounce window
  // Small rebound bounce wave before settling
  return Math.sin(t * Math.PI * 2) * Math.exp(-t * 3.5) * 0.4;
}

export function Tin({
  progress,
  brandName = "AURA",
  brandColor = "#0284c7",
  prefersReducedMotion = false,
}: TinProps) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  const canGeometry = useMemo(() => new THREE.LatheGeometry(createCanProfile(), 64), []);

  const tabGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-0.14, -0.26);
    shape.lineTo(0.14, -0.26);
    shape.lineTo(0.18, 0.26);
    shape.lineTo(-0.18, 0.26);
    shape.closePath();

    const hole = new THREE.Path();
    hole.moveTo(-0.06, 0.05);
    hole.lineTo(0.06, 0.05);
    hole.lineTo(0.06, 0.18);
    hole.lineTo(-0.06, 0.18);
    hole.closePath();
    shape.holes.push(hole);

    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.02,
      bevelEnabled: true,
      bevelSegments: 2,
      steps: 1,
      bevelSize: 0.01,
      bevelThickness: 0.01,
    });
  }, []);

  const labelTexture = useMemo(() => createBrandLabelTexture(brandName, brandColor), [brandName, brandColor]);
  const baseColor = useMemo(() => new THREE.Color("#cbd5e1"), []);
  const icedColor = useMemo(() => new THREE.Color("#93c5fd"), []);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (prefersReducedMotion) {
      groupRef.current.position.y = 0;
      groupRef.current.rotation.set(0.05, 0.4, -0.02);
      return;
    }

    // Centered at start, subtle dynamic bounce on scroll
    const targetY = calculateDropY(progress);
    groupRef.current.position.y = targetY;

    // Fluid continuous rotation driven by scroll progress
    const targetRotationY = progress * Math.PI * 2.2 + 0.35;
    const targetTiltX = 0.08 - progress * 0.06;
    const targetTiltZ = Math.sin(progress * Math.PI) * 0.08;

    groupRef.current.rotation.y = THREE.MathUtils.damp(groupRef.current.rotation.y, targetRotationY, 8, delta);
    groupRef.current.rotation.x = THREE.MathUtils.damp(groupRef.current.rotation.x, targetTiltX, 8, delta);
    groupRef.current.rotation.z = THREE.MathUtils.damp(groupRef.current.rotation.z, targetTiltZ, 8, delta);

    // Surface cooling transition
    if (materialRef.current) {
      const frostProgress = Math.min(1, Math.max(0, (progress - 0.2) / 0.8));
      materialRef.current.color.lerpColors(baseColor, icedColor, frostProgress * 0.4);
      materialRef.current.roughness = 0.18 + frostProgress * 0.22;
      materialRef.current.clearcoat = 1.0 - frostProgress * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <mesh geometry={canGeometry} castShadow receiveShadow>
        <meshPhysicalMaterial
          ref={materialRef}
          color="#cbd5e1"
          metalness={0.92}
          roughness={0.18}
          clearcoat={1.0}
          clearcoatRoughness={0.08}
          map={labelTexture}
          reflectivity={0.9}
        />
      </mesh>

      <mesh
        geometry={tabGeometry}
        position={[0.22, 1.75, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 6]}
        castShadow
      >
        <meshStandardMaterial color="#94a3b8" metalness={0.95} roughness={0.25} />
      </mesh>
    </group>
  );
}

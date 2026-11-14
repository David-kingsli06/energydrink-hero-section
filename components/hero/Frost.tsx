"use client";

import React, { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

interface FrostProps {
  progress: number; // 0 to 1
  canRadius?: number;
  canHeight?: number;
  maxBeads?: number;
}

// Simplex/Perlin-inspired procedural noise GLSL for organic frost expansion
const frostVertexShader = `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    // Slight expansion to cleanly wrap the base tin without z-fighting
    vec3 transformed = position + normal * 0.008;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

const frostFragmentShader = `
  uniform float uProgress;
  uniform vec3 uFrostColor;
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // Pseudo-random and 2D value noise for dendritic crystalline frost
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }

  // Fractal Brownian Motion for rich organic crystal branching
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
    for (int i = 0; i < 4; ++i) {
      v += a * noise(p);
      p = rot * p * 2.1;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    // Frost starts after landing (progress > 0.28) and culminates near 1.0
    float frostT = smoothstep(0.28, 0.95, uProgress);
    if (frostT <= 0.001) {
      discard;
    }

    // Wrap-around coordinate for seamless cylinder mapping
    vec2 st = vec2(vUv.x * 6.28318, vUv.y * 3.5);
    float n = fbm(st * 3.0);
    float fine = noise(st * 12.0) * 0.15;

    // Organic frost threshold: noise patches grow and congeal
    float threshold = 1.0 - frostT;
    float frostMask = smoothstep(threshold - 0.15, threshold + 0.05, n + fine);

    if (frostMask <= 0.01) {
      discard;
    }

    // Ice fresnel effect: rim glowing ice crystals
    vec3 viewDir = normalize(-vPosition);
    float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.2);

    // Soft crystalline translucency
    float alpha = frostMask * (0.65 + fresnel * 0.35);
    vec3 finalColor = mix(uFrostColor, vec3(1.0, 1.0, 1.0), fresnel * 0.5);

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

export function Frost({
  progress,
  canRadius = 0.92,
  canHeight = 3.6,
  maxBeads = 48,
}: FrostProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const instancedRef = useRef<THREE.InstancedMesh>(null);

  // Shader uniforms
  const uniforms = useMemo(
    () => ({
      uProgress: { value: 0 },
      uFrostColor: { value: new THREE.Color("#e0f2fe") }, // Ice azure
    }),
    []
  );

  // Procedural droplets (condensation beads) on the cylindrical surface
  const dropletData = useMemo(() => {
    const list: Array<{
      initialY: number;
      speed: number;
      angle: number;
      scale: number;
      offsetProgress: number;
    }> = [];

    for (let i = 0; i < maxBeads; i++) {
      const angle = (i / maxBeads) * Math.PI * 2 + (Math.sin(i * 99) * 0.5);
      const initialY = (Math.random() - 0.5) * (canHeight * 0.8);
      const speed = 0.4 + Math.random() * 0.8; // Bead sliding speed
      const scale = 0.02 + Math.random() * 0.035; // Droplet radius
      const offsetProgress = 0.3 + Math.random() * 0.3; // Starts appearing after drop settles
      list.push({ initialY, speed, angle, scale, offsetProgress });
    }
    return list;
  }, [maxBeads, canHeight]);

  // Cylinder geometry matching the tin body for the frost overlay
  const frostGeometry = useMemo(() => {
    return new THREE.CylinderGeometry(
      canRadius * 0.998,
      canRadius * 0.998,
      canHeight * 0.84,
      48,
      1,
      true
    );
  }, [canRadius, canHeight]);

  const dropletGeometry = useMemo(() => {
    return new THREE.SphereGeometry(1, 12, 12);
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Update uniforms and droplets every frame
  useFrame(() => {
    if (meshRef.current) {
      uniforms.uProgress.value = progress;
    }

    if (instancedRef.current) {
      dropletData.forEach((d, idx) => {
        // Bead visibility and drip growth based on scroll
        const beadProgress = Math.max(
          0,
          Math.min(1, (progress - d.offsetProgress) / (1 - d.offsetProgress + 0.001))
        );

        if (beadProgress <= 0.01) {
          dummy.position.set(0, -999, 0);
          dummy.scale.set(0, 0, 0);
        } else {
          // Slide slowly downward as condensation accumulates
          const dripDistance = beadProgress * d.speed * 0.6;
          const currentY = d.initialY - dripDistance;
          const r = canRadius + 0.015;
          const x = Math.cos(d.angle) * r;
          const z = Math.sin(d.angle) * r;

          // Droplets elongate slightly as they roll down
          const currentScale = d.scale * Math.min(1, beadProgress * 2.5);
          dummy.position.set(x, currentY, z);
          dummy.scale.set(currentScale, currentScale * (1 + dripDistance * 1.5), currentScale);
          dummy.rotation.set(0, d.angle, 0);
        }

        dummy.updateMatrix();
        instancedRef.current?.setMatrixAt(idx, dummy.matrix);
      });
      instancedRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Frosted ice procedural shader mantle */}
      <mesh ref={meshRef} geometry={frostGeometry} position={[0, 0, 0]}>
        <shaderMaterial
          vertexShader={frostVertexShader}
          fragmentShader={frostFragmentShader}
          uniforms={uniforms}
          transparent={true}
          depthWrite={false}
          blending={THREE.NormalBlending}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Condensation beads: physical glass droplets with refraction highlights */}
      <instancedMesh
        ref={instancedRef}
        args={[dropletGeometry, undefined, maxBeads]}
        frustumCulled={false}
      >
        <meshPhysicalMaterial
          roughness={0.05}
          transmission={0.92}
          ior={1.33} // Water IOR
          thickness={0.06}
          clearcoat={1.0}
          clearcoatRoughness={0.05}
          color="#dbeafe"
          transparent
          opacity={Math.min(1, Math.max(0, (progress - 0.3) * 2.2))}
        />
      </instancedMesh>
    </group>
  );
}

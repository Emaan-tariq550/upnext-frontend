import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function Rain({ count = 600 }) {
  const meshRef = useRef(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 1] = Math.random() * 40;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, [count]);

  useFrame(() => {
    const posAttr = meshRef.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      posAttr.array[i * 3 + 1] -= 0.3;
      if (posAttr.array[i * 3 + 1] < -10) posAttr.array[i * 3 + 1] = 30;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#a78bfa" transparent opacity={0.4} />
    </points>
  );
}

function Snow({ count = 400 }) {
  const meshRef = useRef(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 40;
      arr[i * 3 + 1] = Math.random() * 40;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    const posAttr = meshRef.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      posAttr.array[i * 3 + 1] -= 0.03;
      posAttr.array[i * 3] += Math.sin(state.clock.elapsedTime + i) * 0.01;
      if (posAttr.array[i * 3 + 1] < -10) posAttr.array[i * 3 + 1] = 30;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.08} color="#f4f4f5" transparent opacity={0.7} />
    </points>
  );
}

function Fireflies({ count = 60 }) {
  const meshRef = useRef(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 20;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    const posAttr = meshRef.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      posAttr.array[i * 3 + 1] += Math.sin(state.clock.elapsedTime + i) * 0.01;
      posAttr.array[i * 3] += Math.cos(state.clock.elapsedTime + i * 0.5) * 0.01;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.15} color="#fbbf24" transparent opacity={0.9} />
    </points>
  );
}

const EFFECTS = { rain: Rain, snow: Snow, fireflies: Fireflies };

export default function AmbientWeather({ type = null }) {
  const EffectComponent = EFFECTS[type];
  if (!EffectComponent) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
        <EffectComponent />
      </Canvas>
    </div>
  );
}
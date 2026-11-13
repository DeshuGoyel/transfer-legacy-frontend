import { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Float, Html, Line, useTexture } from '@react-three/drei';
import * as THREE from 'three';

// Real-world coordinates for major crypto hubs from the blueprint
const COUNTRY_DATA = [
  { lat: 20.6, lon: 78.9, name: 'India', holders: '119M', families: '8.4M', color: '#e8621a' },
  { lat: 37.1, lon: -95.7, name: 'United States', holders: '53M', families: '3.7M', color: '#e8621a' },
  { lat: 9.1, lon: 8.7, name: 'Nigeria', holders: '22M', families: '1.5M', color: '#c9922a' },
  { lat: 14.0, lon: 108.3, name: 'Vietnam', holders: '20M', families: '1.4M', color: '#c9922a' },
  { lat: 51.5, lon: -0.12, name: 'United Kingdom', holders: '7.4M', families: '520k', color: '#e8621a' },
  { lat: 23.4, lon: 53.8, name: 'UAE', holders: '4.3M', families: '300k', color: '#e8621a' },
  { lat: 35.9, lon: 127.8, name: 'South Korea', holders: '8.0M', families: '560k', color: '#c9922a' },
  { lat: -14.2, lon: -51.9, name: 'Brazil', holders: '16M', families: '1.1M', color: '#c9922a' },
  { lat: 51.2, lon: 10.4, name: 'Germany', holders: '5.8M', families: '400k', color: '#4ecdc4' },
  { lat: 56.1, lon: -106.3, name: 'Canada', holders: '6.5M', families: '455k', color: '#4ecdc4' },
  { lat: -25.3, lon: 133.8, name: 'Australia', holders: '5.3M', families: '371k', color: '#4ecdc4' },
  { lat: 55.8, lon: 37.6, name: 'Russia', holders: '17M', families: '1.19M', color: '#4ecdc4' },
  { lat: 1.4, lon: 103.8, name: 'Singapore', holders: '1.4M', families: '98k', color: '#4ecdc4' },
  { lat: 46.2, lon: 2.2, name: 'France', holders: '3.6M', families: '252k', color: '#4ecdc4' },
  { lat: -30.6, lon: 22.9, name: 'South Africa', holders: '5.8M', families: '406k', color: '#4ecdc4' },
  { lat: 12.9, lon: 121.8, name: 'Philippines', holders: '17M', families: '1.19M', color: '#c9922a' },
  { lat: 30.4, lon: 69.3, name: 'Pakistan', holders: '15M', families: '1.05M', color: '#c9922a' },
  { lat: -0.8, lon: 113.9, name: 'Indonesia', holders: '14M', families: '980k', color: '#c9922a' },
  { lat: 38.9, lon: 35.2, name: 'Turkey', holders: '7.0M', families: '490k', color: '#c9922a' },
  { lat: 4.2, lon: 108.0, name: 'Malaysia', holders: '1.9M', families: '133k', color: '#4ecdc4' },
];

function latLonToVector3(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

interface PinProps {
  lat: number;
  lon: number;
  name: string;
  holders: string;
  families: string;
  color: string;
}

function Pin({ lat, lon, name, holders, families, color }: PinProps) {
  const [hovered, setHovered] = useState(false);
  const pos = useMemo(() => latLonToVector3(lat, lon, 3), [lat, lon]);
  const ringRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ringRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 2.5) * 0.25;
      ringRef.current.scale.set(s, s, s);
      const mat = ringRef.current.material;
      if (mat && !Array.isArray(mat) && 'opacity' in mat) {
        (mat as THREE.Material).opacity = 0.6 - (s - 1) * 2;
      }
    }
  });

  return (
    <group position={pos}>
      <mesh onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
      </mesh>
      
      {/* Pin Stem */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.3, 8]} />
        <meshBasicMaterial color={color} transparent opacity={0.5} />
      </mesh>
      
      {/* Pulsing base ring */}
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.1, 0.18, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      <Html distanceFactor={10} position={[0, 0.4, 0]}>
        <div className={`pointer-events-none transition-all duration-500 transform ${hovered ? 'scale-100 opacity-100 translate-y-0' : 'scale-75 opacity-0 translate-y-4'}`}>
          <div className="bg-[#1a1a2e]/95 backdrop-blur-2xl border border-white/15 p-4 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] min-w-[200px]">
            <div className="flex items-center justify-between mb-2">
              <p className="text-white font-bold text-xs tracking-tight uppercase">{name}</p>
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: color }} />
            </div>
            <div className="space-y-1">
               <p className="text-[#f0b84a] font-bold text-sm leading-none">{holders} holders</p>
               <p className="text-white/50 text-[10px] leading-tight mt-1">~{families} families unprotected</p>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
}

function ConnectionLine({ start, end, color }: { start: THREE.Vector3, end: THREE.Vector3, color: string }) {
  const points = useMemo(() => {
    const mid = start.clone().add(end).multiplyScalar(0.5).normalize().multiplyScalar(4.5); // Arch height
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    return curve.getPoints(50);
  }, [start, end]);

  return (
    <Line
      points={points}
      color={color}
      lineWidth={0.5}
      transparent
      opacity={0.3}
    />
  );
}

export default function Globe() {
  const groupRef = useRef<THREE.Group>(null);
  
  const [nightMap] = useTexture([
    'https://unpkg.com/three-globe/example/img/earth-night.jpg',
  ]);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0015;
    }
  });

  const connections = useMemo(() => {
    const arcs = [
      { startLat: 20.6, startLng: 78.9, endLat: 37.1, endLng: -95.7 },
      { startLat: 20.6, startLng: 78.9, endLat: 23.4, endLng: 53.8  },
      { startLat: 51.5, startLng: -0.12,endLat: 20.6, endLng: 78.9  },
      { startLat: 37.1, startLng: -95.7,endLat: -14.2,endLng: -51.9 },
      { startLat: 9.1,  startLng: 8.7,  endLat: 51.5, endLng: -0.12 },
      { startLat: 35.9, startLng: 127.8,endLat: 37.1, endLng: -95.7 },
      { startLat: 1.4,  startLng: 103.8,endLat: 20.6, endLng: 78.9  },
    ];

    return arcs.map((arc, i) => {
      const start = latLonToVector3(arc.startLat, arc.startLng, 3);
      const end = latLonToVector3(arc.endLat, arc.endLng, 3);
      return <ConnectionLine key={i} start={start} end={end} color={i % 2 === 0 ? "#e8621a" : "#c9922a"} />;
    });
  }, []);

  return (
    <group ref={groupRef} scale={1.3}>
      <Sphere args={[3, 128, 128]}>
        <meshStandardMaterial 
          map={nightMap}
          emissive="#D4AF37"
          emissiveMap={nightMap}
          emissiveIntensity={0.6}
          metalness={0.9}
          roughness={0.1}
        />
      </Sphere>

      <Sphere args={[3.02, 64, 64]}>
        <meshStandardMaterial transparent opacity={0.15} color="#1a365d" metalness={1} roughness={0} />
      </Sphere>

      <Sphere args={[3.05, 48, 48]}>
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.03} />
      </Sphere>

      {COUNTRY_DATA.map((country, i) => (
        <Pin key={i} {...country} />
      ))}

      {connections}

      <Float speed={2} rotationIntensity={0.1} floatIntensity={0.4}>
        <group scale={3.8}>
          {Array.from({ length: 40 }).map((_, i) => (
            <mesh key={i} position={[(Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2]}>
              <sphereGeometry args={[0.003, 8, 8]} />
              <meshBasicMaterial color="#D4AF37" transparent opacity={0.25} />
            </mesh>
          ))}
        </group>
      </Float>
    </group>
  );
}

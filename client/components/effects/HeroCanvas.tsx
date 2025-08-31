import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls } from "@react-three/drei";
import { useRef } from "react";

function Spinning({ color = "#ffffff", position = [0, 0, 0] as [number, number, number] }) {
  const ref = useRef<any>(null);
  useFrame((_, delta) => {
    if (!ref.current) return;
    ref.current.rotation.x += delta * 0.2;
    ref.current.rotation.y += delta * 0.15;
  });
  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={1.2}>
      <mesh ref={ref} position={position} castShadow receiveShadow>
        <icosahedronGeometry args={[1.2, 1]} />
        <meshStandardMaterial color={color} metalness={0.2} roughness={0.3} transparent opacity={0.18} />
      </mesh>
    </Float>
  );
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden>
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }} dpr={[1, 2]}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 5, 2]} intensity={0.6} />
        <Spinning color="#BB86FC" position={[-2, 0.5, 0]} />
        <Spinning color="#03DAC6" position={[2.2, -0.8, -0.5]} />
        <Spinning color="#FFFFFF" position={[0.5, 1.2, -1.5]} />
        <OrbitControls enablePan={false} enableZoom={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}

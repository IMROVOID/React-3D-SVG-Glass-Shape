import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import GlassTorus from "./GlassTorus";

export default function App() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', backgroundColor: 'black' }}>
      {/* Grid Background Elements */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundSize: '40px 40px',
          backgroundImage: 'linear-gradient(to right, #262626 1px, transparent 1px), linear-gradient(to bottom, #262626 1px, transparent 1px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundColor: 'black',
          maskImage: 'radial-gradient(ellipse at center, transparent 20%, black)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 20%, black)',
        }}
      />

      {/* 3D Scene Canvas */}
      <Canvas
        // Canvas is transparent and positioned absolutely to overlay the background
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
        camera={{ position: [0, 0, 15] }}
      >
        <Environment preset="studio" />
        <directionalLight intensity={3} position={[0, 3, 2]} />
        <GlassTorus />
      </Canvas>
    </div>
  );
}
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import GlassTorus from "./GlassTorus";

export default function App() {
  return (
    <Canvas
      style={{ height: "100vh", background: "#000" }}
      camera={{ position: [0, 0, 15] }}
    >
      <Environment preset="studio" />
      <directionalLight intensity={3} position={[0, 3, 2]} />

      {/* MODIFICATION: The <Text> component has been removed. */}

      <GlassTorus />
    </Canvas>
  );
}
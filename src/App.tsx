import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
// MODIFICATION: Added the '.tsx' extension to ensure TypeScript resolves the correct file.
import SvgShape from './SvgShape.tsx';

function Scene() {
  const cameraZ = 20;
  const gridZ = -50;
  const distance = cameraZ - gridZ;

  const originalDistance = 21;
  const scaleFactor = distance / originalDistance;

  const gridSize = 100 * scaleFactor;
  const gridDivisions = 400 * scaleFactor;

  return (
    <>
      <gridHelper
        args={[gridSize, gridDivisions, '#333333', '#333333']}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, gridZ]}
      />
      <Environment preset="studio" />
      <directionalLight intensity={3} position={[0, 3, 2]} />
      <SvgShape />
    </>
  );
}

export default function App() {
  return (
    <Canvas
      camera={{ position: [0, 0, 20], fov: 15 }}
    >
      <color attach="background" args={['#101010']} />
      <Scene />
    </Canvas>
  );
}
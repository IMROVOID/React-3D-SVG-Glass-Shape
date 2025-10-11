import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import SvgShape from './SvgShape.tsx';
import GlassSceneContainer from './GlassSceneContainer.tsx';

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
      {/* MODIFICATION: Added renderOrder={-2} to ensure the grid is always drawn first. */}
      <gridHelper
        args={[gridSize, gridDivisions, '#333333', '#333333']}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, gridZ]}
        renderOrder={-2}
      />
      <Environment preset="studio" />
      <directionalLight intensity={3} position={[0, 3, 2]} />
      <GlassSceneContainer>
        <SvgShape />
      </GlassSceneContainer>
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
import { Canvas, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { useControls } from 'leva';
import { useEffect } from 'react';
import SvgShape from './SvgShape.tsx';
import GlassSceneContainer from './GlassSceneContainer.tsx';
import jpgFile from './assets/hdr/studio.jpg';

function Scene() {
  const { scene } = useThree();

  const geometryProps = useControls("Geometry", {
    scale: { value: 1.0, min: 0.1, max: 2, step: 0.01 },
    depth: { value: 100, min: 1, max: 300, step: 1 },
    roundness: { value: 7.0, min: 0, max: 20, step: 0.1, label: "Edge Roundness" },
    steps: { value: 2, min: 1, max: 20, step: 1, label: "Extrusion Steps" },
    curveSegments: { value: 32, min: 4, max: 64, step: 1, label: "Curve Segments" },
  });

  const qualityProps = useControls("Quality", {
    "High Res": true,
  });

  const materialProps = useControls('Glass Material', {
    thickness: { value: 45, min: 0, max: 100 },
    ior: { value: 1.0, min: 1, max: 2, step: 0.01 },
    chromaticAberration: { value: 0.5, min: 0, max: 1 },
    anisotropy: { value: 0.5, min: 0, max: 1 },
    distortion: { value: 0.75, min: 0, max: 1 },
    distortionScale: { value: 0.5, min: 0, max: 1 },
    temporalDistortion: { value: 0.5, min: 0, max: 1 },
    clearcoat: { value: 0.33, min: 0, max: 1 },
    color: '#ffffff',
    attenuationColor: '#ffffff',
    attenuationDistance: { value: 0.5, min: 0, max: 2 },
  });

  const reflectionProps = useControls("Reflections", {
    enableHDR: { value: false, label: "Enable HDR" },
    hdrIntensity: {
        value: 1.0,
        min: 0,
        max: 2,
        step: 0.01,
        label: "Intensity",
        render: (get) => get("Reflections.enableHDR"),
    },
  });
  
  // MODIFICATION: Added a new control to toggle the visibility of background elements.
  const backgroundProps = useControls("Background", {
    showDemoElements: { value: true, label: "Show Demo Elements" },
  });

  useEffect(() => {
    if (reflectionProps.enableHDR) {
      scene.environmentIntensity = reflectionProps.hdrIntensity;
    } else {
      scene.environmentIntensity = 1;
    }
  }, [reflectionProps.enableHDR, reflectionProps.hdrIntensity, scene]);

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
        renderOrder={-2}
      />

      {reflectionProps.enableHDR ? (
        <Environment files={jpgFile} />
      ) : (
        <Environment preset="studio" />
      )}
      
      <directionalLight intensity={3} position={[0, 3, 2]} />
      {/* MODIFICATION: Passed the new 'showDemoElements' prop to the container. */}
      <GlassSceneContainer materialProps={materialProps} showDemoElements={backgroundProps.showDemoElements}>
        <SvgShape geometryProps={geometryProps} qualityProps={qualityProps} />
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
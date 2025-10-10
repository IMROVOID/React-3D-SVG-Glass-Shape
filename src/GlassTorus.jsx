import { useMemo, useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { Box3, Vector3, Shape, ExtrudeGeometry } from "three";
import { useControls } from "leva";
import { MeshTransmissionMaterial } from "@react-three/drei";

// MODIFICATION: Import the SVG as a module. Vite will handle the correct path.
import pythonLogo from "./assets/shape.svg";

export default function GlassTorus() {
  const ref = useRef();
  // MODIFICATION: Pass the imported SVG path to the loader.
  const svgData = useLoader(SVGLoader, pythonLogo);
  const { scene } = useThree();

  // --- Leva Control Box Setup ---
  const { scale, depth, roundness } = useControls("Geometry", {
    scale: { value: 1, min: 0.1, max: 2, step: 0.01 },
    depth: { value: 70, min: 1, max: 300, step: 1 },
    roundness: {
      value: 20,
      min: 0,
      max: 20,
      step: 0.1,
      label: "Edge Roundness",
    },
  });

  const materialProps = useControls("Glass Material", {
    thickness: { value: 0.2, min: 0, max: 3, step: 0.05 },
    roughness: { value: 0.1, min: 0, max: 1, step: 0.1 },
    transmission: { value: 1, min: 0, max: 1, step: 0.1 },
    ior: { value: 1.2, min: 0, max: 3, step: 0.1 },
    chromaticAberration: { value: 0.02, min: 0, max: 1 },
    distortion: { value: 0.4, min: 0, max: 1, step: 0.1 },
    temporalDistortion: { value: 0.6, min: 0, max: 1, step: 0.1 },
    backside: { value: false },
  });

  const { "High Res": highRes } = useControls("Quality", {
    "High Res": true,
  });

  const { shapes, scaleFactor, centerOffset } = useMemo(() => {
    if (!svgData.paths || svgData.paths.length === 0) {
      return { shapes: [], scaleFactor: 1, centerOffset: new Vector3(0, 0, 0) };
    }

    const allShapes = svgData.paths.flatMap((path) =>
      path.toShapes(true).map((shape) => ({ shape, color: path.color }))
    );

    const combinedGeometry = new ExtrudeGeometry(
      allShapes.map((s) => s.shape),
      { depth: 1, bevelEnabled: false }
    );
    combinedGeometry.computeBoundingBox();
    const center = new Vector3();
    combinedGeometry.boundingBox.getCenter(center);
    combinedGeometry.dispose();

    const TARGET_SIZE = 10;
    const size = new Vector3();
    combinedGeometry.boundingBox.getSize(size);
    const maxDimension = Math.max(size.x, size.y);

    const adjustedMaxSize = maxDimension + roundness * 2;
    const calculatedScale =
      adjustedMaxSize > 0 ? TARGET_SIZE / adjustedMaxSize : 1;

    return {
      shapes: allShapes,
      scaleFactor: calculatedScale,
      centerOffset: center,
    };
  }, [svgData, roundness]);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta / 4;
    }
  });

  return (
    <group ref={ref} scale={scaleFactor * scale}>
      <group position={[-centerOffset.x, -centerOffset.y, -centerOffset.z]}>
        {shapes.map(({ shape }) => (
          <mesh key={shape.uuid}>
            <extrudeGeometry
              args={[
                shape,
                {
                  depth: depth,
                  bevelEnabled: true,
                  bevelThickness: roundness,
                  bevelSize: roundness,
                  bevelOffset: -roundness,
                  bevelSegments: highRes ? 80 : 16,
                },
              ]}
            />
            <MeshTransmissionMaterial
              {...materialProps}
              background={scene.environment}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
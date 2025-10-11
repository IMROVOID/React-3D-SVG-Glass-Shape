import React, { useMemo, useRef } from "react";
import { useFrame, useLoader, type RootState } from "@react-three/fiber";
import { SVGLoader, type SVGResult } from "three/examples/jsm/loaders/SVGLoader.js";
import { Vector3, ExtrudeGeometry, Group, Shape, ShapePath, Color, type Texture } from "three";
import { useControls } from "leva";
import { MeshTransmissionMaterial, type MeshTransmissionMaterialProps } from '@react-three/drei';
import pythonLogo from "./assets/shape.svg";

// A helper type for the shape data structure
type ShapeData = {
    shape: Shape;
    color: Color;
};

// Define the new props that will be injected by the container
interface SvgShapeProps extends React.ComponentPropsWithoutRef<'group'> {
  buffer?: Texture;
  materialProps?: MeshTransmissionMaterialProps;
}

export default function SvgShape({ buffer, materialProps, ...props }: SvgShapeProps) {
  const ref = useRef<Group>(null);
  const svgData = useLoader(SVGLoader, pythonLogo) as SVGResult;

  // MODIFICATION: Added 'steps' and 'curveSegments' to the controls for finer detail adjustment.
  const { scale, depth, roundness, steps, curveSegments } = useControls("Geometry", {
    scale: { value: 1.0, min: 0.1, max: 2, step: 0.01 },
    depth: { value: 100, min: 1, max: 300, step: 1 },
    roundness: {
      value: 7.0,
      min: 0,
      max: 20,
      step: 0.1,
      label: "Edge Roundness",
    },
    steps: { value: 2, min: 1, max: 20, step: 1, label: "Extrusion Steps" },
    curveSegments: { value: 32, min: 4, max: 64, step: 1, label: "Curve Segments" },
  });

  const { "High Res": highRes } = useControls("Quality", {
    "High Res": true,
  });

  const { shapes, scaleFactor, centerOffset } = useMemo(() => {
    if (!svgData.paths || svgData.paths.length === 0) {
      return { shapes: [], scaleFactor: 1, centerOffset: new Vector3(0, 0, 0) };
    }

    const allShapes: ShapeData[] = svgData.paths.flatMap((path: ShapePath) =>
      path.toShapes(true).map((shape: Shape) => ({ shape, color: path.color }))
    );

    const combinedGeometry = new ExtrudeGeometry(
      allShapes.map((s: ShapeData) => s.shape),
      { depth: 1, bevelEnabled: false }
    );

    combinedGeometry.computeBoundingBox();

    if (!combinedGeometry.boundingBox) {
      combinedGeometry.dispose();
      return { shapes: allShapes, scaleFactor: 1, centerOffset: new Vector3(0, 0, 0) };
    }

    const center = new Vector3();
    combinedGeometry.boundingBox.getCenter(center);

    const TARGET_SIZE = 3.5;
    const size = new Vector3();
    combinedGeometry.boundingBox.getSize(size);
    const maxDimension = Math.max(size.x, size.y);

    const adjustedMaxSize = maxDimension + roundness * 2;
    const calculatedScale =
      adjustedMaxSize > 0 ? TARGET_SIZE / adjustedMaxSize : 1;
    
    combinedGeometry.dispose();

    return {
      shapes: allShapes,
      scaleFactor: calculatedScale,
      centerOffset: center,
    };
  }, [svgData, roundness]);

  useFrame((_state: RootState, delta: number) => {
    if (ref.current) {
      ref.current.rotation.y += delta / 4;
    }
  });

  return (
    <group ref={ref} scale={scaleFactor * scale} renderOrder={1} {...props}>
      <group position={[-centerOffset.x, -centerOffset.y, -centerOffset.z]}>
        {shapes.map(({ shape }: ShapeData) => (
          <mesh key={shape.uuid}>
            {/* MODIFICATION: Added 'steps' and 'curveSegments' and optimized 'bevelSegments' */}
            <extrudeGeometry
              args={[
                shape,
                {
                  depth: depth,
                  steps: steps,
                  bevelEnabled: true,
                  bevelThickness: roundness,
                  bevelSize: roundness,
                  bevelOffset: -roundness,
                  bevelSegments: highRes ? 24 : 8, // Optimized for performance
                  curveSegments: curveSegments,
                },
              ]}
            />
            <MeshTransmissionMaterial buffer={buffer!} {...materialProps} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
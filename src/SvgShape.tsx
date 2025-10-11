import React, { useMemo, useRef } from "react";
// MODIFICATION: Corrected the import path from '@react-three-fiber/core' to '@react-three/fiber'.
// MODIFICATION: Imported 'RootState' to provide types for the useFrame hook.
import { useFrame, useLoader, RootState } from "@react-three/fiber";
import { SVGLoader, SVGResult } from "three/examples/jsm/loaders/SVGLoader.js";
import { Vector3, ExtrudeGeometry, Group, Shape, ShapePath, Color } from "three";
import { useControls } from "leva";
import pythonLogo from "./assets/shape.svg";

// A helper type for the shape data structure
type ShapeData = {
    shape: Shape;
    color: Color;
};

export default function SvgShape(props: React.ComponentPropsWithoutRef<'group'>) {
  const ref = useRef<Group>(null);
  const svgData = useLoader(SVGLoader, pythonLogo) as SVGResult;

  const { scale, depth, roundness } = useControls("Geometry", {
    scale: { value: 1.0, min: 0.1, max: 2, step: 0.01 },
    depth: { value: 100, min: 1, max: 300, step: 1 },
    roundness: {
      value: 7.0,
      min: 0,
      max: 20,
      step: 0.1,
      label: "Edge Roundness",
    },
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

  // MODIFICATION: Added explicit types for the 'state' and 'delta' parameters.
  useFrame((_state: RootState, delta: number) => {
    if (ref.current) {
      ref.current.rotation.y += delta / 4;
    }
  });

  return (
    <group ref={ref} scale={scaleFactor * scale} {...props}>
      <group position={[-centerOffset.x, -centerOffset.y, -centerOffset.z]}>
        {shapes.map(({ shape }: ShapeData) => (
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
            <meshStandardMaterial color="white" />
          </mesh>
        ))}
      </group>
    </group>
  );
}
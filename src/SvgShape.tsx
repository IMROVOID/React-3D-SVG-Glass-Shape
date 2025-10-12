import React, { useMemo, useRef } from "react";
import { useFrame, useLoader, type RootState } from "@react-three/fiber";
import { SVGLoader, type SVGResult } from "three/examples/jsm/loaders/SVGLoader.js";
import { Vector3, ExtrudeGeometry, Group, Shape, ShapePath, Color, type Texture } from "three";
import { MeshTransmissionMaterial, type MeshTransmissionMaterialProps } from '@react-three/drei';
import pythonLogo from "./assets/shape.svg";

// A helper type for the shape data structure
type ShapeData = {
    shape: Shape;
    color: Color;
};

// MODIFICATION: Props are now passed down from the parent App component.
interface GeometryProps {
  scale: number;
  depth: number;
  roundness: number;
  steps: number;
  curveSegments: number;
}

interface QualityProps {
  "High Res": boolean;
}

interface SvgShapeProps extends React.ComponentPropsWithoutRef<'group'> {
  buffer?: Texture;
  materialProps?: MeshTransmissionMaterialProps;
  geometryProps: GeometryProps;
  qualityProps: QualityProps;
}

export default function SvgShape({ buffer, materialProps, geometryProps, qualityProps, ...props }: SvgShapeProps) {
  const ref = useRef<Group>(null);
  const svgData = useLoader(SVGLoader, pythonLogo) as SVGResult;

  // MODIFICATION: The useControls hooks have been removed from this component.
  // The component now uses the props passed from App.tsx.
  const { scale, depth, roundness, steps, curveSegments } = geometryProps;
  const { "High Res": highRes } = qualityProps;

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
                  bevelSegments: highRes ? 24 : 8,
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
import React, { useState } from 'react';
import * as THREE from 'three';
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { useFBO, type MeshTransmissionMaterialProps } from '@react-three/drei';
import { Images, Typography } from './content';

// MODIFICATION: Interface simplified, 'refractionQuality' prop removed.
interface GlassSceneContainerProps {
  children: React.ReactNode;
  materialProps: MeshTransmissionMaterialProps;
  showDemoElements: boolean;
}

export default function GlassSceneContainer({ children, materialProps, showDemoElements }: GlassSceneContainerProps) {
  // MODIFICATION: 'dpr' and 'size' removed from destructuring.
  const { gl, camera, viewport } = useThree();
  
  // MODIFICATION: useFBO is now called with no arguments, which is the correct usage
  // for a standard, full-resolution buffer. The quality is handled by the material itself.
  const buffer = useFBO();
  
  const [backgroundScene] = useState(() => new THREE.Scene());

  useFrame(() => {
    gl.setRenderTarget(buffer);
    gl.render(backgroundScene, camera);
    gl.setRenderTarget(null);
  });

  return (
    <>
      {/* Portal renders the background content into a separate scene */}
      {createPortal(
        showDemoElements && (
            <>
                <Images />
                <Typography />
            </>
        ),
        backgroundScene
      )}
      
      {/* This mesh acts as a background where the glass isn't showing */}
      <mesh scale={[viewport.width, viewport.height, 1]} renderOrder={-1}>
        <planeGeometry />
        <meshBasicMaterial map={buffer.texture} depthWrite={false} />
      </mesh>
      
      {/* This injects the buffer and material props into the 3D shape */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            buffer: buffer.texture,
            materialProps: materialProps,
          } as React.Attributes);
        }
        return child;
      })}
    </>
  );
}
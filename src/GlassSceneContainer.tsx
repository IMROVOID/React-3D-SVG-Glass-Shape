import React, { useState } from 'react';
import * as THREE from 'three';
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { useFBO, type MeshTransmissionMaterialProps } from '@react-three/drei';
import { Images, Typography } from './content';

// MODIFICATION: Interface updated to accept the new 'showDemoElements' prop.
interface GlassSceneContainerProps {
  children: React.ReactNode;
  materialProps: MeshTransmissionMaterialProps;
  showDemoElements: boolean;
}

export default function GlassSceneContainer({ children, materialProps, showDemoElements }: GlassSceneContainerProps) {
  const { gl, camera, viewport } = useThree();
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
        // MODIFICATION: Conditionally renders the background elements based on the prop.
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
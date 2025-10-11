import React, { useState } from 'react';
import * as THREE from 'three';
import { createPortal, useFrame, useThree } from '@react-three/fiber';
import { useFBO, type MeshTransmissionMaterialProps } from '@react-three/drei';
import { useControls } from 'leva';
import { Images, Typography } from './content';

interface GlassSceneContainerProps {
  children: React.ReactNode;
}

export default function GlassSceneContainer({ children }: GlassSceneContainerProps) {
  const { gl, camera, viewport } = useThree();
  const buffer = useFBO();
  const [backgroundScene] = useState(() => new THREE.Scene());

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

  useFrame(() => {
    gl.setRenderTarget(buffer);
    gl.render(backgroundScene, camera);
    gl.setRenderTarget(null);
  });

  return (
    <>
      {/* Portal renders the background content into a separate scene */}
      {createPortal(
        <>
          <Images />
          <Typography />
        </>,
        backgroundScene
      )}
      
      {/* This mesh acts as a background where the glass isn't showing */}
      <mesh scale={[viewport.width, viewport.height, 1]} renderOrder={-1}>
        <planeGeometry />
        {/* This stops the background from interfering with the transparent shape's rendering. */}
        <meshBasicMaterial map={buffer.texture} depthWrite={false} />
      </mesh>
      
      {/* This injects the buffer and material props into the 3D shape */}
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            buffer: buffer.texture,
            materialProps: materialProps as MeshTransmissionMaterialProps,
          } as React.Attributes);
        }
        return child;
      })}
    </>
  );
}
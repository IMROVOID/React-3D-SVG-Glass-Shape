/* eslint-disable react/no-unknown-property */
import { useRef, useState, useEffect } from 'react';
// MODIFICATION: Import the 'three' library to resolve the 'THREE' namespace error.
import * as THREE from 'three';
import { useFrame, useThree, RootState } from '@react-three/fiber';
import { useScroll, Image, Text } from '@react-three/drei';

import imageOne from './assets/demo/cs1.webp';
import imageTwo from './assets/demo/cs2.webp';
import imageThree from './assets/demo/cs3.webp';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

function Images() {
  const group = useRef<THREE.Group>(null);
  const data = useScroll();
  const { height } = useThree((s: RootState) => s.viewport);

  useFrame(() => {
    if (group.current) {
        (group.current.children as any[]).forEach((child, index) => {
            if (index < 2) {
                child.material.zoom = 1 + data.range(0, 1 / 3) / 3;
            } else {
                child.material.zoom = 1 + data.range(1.15 / 3, 1 / 3) / 2;
            }
        });
    }
  });

  return (
    <group ref={group}>
      <Image position={[-2, 0, 0]} scale={[3, height / 1.1]} url={imageOne} />
      <Image position={[2, 0, 3]} scale={3} url={imageTwo} />
      <Image position={[-2.05, -height, 6]} scale={[1, 3]} url={imageThree} />
      <Image position={[-0.6, -height, 9]} scale={[1, 2]} url={imageOne} />
      <Image position={[0.75, -height, 10.5]} scale={1.5} url={imageTwo} />
    </group>
  );
}

function Typography() {
  const DEVICE = {
    mobile: { fontSize: 0.2 },
    tablet: { fontSize: 0.4 },
    desktop: { fontSize: 0.6 }
  };
  const getDevice = (): DeviceType => {
    const w = window.innerWidth;
    return w <= 639 ? 'mobile' : w <= 1023 ? 'tablet' : 'desktop';
  };

  const [device, setDevice] = useState<DeviceType>(getDevice());

  useEffect(() => {
    const onResize = () => setDevice(getDevice());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { fontSize } = DEVICE[device];

  return (
    <Text
      position={[0, 0, 12]}
      fontSize={fontSize}
      letterSpacing={-0.05}
      outlineWidth={0}
      outlineBlur="20%"
      outlineColor="#000"
      outlineOpacity={0.5}
      color="white"
      anchorX="center"
      anchorY="middle"
    >
      React Bits
    </Text>
  );
}

export { Images, Typography };
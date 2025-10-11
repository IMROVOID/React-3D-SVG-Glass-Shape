/* eslint-disable react/no-unknown-property */
import { useState, useEffect } from 'react';
import { useThree, type RootState } from '@react-three/fiber';
import { Image, Text } from '@react-three/drei';

import imageOne from './assets/demo/cs1.webp';
import imageTwo from './assets/demo/cs2.webp';
import imageThree from './assets/demo/cs3.webp';

type DeviceType = 'mobile' | 'tablet' | 'desktop';

function Images() {
  const { height } = useThree((s: RootState) => s.viewport);

  return (
    <group>
      <Image position={[-2, 0, 0]} scale={[3, height / 1.1]} url={imageOne} />
      <Image position={[2, 0, 3]} scale={3} url={imageTwo} />
      <Image position={[-2.05, -height, 6]} scale={[1, 3]} url={imageThree} />
      <Image position={[-0.6, -height, 9]} scale={[1, 2]} url={imageOne} />
      <Image position={[0.75, -height, 10.5]} scale={1.5} url={imageTwo} />
    </group>
  );
}

function Typography() {
  // MODIFICATION: Font sizes have been reduced to accommodate the longer text.
  const DEVICE = {
    mobile: { fontSize: 0.15 },
    tablet: { fontSize: 0.3 },
    desktop: { fontSize: 0.45 }
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
      {/* MODIFICATION: Text content changed as requested. */}
      3D SVG Glass Shape
    </Text>
  );
}

export { Images, Typography };
'use client';

import React, { useEffect, useState } from 'react';
import Earth from '@/components/ui/globe';

interface ClientOnlyGlobeProps {
  baseColor: [number, number, number];
  markerColor: [number, number, number];
  glowColor: [number, number, number];
  dark: number;
  scale: number;
  diffuse: number;
  mapBrightness: number;
  mapSamples: number;
  className?: string;
}

export default function ClientOnlyGlobe(props: ClientOnlyGlobeProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className={`${props.className || ''} aspect-square`} />;
  }

  return <Earth {...props} />;
}

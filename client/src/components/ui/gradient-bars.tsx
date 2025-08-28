'use client';

import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface GradientBarsProps {
  bars?: number;
  colors?: string[];
  intensity?: number;
}

export function GradientBars({
  bars = 20,
  colors,
  intensity = 0.4,
}: GradientBarsProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Set mounted state after hydration
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const isDark = resolvedTheme === 'dark';
  
  // Default colors based on theme
  const defaultColors = isDark 
    ? [`rgba(255, 255, 255, ${intensity})`, 'transparent'] 
    : [`rgba(0, 0, 0, ${intensity * 2})`, 'transparent'];
  
  const gradientColors = colors || defaultColors;
  const gradientStyle = `linear-gradient(to top, ${gradientColors.join(', ')})`;
  
  // Return a placeholder during server-side rendering or initial hydration
  if (!mounted) {
    return (
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="flex h-full w-full bg-transparent" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="flex h-full w-full">
        {Array.from({ length: bars }).map((_, index) => {
          const position = index / (bars - 1);
          const center = 0.5;
          const distance = Math.abs(position - center);
          const scale = 0.3 + 0.7 * Math.pow(distance * 2, 1.2);

          return (
            <motion.div
              key={`bg-bar-${index}`}
              className="flex-1 origin-bottom"
              style={{ background: gradientStyle }}
              animate={{
                scaleY: [scale, scale + 0.1, scale],
                opacity: [1, 0.95, 1],
              }}
              transition={{
                duration: 3,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'mirror',
                delay: index * 0.5,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

'use client';
import {
  motion,
  MotionValue,
  Transition,
  useAnimation,
  useMotionValue,
} from 'framer-motion';
import { useEffect, useState } from 'react';

type CircularTextProps = {
  text: string;
  spinDuration?: number;
  onHover?: 'slowDown' | 'speedUp' | 'pause' | 'goBonkers';
  className?: string;
};

const getRotationTransition = (
  duration: number,
  from: number,
  loop: boolean = true,
) => ({
  from,
  to: from + 360,
  ease: 'linear' as const,
  duration,
  type: 'tween' as const,
  repeat: loop ? Infinity : 0,
});

const getTransition = (duration: number, from: number) => ({
  rotate: getRotationTransition(duration, from),
  scale: {
    type: 'spring' as const,
    damping: 20,
    stiffness: 300,
  },
});

export function CircularText({
  text = 'Circular Text Animation • ',
  spinDuration = 20,
  onHover = 'speedUp',
  className = '',
}: Readonly<CircularTextProps>) {
  const letters = Array.from(text);
  const controls = useAnimation();
  const rotation = useMotionValue(0);
  const [mounted, setMounted] = useState(false);

  // Only run animations on the client side
  useEffect(() => {
    // Set mounted state to true to indicate client-side rendering
    setMounted(true);
    
    // Safely start animation only after component is mounted
    if (typeof window !== 'undefined') {
      const start = 0; // Always start from 0 to avoid null issues
      controls.start({
        rotate: start + 360,
        scale: 1,
        transition: getTransition(spinDuration, start),
      });
    }
  }, [spinDuration, text, onHover, controls]);

  const handleHoverStart = () => {
    // Only run on client side and when mounted
    if (typeof window === 'undefined' || !mounted || !onHover) return;
    
    // Safely get current rotation or default to 0
    const start = rotation.get() || 0;
    
    let transitionConfig: ReturnType<typeof getTransition> | Transition;
    let scaleVal = 1;

    switch (onHover) {
      case 'slowDown':
        transitionConfig = getTransition(spinDuration * 2, start);
        break;
      case 'speedUp':
        transitionConfig = getTransition(spinDuration / 4, start);
        break;
      case 'pause':
        transitionConfig = {
          rotate: { type: 'spring', damping: 20, stiffness: 300 },
          scale: { type: 'spring', damping: 20, stiffness: 300 },
        };
        break;
      case 'goBonkers':
        transitionConfig = getTransition(spinDuration / 20, start);
        scaleVal = 0.8;
        break;
      default:
        transitionConfig = getTransition(spinDuration, start);
    }

    controls.start({
      rotate: start + 360,
      scale: scaleVal,
      transition: transitionConfig,
    });
  };

  const handleHoverEnd = () => {
    // Only run on client side and when mounted
    if (typeof window === 'undefined' || !mounted) return;
    
    // Safely get current rotation or default to 0
    const start = rotation.get() || 0;
    
    controls.start({
      rotate: start + 360,
      scale: 1,
      transition: getTransition(spinDuration, start),
    });
  };

  // Don't render until client-side to prevent hydration mismatch
  if (!mounted) {
    return <div className="h-[200px] w-[200px]"></div>;
  }

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`relative m-0 mx-auto h-[200px] w-[200px] origin-center cursor-pointer rounded-full text-center font-black ${className}`}
        style={{ rotate: rotation }}
        initial={{ rotate: 0 }}
        animate={controls}
        onMouseEnter={handleHoverStart}
        onMouseLeave={handleHoverEnd}
      >
        {letters.map((letter, i) => {
          const rotationDeg = (360 / letters.length) * i;
          const factor = Math.PI / letters.length;
          const x = factor * i;
          const y = factor * i;
          const transform = `rotateZ(${rotationDeg}deg) translate3d(${x}px, ${y}px, 0)`;

          return (
            <span
              key={i}
              className="absolute inset-0 inline-block text-2xl font-bold transition-all duration-500 ease-out"
              style={{ transform, WebkitTransform: transform, textShadow: '0 0 5px rgba(0,0,0,0.3)' }}
            >
              {letter}
            </span>
          );
        })}
      </motion.div>
    </div>
  );
}

export default CircularText;

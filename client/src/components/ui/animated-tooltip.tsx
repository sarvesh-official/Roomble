"use client";
import Image from "next/image";
import React, { useState } from "react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";

export const AnimatedTooltip = ({
  items,
}: {
  items: {
    id: number;
    name: string;
    designation: string;
    image: string;
    githubUrl?: string;
    portfolioUrl?: string;
  }[];
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0);
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-10, 10]),
    springConfig
  );
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-15, 15]),
    springConfig
  );
  
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const centerX = rect.width / 2;
    x.set(mouseX - centerX);
  };

  return (
    <div className="flex items-center justify-center">
      {items.map((item) => (
        <div
          className="relative inline-block mx-1"
          key={item.name}
          onMouseEnter={() => setHoveredIndex(item.id)}
          onMouseLeave={() => setHoveredIndex(null)}
          onMouseMove={handleMouseMove}
        >
          <div className="relative">
            <Image
              height={40}
              width={40}
              src={item.image}
              alt={item.name}
              className="object-cover rounded-full h-10 w-10 md:h-12 md:w-12 border-2 hover:scale-105 hover:z-30 border-white transition duration-500"
            />
            
            <AnimatePresence>
              {hoveredIndex === item.id && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { type: "spring", stiffness: 260, damping: 10 },
                  }}
                  exit={{ opacity: 0, y: 10, scale: 0.8 }}
                  style={{
                    translateX,
                    rotate,
                  }}
                  className="absolute -top-24 -left-12 z-50 w-max max-w-[180px] flex flex-col items-center justify-center rounded-md bg-black shadow-xl px-4 py-2"
                >
                  <div className="absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px" />
                  <div className="absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px" />
                  <div className="font-bold text-white relative z-30 text-sm whitespace-nowrap">
                    {item.name}
                  </div>
                  <div className="text-white text-xs whitespace-nowrap">{item.designation}</div>
                  <div className="flex items-center space-x-2 mt-1">
                    {item.githubUrl && (
                      <a
                        href={item.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] bg-primary/10 hover:bg-primary/20 text-primary px-2 py-0.5 rounded-full transition-colors"
                      >
                        GitHub
                      </a>
                    )}
                    {item.portfolioUrl && (
                      <a
                        href={item.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] bg-muted hover:bg-muted/80 text-white px-2 py-0.5 rounded-full transition-colors"
                      >
                        Portfolio
                      </a>
                    )}
                  </div>
                  <div className="absolute bottom-[-6px] left-6 w-3 h-3 bg-black rotate-45"></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
};

'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import React from 'react';
import { BentoGridItem, BentoGridItemProps } from './bento-grid-item';

export interface BentoGridProps {
  items: (BentoGridItemProps & { size?: 'small' | 'medium' | 'large' })[];
  className?: string;
}

export function BentoGrid({ items, className }: BentoGridProps) {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <div className={cn("mx-auto max-w-6xl px-4 py-12", className)}>
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item, i) => (
          <BentoGridItem
            key={i}
            title={item.title}
            description={item.description}
            icon={item.icon}
            size={item.size}
            className={cn(
              item.size === 'large'
                ? 'col-span-6 md:col-span-4'
                : item.size === 'medium'
                  ? 'col-span-6 sm:col-span-2 md:col-span-3'
                  : 'col-span-6 sm:col-span-1 md:col-span-2',
              'h-full',
            )}
          />
        ))}
      </motion.div>
    </div>
  );
}

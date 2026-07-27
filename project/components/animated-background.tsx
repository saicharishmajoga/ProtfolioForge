'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedBackgroundProps {
  className?: string;
  variant?: 'default' | 'minimal';
}

export function AnimatedBackground({ className, variant = 'default' }: AnimatedBackgroundProps) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}>
      {variant === 'default' && (
        <>
          <motion.div
            className="absolute -top-40 -left-40 h-[32rem] w-[32rem] rounded-full bg-primary/20 blur-[120px]"
            animate={{ x: [0, 60, 0], y: [0, 40, 0], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-20 -right-40 h-[30rem] w-[30rem] rounded-full bg-accent/20 blur-[120px]"
            animate={{ x: [0, -50, 0], y: [0, 30, 0], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-0 left-1/3 h-[28rem] w-[28rem] rounded-full bg-secondary/15 blur-[120px]"
            animate={{ x: [0, 40, 0], y: [0, -30, 0], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          />
        </>
      )}
      {variant === 'minimal' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 dark:opacity-[0.07]" />
    </div>
  );
}

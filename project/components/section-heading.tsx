'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  className?: string;
  align?: 'left' | 'center';
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  className,
  align = 'center',
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-3',
        align === 'center' ? 'items-center text-center' : 'items-start text-left',
        className
      )}
    >
      {eyebrow && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary"
        >
          {eyebrow}
        </motion.span>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl md:text-[2.5rem] md:leading-[1.1]"
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            'max-w-2xl text-base text-muted-foreground sm:text-lg',
            align === 'center' && 'mx-auto'
          )}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}

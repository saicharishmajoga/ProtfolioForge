'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Check } from 'lucide-react';
import { AnimatedBackground } from '@/components/animated-background';

const highlights = [
  'Build a portfolio in under 10 minutes',
  'Six professionally designed themes',
  'Live preview as you type',
  'One-click publish with custom URL',
  'Download as a static site',
  'Dark mode on every theme',
];

export function AuthLayout({
  children,
  title,
  subtitle,
  footer,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footer: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      {/* Left - Illustration */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-brand p-12 lg:flex">
        <AnimatedBackground variant="minimal" />
        <Link href="/" className="relative flex items-center gap-2 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold">PortfolioForge</span>
        </Link>
        <div className="relative text-white">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold leading-tight"
          >
            Build a portfolio that gets you hired.
          </motion.h2>
          <ul className="mt-8 space-y-4">
            {highlights.map((h, i) => (
              <motion.li
                key={h}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                className="flex items-center gap-3 text-white/90"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                  <Check className="h-3.5 w-3.5" />
                </div>
                {h}
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="relative text-sm text-white/70">
          © {new Date().getFullYear()} PortfolioForge. All rights reserved.
        </div>
      </div>

      {/* Right - Form */}
      <div className="relative flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-12">
        <div className="w-full max-w-md">
          <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold">PortfolioForge</span>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8"
          >
            {children}
          </motion.div>
          <div className="mt-6 text-center text-sm text-muted-foreground">{footer}</div>
        </div>
      </div>
    </div>
  );
}

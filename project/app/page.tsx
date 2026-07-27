'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles, Rocket,
  ArrowRight, Star,
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { AnimatedBackground } from '@/components/animated-background';
import { FadeIn } from '@/components/motion';
import { GradientButton } from '@/components/ui/gradient-button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { THEME_PRESETS } from '@/lib/portfolio-data';

const heroAvatars = [
  'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=120',
  'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=120',
  'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=120',
  'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=120',
];

export default function LandingPage() {
  const preset = THEME_PRESETS['minimal'];

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative flex min-h-screen items-center justify-center pt-24">
        <AnimatedBackground />
        <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="flex flex-col items-start gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" className="mb-4 gap-1.5 border-primary/20 bg-primary/5 px-3 py-1.5 text-primary">
                <Sparkles className="h-3.5 w-3.5" /> No code required
              </Badge>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Build Your Developer{' '}
              <span className="text-gradient">Portfolio</span> in Minutes
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-xl text-lg text-muted-foreground sm:text-xl"
            >
              Create a stunning, professional portfolio website without writing a single line of code. Customize themes, preview live, and publish in one click.
            </motion.p>

          </div>

          {/* Browser Mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-3xl bg-gradient-brand opacity-20 blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl border bg-card shadow-2xl">
              <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-destructive/70" />
                  <div className="h-3 w-3 rounded-full bg-warning/70" />
                  <div className="h-3 w-3 rounded-full bg-success/70" />
                </div>
                <div className="ml-3 flex-1 rounded-md border bg-background px-3 py-1 text-xs text-muted-foreground">
                  portfolioforge.app/alex-morgan
                </div>
              </div>
              <div className="h-[420px] overflow-hidden" style={{ background: preset.background }}>
                <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                  <div
                    className="h-20 w-20 rounded-full ring-4"
                    style={{ borderColor: preset.primaryColor, background: `linear-gradient(135deg, ${preset.primaryColor}, ${preset.accentColor})` }}
                  />
                  <div>
                    <h3 className="text-xl font-bold" style={{ color: '#0F172A' }}>
                      PortfolioForge
                    </h3>
                    <p className="text-sm" style={{ color: preset.primaryColor }}>Build portfolio in minutes</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {['React', 'Next.js', 'Node.js', 'AWS'].map((s) => (
                      <span key={s} className="px-2.5 py-1 text-xs font-medium rounded-md" style={{ background: `${preset.primaryColor}20`, color: preset.primaryColor }}>
                        {s}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
                    {[1, 2].map((i) => (
                      <div key={i} className="rounded-lg border p-3 text-left" style={{ borderColor: `${preset.primaryColor}30`, background: 'rgba(255,255,255,0.6)' }}>
                        <div className="h-12 rounded-md mb-2" style={{ background: `linear-gradient(135deg, ${preset.primaryColor}30, ${preset.accentColor}30)` }} />
                        <p className="text-xs font-bold" style={{ color: '#0F172A' }}>
                          Project {i}
                        </p>
                        <p className="text-[10px]" style={{ color: '#64748B' }}>
                          A great project
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -right-4 -top-4 flex items-center gap-2 rounded-xl border bg-card px-3 py-2 shadow-lg"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-success/15">
                <Rocket className="h-4 w-4 text-success" />
              </div>
              <div className="text-xs">
                <p className="font-semibold">Published!</p>
                <p className="text-muted-foreground">Just now</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-brand p-12 text-center text-white shadow-2xl shadow-primary/30">
              <div className="absolute inset-0 bg-grid-pattern opacity-20" />
              <div className="relative">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Ready to build your portfolio?
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-white/90">
                  Join thousands of developers who've launched their careers with PortfolioForge. It's free to start.
                </p>
                <Link href="/register" className="mt-8 inline-block">
                  <GradientButton variant="solid" size="lg" className="gap-2 bg-white text-primary hover:bg-white/90">
                    Get Started Free <ArrowRight className="h-4 w-4" />
                  </GradientButton>
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}

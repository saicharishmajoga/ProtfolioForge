'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Moon, Sun, Sparkles } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { GradientButton } from '@/components/ui/gradient-button';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/builder', label: 'Builder' },
  { href: '/dashboard/portfolios', label: 'My Portfolios' },
];

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => setMounted(true), []);
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled ? 'glass border-b border-border/40 py-3' : 'py-5'
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand shadow-lg shadow-primary/30">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight">PortfolioForge</span>
        </Link>

        <div className="flex items-center gap-2">
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-lg"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          )}
          <Link href="/login" className="hidden sm:block">
            <Button variant="ghost" className="text-sm font-medium">Sign in</Button>
          </Link>
          <Link href="/register" className="hidden sm:block">
            <GradientButton size="sm">Get Started</GradientButton>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden md:hidden"
          >
            <div className="mx-4 mt-3 flex flex-col gap-1 rounded-2xl border bg-card p-4 shadow-lg">
              <div className="flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">Sign in</Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <GradientButton className="w-full">Get Started</GradientButton>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

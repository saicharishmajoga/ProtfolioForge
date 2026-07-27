'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Check, Share2, Twitter, Linkedin, Facebook, Rocket, QrCode, ExternalLink, ChevronLeft, Sparkles } from 'lucide-react';
import { GradientButton } from '@/components/ui/gradient-button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function PublishPage() {
  const [published, setPublished] = React.useState(false);
  const [publishing, setPublishing] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const url = 'portfolioforge.app/alex-morgan';

  const copy = () => {
    navigator.clipboard.writeText(`https://${url}`);
    setCopied(true);
    toast.success('Link copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const publish = () => {
    setPublishing(true);
    setTimeout(() => { setPublishing(false); setPublished(true); toast.success('Portfolio published!'); }, 1500);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <AnimatedBg />
      <header className="relative flex h-16 items-center justify-between border-b bg-card/80 px-4 backdrop-blur sm:px-6">
        <Link href="/builder" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4" /> Back to builder
        </Link>
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-brand"><Sparkles className="h-4 w-4 text-white" /></div>
          <span className="font-bold">PortfolioForge</span>
        </Link>
      </header>

      <main className="relative mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Publish Your Portfolio</h1>
          <p className="mt-2 text-muted-foreground">Share it with the world. You can update it anytime.</p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!published ? (
            <motion.div key="form" exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
              <Card>
                <CardHeader><CardTitle className="text-base">Your Portfolio URL</CardTitle><CardDescription>This is where your portfolio will be live</CardDescription></CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2">
                    <Input value={url} readOnly className="flex-1" />
                    <GradientButton variant="outline" onClick={copy} className="shrink-0">
                      {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                      {copied ? 'Copied' : 'Copy'}
                    </GradientButton>
                  </div>
                </CardContent>
              </Card>



              <Card>
                <CardHeader><CardTitle className="text-base">Share</CardTitle><CardDescription>Spread the word</CardDescription></CardHeader>
                <CardContent className="flex gap-3">
                  {[Twitter, Linkedin, Facebook].map((Icon, i) => (
                    <button key={i} onClick={() => toast.success('Shared!')} className="flex h-11 w-11 items-center justify-center rounded-xl border bg-card transition-colors hover:bg-muted">
                      <Icon className="h-5 w-5" />
                    </button>
                  ))}
                  <button onClick={copy} className="flex h-11 w-11 items-center justify-center rounded-xl border bg-card transition-colors hover:bg-muted">
                    <Share2 className="h-5 w-5" />
                  </button>
                </CardContent>
              </Card>

              <div className="flex justify-center pt-4">
                <GradientButton size="lg" className="gap-2" loading={publishing} onClick={publish}>
                  <Rocket className="h-5 w-5" /> Publish Portfolio
                </GradientButton>
              </div>
            </motion.div>
          ) : (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-6 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                className="flex h-24 w-24 items-center justify-center rounded-full bg-success/15"
              >
                <Check className="h-12 w-12 text-success" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold">Your portfolio is live!</h2>
                <p className="mt-1 text-muted-foreground">Share it with recruiters, friends, and the world.</p>
              </div>
              <Badge variant="secondary" className="gap-1.5 py-1.5">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" /> Live
              </Badge>
              <div className="flex w-full max-w-md items-center gap-2">
                <Input value={`https://${url}`} readOnly />
                <GradientButton variant="outline" onClick={copy}>{copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}</GradientButton>
              </div>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <a href={`https://${url}`} target="_blank" rel="noreferrer">
                  <GradientButton className="gap-2"><ExternalLink className="h-4 w-4" /> View Portfolio</GradientButton>
                </a>
                <Link href="/dashboard">
                  <GradientButton variant="outline" className="gap-2">Go to Dashboard</GradientButton>
                </Link>
                <Link href="/builder">
                  <GradientButton variant="ghost" className="gap-2">Keep Editing</GradientButton>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function AnimatedBg() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-primary/15 blur-[100px]" animate={{ opacity: [0.4, 0.7, 0.4] }} transition={{ duration: 6, repeat: Infinity }} />
      <motion.div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-accent/15 blur-[100px]" animate={{ opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 8, repeat: Infinity }} />
    </div>
  );
}

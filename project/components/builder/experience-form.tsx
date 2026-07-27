'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Briefcase } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GradientButton } from '@/components/ui/gradient-button';
import { toast } from 'sonner';

export function ExperienceForm() {
  const { data, addExperience, updateExperience, removeExperience } = usePortfolio();

  const add = () => {
    addExperience({ id: `x${Date.now()}`, company: 'New Company', role: '', start: '', end: '', description: '', logo: '' });
    toast.success('Experience added');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Experience</h2>
          <p className="text-sm text-muted-foreground">Your professional journey.</p>
        </div>
        <GradientButton size="sm" onClick={add} className="gap-1.5"><Plus className="h-4 w-4" /> Add</GradientButton>
      </div>

      <div className="relative space-y-4 before:absolute before:left-5 before:top-0 before:h-full before:w-px before:bg-border">
        <AnimatePresence>
          {data.experience.map((e) => (
            <motion.div key={e.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <Card className="relative ml-12">
                <div className="absolute -left-[34px] top-6 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-accent text-white">
                  <Briefcase className="h-4 w-4" />
                </div>
                <CardHeader className="flex-row items-center justify-between py-3">
                  <CardTitle className="text-base">{e.role || 'Untitled'} · {e.company}</CardTitle>
                  <button onClick={() => { removeExperience(e.id); toast.success('Removed'); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5"><Label className="text-xs">Company</Label><Input value={e.company} onChange={(ev) => updateExperience(e.id, { company: ev.target.value })} /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Role</Label><Input value={e.role} onChange={(ev) => updateExperience(e.id, { role: ev.target.value })} placeholder="Software Engineer" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Start</Label><Input value={e.start} onChange={(ev) => updateExperience(e.id, { start: ev.target.value })} placeholder="2022" /></div>
                  <div className="space-y-1.5"><Label className="text-xs">End</Label><Input value={e.end} onChange={(ev) => updateExperience(e.id, { end: ev.target.value })} placeholder="Present" /></div>
                  <div className="space-y-1.5 sm:col-span-2"><Label className="text-xs">Description</Label><Textarea value={e.description} onChange={(ev) => updateExperience(e.id, { description: ev.target.value })} className="min-h-[60px]" /></div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {data.experience.length === 0 && (
        <Card className="flex flex-col items-center justify-center border-dashed border-2 py-16 text-center">
          <p className="text-muted-foreground">No experience entries yet.</p>
          <GradientButton className="mt-4 gap-1.5" onClick={add}><Plus className="h-4 w-4" /> Add experience</GradientButton>
        </Card>
      )}
    </div>
  );
}

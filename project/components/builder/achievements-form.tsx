'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Trophy } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GradientButton } from '@/components/ui/gradient-button';
import { toast } from 'sonner';

export function AchievementsForm() {
  const { data, addAchievement, updateAchievement, removeAchievement } = usePortfolio();

  const add = () => {
    addAchievement({ id: `a${Date.now()}`, title: 'New Achievement', description: '', date: '' });
    toast.success('Achievement added');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Achievements</h2>
          <p className="text-sm text-muted-foreground">Awards, talks, and notable accomplishments.</p>
        </div>
        <GradientButton size="sm" onClick={add} className="gap-1.5"><Plus className="h-4 w-4" /> Add</GradientButton>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {data.achievements.map((a) => (
            <motion.div key={a.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -50 }}>
              <Card>
                <CardHeader className="flex-row items-center justify-between py-3">
                  <CardTitle className="text-base flex items-center gap-2"><Trophy className="h-4 w-4 text-warning" /> {a.title}</CardTitle>
                  <button onClick={() => { removeAchievement(a.id); toast.success('Removed'); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="space-y-1.5"><Label className="text-xs">Title</Label><Input value={a.title} onChange={(e) => updateAchievement(a.id, { title: e.target.value })} /></div>
                    <div className="space-y-1.5"><Label className="text-xs">Date</Label><Input value={a.date} onChange={(e) => updateAchievement(a.id, { date: e.target.value })} /></div>
                  </div>
                  <div className="space-y-1.5"><Label className="text-xs">Description</Label><Textarea value={a.description} onChange={(e) => updateAchievement(a.id, { description: e.target.value })} className="min-h-[60px]" /></div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {data.achievements.length === 0 && (
        <Card className="flex flex-col items-center justify-center border-dashed border-2 py-16 text-center">
          <p className="text-muted-foreground">No achievements yet.</p>
          <GradientButton className="mt-4 gap-1.5" onClick={add}><Plus className="h-4 w-4" /> Add achievement</GradientButton>
        </Card>
      )}
    </div>
  );
}

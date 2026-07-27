'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GraduationCap } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GradientButton } from '@/components/ui/gradient-button';
import { toast } from 'sonner';

export function EducationForm() {
  const { data, addEducation, updateEducation, removeEducation } = usePortfolio();

  const add = () => {
    addEducation({ id: `e${Date.now()}`, institution: 'New Institution', degree: '', field: '', start: '', end: '', description: '' });
    toast.success('Education entry added');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Education</h2>
          <p className="text-sm text-muted-foreground">Your academic background.</p>
        </div>
        <GradientButton size="sm" onClick={add} className="gap-1.5"><Plus className="h-4 w-4" /> Add</GradientButton>
      </div>

      <div className="relative space-y-4 before:absolute before:left-5 before:top-0 before:h-full before:w-px before:bg-border">
        <AnimatePresence>
          {data.education.map((e) => (
            <motion.div key={e.id} layout initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
              <Card className="relative ml-12">
                <div className="absolute -left-[34px] top-6 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-primary text-white">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <CardHeader className="flex-row items-center justify-between py-3">
                  <CardTitle className="text-base">{e.institution || 'Untitled'}</CardTitle>
                  <button onClick={() => { removeEducation(e.id); toast.success('Removed'); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5"><Label className="text-xs">Institution</Label><Input value={e.institution} onChange={(ev) => updateEducation(e.id, { institution: ev.target.value })} /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Degree</Label><Input value={e.degree} onChange={(ev) => updateEducation(e.id, { degree: ev.target.value })} placeholder="B.S." /></div>
                  <div className="space-y-1.5"><Label className="text-xs">Field of Study</Label><Input value={e.field} onChange={(ev) => updateEducation(e.id, { field: ev.target.value })} placeholder="Computer Science" /></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5"><Label className="text-xs">Start</Label><Input value={e.start} onChange={(ev) => updateEducation(e.id, { start: ev.target.value })} placeholder="2017" /></div>
                    <div className="space-y-1.5"><Label className="text-xs">End</Label><Input value={e.end} onChange={(ev) => updateEducation(e.id, { end: ev.target.value })} placeholder="2019" /></div>
                  </div>
                  <div className="space-y-1.5 sm:col-span-2"><Label className="text-xs">Description</Label><Textarea value={e.description} onChange={(ev) => updateEducation(e.id, { description: ev.target.value })} className="min-h-[60px]" /></div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {data.education.length === 0 && (
        <Card className="flex flex-col items-center justify-center border-dashed border-2 py-16 text-center">
          <p className="text-muted-foreground">No education entries yet.</p>
          <GradientButton className="mt-4 gap-1.5" onClick={add}><Plus className="h-4 w-4" /> Add education</GradientButton>
        </Card>
      )}
    </div>
  );
}

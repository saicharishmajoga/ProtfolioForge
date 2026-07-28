'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, GripVertical, Upload, ExternalLink, Github, X } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import type { Project } from '@/lib/portfolio-data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GradientButton } from '@/components/ui/gradient-button';
import { toast } from 'sonner';

export function ProjectsForm() {
  const { data, addProject, updateProject, removeProject, reorderProjects } = usePortfolio();
  const [dragIndex, setDragIndex] = React.useState<number | null>(null);

  const add = () => {
    addProject({
      id: `p${Date.now()}`,
      title: 'New Project',
      description: 'Describe your project...',
      tech: [],
      github: '',
      live: '',
      image: '',
    });
    toast.success('Project added');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Projects</h2>
          <p className="text-sm text-muted-foreground">Showcase your best work. Drag to reorder.</p>
        </div>
        <GradientButton size="sm" onClick={add} className="gap-1.5"><Plus className="h-4 w-4" /> Add Project</GradientButton>
      </div>

      <AnimatePresence>
        {data.projects.map((p, i) => (
          <motion.div
            key={p.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -100 }}
            draggable
            onDragStart={() => setDragIndex(i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragIndex !== null && dragIndex !== i) reorderProjects(dragIndex, i);
              setDragIndex(null);
            }}
          >
            <Card className={dragIndex === i ? 'border-primary opacity-50' : ''}>
              <CardHeader className="flex-row items-center justify-between py-3">
                <div className="flex items-center gap-2">
                  <GripVertical className="h-5 w-5 cursor-grab text-muted-foreground" />
                  <CardTitle className="text-base">{p.title || 'Untitled Project'}</CardTitle>
                </div>
                <button onClick={() => { removeProject(p.id); toast.success('Project removed'); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-lg border bg-muted">
                    {p.image ? (
                      <>
                        <img src={p.image} alt={p.title} className="h-full w-full object-cover" />
                        <button onClick={() => updateProject(p.id, { image: '' })} className="absolute right-2.5 top-2.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors shadow">
                          <X className="h-3 w-3" />
                        </button>
                      </>
                    ) : (
                      <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-1 text-xs text-muted-foreground hover:bg-muted/50">
                        <Upload className="h-4 w-4" /> Upload
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              updateProject(p.id, { image: reader.result as string });
                              toast.success('Project image uploaded');
                            };
                            reader.readAsDataURL(f);
                          }
                        }} />
                      </label>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <Input value={p.title} onChange={(e) => updateProject(p.id, { title: e.target.value })} placeholder="Project title" />
                    <Input value={p.tech.join(', ')} onChange={(e) => updateProject(p.id, { tech: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })} placeholder="React, Node.js, MongoDB" />
                  </div>
                </div>
                <Textarea value={p.description} onChange={(e) => updateProject(p.id, { description: e.target.value })} placeholder="Describe what the project does and your role..." className="min-h-[80px]" />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1 text-xs"><Github className="h-3 w-3" /> GitHub URL</Label>
                    <Input value={p.github} onChange={(e) => updateProject(p.id, { github: e.target.value })} placeholder="github.com/user/repo" />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1 text-xs"><ExternalLink className="h-3 w-3" /> Live URL</Label>
                    <Input value={p.live} onChange={(e) => updateProject(p.id, { live: e.target.value })} placeholder="myproject.app" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {data.projects.length === 0 && (
        <Card className="flex flex-col items-center justify-center border-dashed border-2 py-16 text-center">
          <p className="text-muted-foreground">No projects yet.</p>
          <GradientButton className="mt-4 gap-1.5" onClick={add}><Plus className="h-4 w-4" /> Add your first project</GradientButton>
        </Card>
      )}
    </div>
  );
}

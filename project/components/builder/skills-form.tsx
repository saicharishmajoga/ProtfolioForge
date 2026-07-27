'use client';

import * as React from 'react';
import { 
  X, Plus, Check, Layout, Code2, Database, Cloud, Server, 
  PenTool, Smartphone, Shield, BarChart3, Wrench, GitBranch 
} from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { SKILL_OPTIONS } from '@/lib/portfolio-data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { GradientButton } from '@/components/ui/gradient-button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

function getSkillIcon(skill: string) {
  const name = skill.toLowerCase();
  if (/database|sql|postgres|mongo|redis|mysql|sqlite|prisma|supabase|firebase/i.test(name)) return Database;
  if (/aws|gcp|azure|cloud|docker|kubernetes|nginx|jenkins|ci\/cd|devops/i.test(name)) return Cloud;
  if (/server|node|express|nest|spring|rails|laravel|backend|graphql|rest/i.test(name)) return Server;
  if (/figma|design|ui|ux|photoshop|illustrator|adobe|canvas/i.test(name)) return PenTool;
  if (/git|github|gitlab|bitbucket/i.test(name)) return GitBranch;
  if (/mobile|ios|android|swift|kotlin|flutter|dart|react\s+native/i.test(name)) return Smartphone;
  if (/security|auth|jwt|oauth|shield|cyber/i.test(name)) return Shield;
  if (/pandas|numpy|scikit|tensor|pytorch|learning|analytics|charts|recharts|d3|python|r|data/i.test(name)) return BarChart3;
  if (/react|next|vue|angular|svelte|html|css|tailwind|bootstrap|sass|scss|front/i.test(name)) return Layout;
  if (/typescript|javascript|js|ts|java|c\+\+|c#|go|rust|ruby|php|kotlin|programming|code/i.test(name)) return Code2;
  return Wrench;
}

export function SkillsForm() {
  const { data, setSkills } = usePortfolio();
  const [custom, setCustom] = React.useState('');
  const [search, setSearch] = React.useState('');

  const toggle = (skill: string) => {
    if (data.skills.includes(skill)) {
      setSkills(data.skills.filter((s) => s !== skill));
    } else {
      setSkills([...data.skills, skill]);
    }
  };

  const addCustom = () => {
    const s = custom.trim();
    if (!s) return;
    if (data.skills.includes(s)) { toast.error('Skill already added'); return; }
    setSkills([...data.skills, s]);
    setCustom('');
  };

  const filtered = SKILL_OPTIONS.filter((s) => s.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Skills</h2>
        <p className="text-sm text-muted-foreground">Select your skills or add custom ones.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Your Skills ({data.skills.length})</CardTitle></CardHeader>
        <CardContent>
          {data.skills.length === 0 ? (
            <p className="text-sm text-muted-foreground">No skills added yet. Select from the list below.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.skills.map((s) => {
                const Icon = getSkillIcon(s);
                return (
                  <button key={s} onClick={() => toggle(s)} className="group flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-destructive/10 hover:text-destructive">
                    <Icon className="h-3.5 w-3.5" />
                    {s}
                    <X className="h-3.5 w-3.5" />
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Add Custom Skill</CardTitle></CardHeader>
        <CardContent className="flex gap-2">
          <Input value={custom} onChange={(e) => setCustom(e.target.value)} placeholder="e.g. Rust, WebAssembly..." onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustom())} />
          <GradientButton variant="outline" onClick={addCustom}><Plus className="h-4 w-4" /> Add</GradientButton>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Popular Skills</CardTitle><CardDescription>Click to add or remove</CardDescription></CardHeader>
        <CardContent className="space-y-4">
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search skills..." />
          <div className="flex flex-wrap gap-2">
            {filtered.map((s) => {
              const active = data.skills.includes(s);
              const Icon = getSkillIcon(s);
              return (
                <button
                  key={s}
                  onClick={() => toggle(s)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                    active ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground'
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {s}
                  {active && <Check className="h-3.5 w-3.5" />}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

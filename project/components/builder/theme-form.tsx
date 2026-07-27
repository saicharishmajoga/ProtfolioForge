'use client';

import * as React from 'react';
import { Check } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { THEME_PRESETS, type ThemeId } from '@/lib/portfolio-data';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const FONTS = ['Inter', 'Manrope', 'Geist', 'Georgia', 'Courier New'];
const CARD_STYLES = [
  { id: 'solid', label: 'Solid', desc: 'Clean flat cards' },
  { id: 'glass', label: 'Glass', desc: 'Frosted glass effect' },
  { id: 'bordered', label: 'Bordered', desc: 'Outlined cards' },
] as const;
const BUTTON_STYLES = [
  { id: 'gradient', label: 'Gradient' },
  { id: 'solid', label: 'Solid' },
  { id: 'outline', label: 'Outline' },
] as const;

export function ThemeForm() {
  const { data, updateTheme, applyThemePreset } = usePortfolio();
  const t = data.theme;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Theme</h2>
        <p className="text-sm text-muted-foreground">Customize the look and feel of your portfolio.</p>
      </div>

      {/* Presets */}
      <Card>
        <CardHeader><CardTitle className="text-base">Theme Presets</CardTitle><CardDescription>Start with a pre-designed theme</CardDescription></CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(Object.keys(THEME_PRESETS) as ThemeId[]).map((id) => {
            const tp = THEME_PRESETS[id];
            const active = t.id === id;
            return (
              <button
                key={id}
                onClick={() => { applyThemePreset(id); toast.success(`Theme: ${tp.name}`); }}
                className={cn(
                  'relative overflow-hidden rounded-xl border-2 p-3 text-left transition-all hover:-translate-y-0.5',
                  active ? 'border-primary shadow-md' : 'border-border'
                )}
              >
                <div className="mb-2 h-16 rounded-lg" style={{ background: `linear-gradient(135deg, ${tp.primaryColor}, ${tp.accentColor})` }} />
                <p className="text-xs font-semibold">{tp.name}</p>
                <p className="text-[10px] text-muted-foreground">{tp.description}</p>
                {active && <div className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white"><Check className="h-3 w-3" /></div>}
              </button>
            );
          })}
        </CardContent>
      </Card>

      {/* Colors */}
      <Card>
        <CardHeader><CardTitle className="text-base">Colors</CardTitle><CardDescription>Fine-tune your palette</CardDescription></CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>Primary Color</Label>
            <div className="flex items-center gap-2">
              <input type="color" value={t.primaryColor} onChange={(e) => updateTheme({ primaryColor: e.target.value })} className="h-10 w-14 cursor-pointer rounded-lg border" />
              <input type="text" value={t.primaryColor} onChange={(e) => updateTheme({ primaryColor: e.target.value })} className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Accent Color</Label>
            <div className="flex items-center gap-2">
              <input type="color" value={t.accentColor} onChange={(e) => updateTheme({ accentColor: e.target.value })} className="h-10 w-14 cursor-pointer rounded-lg border" />
              <input type="text" value={t.accentColor} onChange={(e) => updateTheme({ accentColor: e.target.value })} className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Background</Label>
            <div className="flex items-center gap-2">
              <input type="color" value={t.background} onChange={(e) => updateTheme({ background: e.target.value })} className="h-10 w-14 cursor-pointer rounded-lg border" />
              <input type="text" value={t.background} onChange={(e) => updateTheme({ background: e.target.value })} className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Typography & Layout */}
      <Card>
        <CardHeader><CardTitle className="text-base">Typography & Layout</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <Label>Font Family</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {FONTS.map((f) => (
                <button key={f} onClick={() => updateTheme({ font: f })} className={cn('rounded-lg border-2 px-3 py-2 text-sm transition-colors', t.font === f ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/40')} style={{ fontFamily: f }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Border Radius</Label>
              <span className="text-sm text-muted-foreground">{t.borderRadius}px</span>
            </div>
            <Slider value={[t.borderRadius]} min={0} max={24} step={2} onValueChange={(v) => updateTheme({ borderRadius: v[0] })} />
          </div>
        </CardContent>
      </Card>

      {/* Card & Button Style */}
      <Card>
        <CardHeader><CardTitle className="text-base">Card & Button Style</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Card Style</Label>
            <div className="grid grid-cols-3 gap-2">
              {CARD_STYLES.map((s) => (
                <button key={s.id} onClick={() => updateTheme({ cardStyle: s.id })} className={cn('rounded-lg border-2 p-3 text-left transition-colors', t.cardStyle === s.id ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40')}>
                  <p className="text-sm font-semibold">{s.label}</p>
                  <p className="text-xs text-muted-foreground">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Button Style</Label>
            <div className="grid grid-cols-3 gap-2">
              {BUTTON_STYLES.map((s) => (
                <button key={s.id} onClick={() => updateTheme({ buttonStyle: s.id })} className={cn('rounded-lg border-2 p-3 text-center text-sm font-semibold transition-colors', t.buttonStyle === s.id ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-primary/40')}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between rounded-lg border p-3">
            <div><p className="font-medium">Animations</p><p className="text-sm text-muted-foreground">Enable smooth transitions</p></div>
            <button
              type="button"
              onClick={() => updateTheme({ animations: !t.animations })}
              className={cn(
                'relative h-6 w-11 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
                t.animations ? 'bg-primary' : 'bg-muted'
              )}
            >
              <span
                className="absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-200"
                style={{
                  transform: t.animations ? 'translateX(20px)' : 'translateX(0px)',
                }}
              />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

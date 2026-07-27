'use client';

import { usePortfolio } from '@/lib/portfolio-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, Share2 } from 'lucide-react';

export function ContactForm() {
  const { data, updateContact } = usePortfolio();
  const c = data.contact;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Contact</h2>
        <p className="text-sm text-muted-foreground">Choose what contact info to display.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Display Options</CardTitle><CardDescription>Toggle what visitors can see</CardDescription></CardHeader>
        <CardContent className="space-y-1">
          <ToggleRow icon={Mail} label="Show email address" desc="Display your email on the contact section" checked={c.showEmail} onChange={(v) => updateContact({ showEmail: v })} />
          <Separator />
          <ToggleRow icon={Phone} label="Show phone number" desc="Display your phone number" checked={c.showPhone} onChange={(v) => updateContact({ showPhone: v })} />
          <Separator />
          <ToggleRow icon={Share2} label="Show social links" desc="Display GitHub, LinkedIn, and Twitter" checked={c.showSocial} onChange={(v) => updateContact({ showSocial: v })} />
        </CardContent>
      </Card>
    </div>
  );
}

function ToggleRow({ icon: Icon, label, desc, checked, onChange }: { icon: any; label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>
        <div><p className="font-medium">{label}</p><p className="text-sm text-muted-foreground">{desc}</p></div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

'use client';

import * as React from 'react';
import { Camera, Upload } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

export function ProfileForm() {
  const { data, updateProfile, completion } = usePortfolio();
  const p = data.profile;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Profile</h2>
        <p className="text-sm text-muted-foreground">Your basic information and social links.</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-6 sm:flex-row">
          <Avatar className="h-20 w-20">
            <AvatarImage src={p.photo} alt={p.fullName} />
            <AvatarFallback>{p.fullName?.charAt(0) || '?'}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center gap-2 sm:flex-row">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted">
              <Upload className="h-4 w-4" /> Upload photo
              <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    updateProfile({ photo: reader.result as string });
                    toast.success('Photo uploaded');
                  };
                  reader.readAsDataURL(f);
                }
              }} />
            </label>
            <p className="text-xs text-muted-foreground">JPG, PNG. Max 2MB.</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Completion: {completion}%</CardTitle>
          <Progress value={completion} className="mt-2" />
        </CardHeader>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Basic Information</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full Name" value={p.fullName} onChange={(v) => updateProfile({ fullName: v })} placeholder="Alex Morgan" />
          <Field label="Job Title" value={p.jobTitle} onChange={(v) => updateProfile({ jobTitle: v })} placeholder="Full-Stack Developer" />
          <Field label="Location" value={p.location} onChange={(v) => updateProfile({ location: v })} placeholder="San Francisco, CA" />
          <Field label="Email" value={p.email} onChange={(v) => updateProfile({ email: v })} placeholder="you@example.com" type="email" />
          <Field label="Phone" value={p.phone} onChange={(v) => updateProfile({ phone: v })} placeholder="+1 (555) 123-4567" />
          <Field label="Website" value={p.website} onChange={(v) => updateProfile({ website: v })} placeholder="yoursite.dev" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Social Links</CardTitle><CardDescription>Connect your professional profiles</CardDescription></CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="GitHub" value={p.github} onChange={(v) => updateProfile({ github: v })} placeholder="github.com/username" />
          <Field label="LinkedIn" value={p.linkedin} onChange={(v) => updateProfile({ linkedin: v })} placeholder="linkedin.com/in/username" />
          <Field label="Twitter" value={p.twitter} onChange={(v) => updateProfile({ twitter: v })} placeholder="@username" />
          <Field label="Portfolio URL" value={p.portfolioUrl} onChange={(v) => updateProfile({ portfolioUrl: v })} placeholder="portfolioforge.app/username" />
        </CardContent>
      </Card>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

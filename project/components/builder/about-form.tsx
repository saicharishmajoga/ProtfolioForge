'use client';

import * as React from 'react';
import { Sparkles } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { GradientButton } from '@/components/ui/gradient-button';
import { toast } from 'sonner';

const MAX = 500;

export function AboutForm() {
  const { data, setAbout } = usePortfolio();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">About</h2>
        <p className="text-sm text-muted-foreground">Tell visitors who you are and what you do.</p>
      </div>
      <Card>
        <CardHeader className="flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Your Bio</CardTitle>
            <CardDescription>Write a compelling introduction</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Textarea
            value={data.about}
            onChange={(e) => setAbout(e.target.value)}
            placeholder="I'm a full-stack developer with 5+ years of experience..."
            className="min-h-[160px]"
            maxLength={MAX}
          />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{data.about.length}/{MAX} characters</span>
            <span className="flex items-center gap-1"><Sparkles className="h-3 w-3" /> Tip: Keep it concise and impactful</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

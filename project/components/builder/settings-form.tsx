'use client';

import * as React from 'react';
import { RotateCcw, Download, Eye, Code } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

function getSkillIconName(skill: string): string {
  const name = skill.toLowerCase();
  if (/database|sql|postgres|mongo|redis|mysql|sqlite|prisma|supabase|firebase/i.test(name)) return 'database';
  if (/aws|gcp|azure|cloud|docker|kubernetes|nginx|jenkins|ci\/cd|devops/i.test(name)) return 'cloud';
  if (/server|node|express|nest|spring|rails|laravel|backend|graphql|rest/i.test(name)) return 'server';
  if (/figma|design|ui|ux|photoshop|illustrator|adobe|canvas/i.test(name)) return 'pen-tool';
  if (/git|github|gitlab|bitbucket/i.test(name)) return 'git-branch';
  if (/mobile|ios|android|swift|kotlin|flutter|dart|react\s+native/i.test(name)) return 'smartphone';
  if (/security|auth|jwt|oauth|shield|cyber/i.test(name)) return 'shield';
  if (/pandas|numpy|scikit|tensor|pytorch|learning|analytics|charts|recharts|d3|python|r|data/i.test(name)) return 'bar-chart-3';
  if (/react|next|vue|angular|svelte|html|css|tailwind|bootstrap|sass|scss|front/i.test(name)) return 'layout';
  if (/typescript|javascript|js|ts|java|c\+\+|c#|go|rust|ruby|php|kotlin|programming|code/i.test(name)) return 'code-2';
  return 'wrench';
}

export function SettingsForm() {
  const { reset, data } = usePortfolio();
  const [seoIndex, setSeoIndex] = React.useState(true);

  const generateHTML = () => {
    const t = data.theme;
    const isDark = ['#0F172A', '#1E1B4B', '#020617'].includes(t.background);
    const textColor = isDark ? '#F8FAFC' : '#0F172A';
    const subColor = isDark ? '#94A3B8' : '#64748B';
    
    const cardBg = t.cardStyle === 'glass' 
      ? (isDark ? 'rgba(30, 41, 59, 0.45)' : 'rgba(255, 255, 255, 0.45)') 
      : isDark ? '#1E293B' : '#FFFFFF';
    
    const border = t.cardStyle === 'bordered' || t.cardStyle === 'glass' 
      ? `1px solid ${isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)'}` 
      : 'none';
      
    const radius = `${t.borderRadius}px`;
    const backdropFilter = t.cardStyle === 'glass' ? 'backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);' : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.profile.fullName || 'Developer Portfolio'}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link href="https://fonts.googleapis.com/css2?family=${t.font.replace(/\s+/g, '+')}:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body {
      font-family: '${t.font}', sans-serif;
      background-color: ${t.background};
      color: ${textColor};
    }
    .custom-card {
      background: ${cardBg};
      border: ${border};
      border-radius: ${radius};
      ${backdropFilter}
    }
    .custom-badge {
      background-color: ${t.primaryColor}15;
      color: ${t.primaryColor};
      border: 1px solid ${t.primaryColor}30;
      border-radius: ${radius};
    }
    .custom-btn {
      border-radius: ${radius};
      ${t.buttonStyle === 'gradient' ? `background: linear-gradient(135deg, ${t.primaryColor}, ${t.accentColor}); color: white;` : ''}
      ${t.buttonStyle === 'solid' ? `background-color: ${t.primaryColor}; color: white;` : ''}
      ${t.buttonStyle === 'outline' ? `border: 2px solid ${t.primaryColor}; color: ${t.primaryColor}; background: transparent;` : ''}
    }
  </style>
</head>
<body class="min-h-screen pb-16">
  <header class="relative px-8 py-16 text-center max-w-4xl mx-auto overflow-hidden">
    <div class="absolute inset-x-0 top-0 h-48 opacity-30 blur-[60px] rounded-full" style="background: linear-gradient(135deg, ${t.primaryColor}, ${t.accentColor});"></div>
    <div class="relative flex flex-col items-center gap-4">
      ${data.profile.photo ? `<img src="${data.profile.photo}" alt="${data.profile.fullName}" class="h-24 w-24 rounded-full object-cover ring-4" style="border-color: ${t.primaryColor};">` : `<div class="flex h-24 w-24 items-center justify-center text-2xl font-bold rounded-full text-white" style="background-color: ${t.primaryColor};">${data.profile.fullName?.charAt(0) || '?'}</div>`}
      <div>
        <h1 class="text-3xl font-bold tracking-tight">${data.profile.fullName || 'Your Name'}</h1>
        <p class="mt-1 text-sm font-semibold" style="color: ${t.primaryColor};">${data.profile.jobTitle || 'Your Job Title'}</p>
        ${data.profile.location ? `<p class="mt-2 flex items-center justify-center gap-1 text-xs" style="color: ${subColor};">${data.profile.location}</p>` : ''}
      </div>
      <button class="custom-btn px-6 py-2.5 text-sm font-semibold shadow-md">Get in Touch</button>
    </div>
  </header>

  <main class="max-w-3xl mx-auto px-6 space-y-12">
    ${data.about ? `
    <section>
      <h2 class="mb-4 text-xl font-bold">About</h2>
      <p class="text-sm leading-relaxed" style="color: ${subColor};">${data.about}</p>
    </section>` : ''}

    ${data.skills.length > 0 ? `
    <section>
      <h2 class="mb-4 text-xl font-bold">Skills</h2>
      <div class="flex flex-wrap gap-2">
        ${data.skills.map(s => `<span class="custom-badge flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium" style="display: inline-flex;"><i data-lucide="${getSkillIconName(s)}" style="width: 14px; height: 14px;"></i>${s}</span>`).join('')}
      </div>
    </section>` : ''}

    ${data.projects.length > 0 ? `
    <section>
      <h2 class="mb-4 text-xl font-bold">Projects</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        ${data.projects.map(p => `
        <div class="custom-card overflow-hidden">
          <div class="h-32 w-full overflow-hidden" style="background-color: ${t.primaryColor}20;">
            ${p.image ? `<img src="${p.image}" alt="${p.title}" class="h-full w-full object-cover">` : ''}
          </div>
          <div class="p-4">
            <h3 class="text-sm font-bold">${p.title}</h3>
            <p class="mt-1 text-xs" style="color: ${subColor};">${p.description}</p>
            <div class="mt-3 flex flex-wrap gap-1">
              ${p.tech.map(tech => `<span class="px-1.5 py-0.5 text-[10px] rounded" style="background-color: ${t.accentColor}15; color: ${t.accentColor};">${tech}</span>`).join('')}
            </div>
          </div>
        </div>`).join('')}
      </div>
    </section>` : ''}

    ${data.experience.length > 0 ? `
    <section>
      <h2 class="mb-4 text-xl font-bold">Experience</h2>
      <div class="space-y-4">
        ${data.experience.map(e => `
        <div class="custom-card p-4">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-sm font-bold">${e.role}</h3>
              <p class="text-xs font-semibold" style="color: ${t.primaryColor};">${e.company}</p>
            </div>
            <span class="text-[10px]" style="color: ${subColor};">${e.start} — ${e.end}</span>
          </div>
          <p class="mt-2 text-xs" style="color: ${subColor};">${e.description}</p>
        </div>`).join('')}
      </div>
    </section>` : ''}

    ${data.education.length > 0 ? `
    <section>
      <h2 class="mb-4 text-xl font-bold">Education</h2>
      <div class="space-y-4">
        ${data.education.map(e => `
        <div class="custom-card p-4">
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-sm font-bold">${e.institution}</h3>
              <p class="text-xs font-semibold" style="color: ${t.primaryColor};">${e.degree} in ${e.field}</p>
            </div>
            <span class="text-[10px]" style="color: ${subColor};">${e.start} — ${e.end}</span>
          </div>
          <p class="mt-2 text-xs" style="color: ${subColor};">${e.description}</p>
        </div>`).join('')}
      </div>
    </section>` : ''}

    ${data.certificates.length > 0 ? `
    <section>
      <h2 class="mb-4 text-xl font-bold">Certificates</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        ${data.certificates.map(c => `
        <div class="custom-card overflow-hidden">
          ${c.image ? `
          <div style="height: 120px; width: 100%; overflow: hidden; background-color: rgba(0,0,0,0.03);">
            <img src="${c.image}" alt="${c.title}" style="height: 100%; width: 100%; object-fit: cover;" />
          </div>` : ''}
          <div class="p-3 text-center">
            <p class="text-xs font-bold">${c.title}</p>
            <p class="text-[10px]" style="color: ${subColor};">${c.issuer} · ${c.date}</p>
          </div>
        </div>`).join('')}
      </div>
    </section>` : ''}

    ${data.achievements.length > 0 ? `
    <section>
      <h2 class="mb-4 text-xl font-bold">Achievements</h2>
      <div class="space-y-3">
        ${data.achievements.map(a => `
        <div class="custom-card p-4">
          <div class="flex justify-between items-start">
            <h3 class="text-sm font-bold">${a.title}</h3>
            <span class="text-[10px]" style="color: ${subColor};">${a.date}</span>
          </div>
          <p class="mt-1 text-xs" style="color: ${subColor};">${a.description}</p>
        </div>`).join('')}
      </div>
    </section>` : ''}

    <section class="custom-card p-4">
      <h2 class="mb-3 text-sm font-bold">Contact Info</h2>
      <div class="grid grid-cols-2 gap-2 text-xs" style="color: ${subColor};">
        ${data.contact.showEmail && data.profile.email ? `<div>Email: ${data.profile.email}</div>` : ''}
        ${data.contact.showPhone && data.profile.phone ? `<div>Phone: ${data.profile.phone}</div>` : ''}
        ${data.contact.showSocial && data.profile.github ? `<div>GitHub: ${data.profile.github}</div>` : ''}
        ${data.contact.showSocial && data.profile.linkedin ? `<div>LinkedIn: ${data.profile.linkedin}</div>` : ''}
      </div>
    </section>
  </main>
  <script>
    lucide.createIcons();
  </script>
</body>
</html>`;
  };

  const exportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', `${(data.profile.fullName || 'portfolio').toLowerCase().replace(/\s+/g, '-')}-data.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('JSON exported successfully');
  };

  const exportHTML = () => {
    const htmlString = `data:text/html;charset=utf-8,${encodeURIComponent(generateHTML())}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', htmlString);
    downloadAnchor.setAttribute('download', `${(data.profile.fullName || 'portfolio').toLowerCase().replace(/\s+/g, '-')}-portfolio.html`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('HTML exported successfully');
  };

  const previewFullPage = () => {
    const newTab = window.open();
    if (newTab) {
      newTab.document.open();
      newTab.document.write(generateHTML());
      newTab.document.close();
      toast.success('Full preview opened in a new tab');
    } else {
      toast.error('Failed to open preview tab. Please allow popups.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Settings</h2>
        <p className="text-sm text-muted-foreground">Configure your portfolio's behavior.</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">SEO</CardTitle><CardDescription>Optimize discoverability</CardDescription></CardHeader>
        <CardContent className="space-y-1">
          <div className="flex items-center justify-between py-3">
            <div><p className="font-medium">Search engine indexing</p><p className="text-sm text-muted-foreground">Allow search engines to find your portfolio</p></div>
            <Switch checked={seoIndex} onCheckedChange={setSeoIndex} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Export</CardTitle><CardDescription>Download your portfolio data</CardDescription></CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <GradientButton variant="outline" onClick={exportJSON}><Download className="h-4 w-4" /> Export JSON</GradientButton>
          <GradientButton variant="outline" onClick={exportHTML}><Code className="h-4 w-4" /> Export HTML</GradientButton>
          <GradientButton variant="outline" onClick={previewFullPage}><Eye className="h-4 w-4" /> Preview Full Page</GradientButton>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader><CardTitle className="text-base text-destructive">Reset</CardTitle><CardDescription>Start over with default content</CardDescription></CardHeader>
        <CardContent>
          <GradientButton variant="outline" className="border-destructive/30 text-destructive hover:bg-destructive/10" onClick={() => { reset(); toast.success('Portfolio reset to defaults'); }}>
            <RotateCcw className="h-4 w-4" /> Reset to defaults
          </GradientButton>
        </CardContent>
      </Card>
    </div>
  );
}

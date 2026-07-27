'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Plus, FolderOpen, MoreVertical, Trash2, Eye, Edit, FileText } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent } from '@/components/ui/card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ExportResumeDialog } from '@/components/builder/generate-resume-dialog';
import { toast } from 'sonner';
import { getUserStorageItem, setUserStorageItem, removeUserStorageItem } from '@/lib/session-manager';

export default function PortfoliosPage() {
  const router = useRouter();
  const [resumePortfolio, setResumePortfolio] = React.useState<string | null>(null);
  const [portfolioList, setPortfolioList] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const { fetchDatabaseSync } = require('@/lib/db-sync');
      fetchDatabaseSync().then((dbData: any) => {
        const source = (dbData && dbData.savedPortfolios) || getUserStorageItem('user_portfolios');
        if (source) {
          try {
            const parsed = JSON.parse(source);
            const filtered = parsed.filter((p: any) => 
              p.name !== 'Personal Portfolio' && 
              p.name !== 'Job Hunt Portfolio' && 
              p.name !== 'Open Source Portfolio'
            );
            setPortfolioList(filtered);
            setUserStorageItem('user_portfolios', JSON.stringify(filtered));
          } catch {
            setPortfolioList([]);
          }
        } else {
          setPortfolioList([]);
        }
      });
    }
  }, []);

  const generateHTMLForData = (portfolioData: any) => {
    const getSkillIconName = (skill: string): string => {
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
    };

    const data = portfolioData || {
      profile: { fullName: 'Alex Morgan', jobTitle: 'Full-Stack Developer', location: 'San Francisco, CA', email: 'alex.morgan@example.com', phone: '', website: '', github: '', linkedin: '', twitter: '', portfolioUrl: '' },
      about: 'Passionate software engineer building web apps.',
      skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
      projects: [], education: [], experience: [], certificates: [], achievements: [],
      contact: { showEmail: true, showPhone: true, showSocial: true },
      theme: { id: 'minimal', primaryColor: '#6366F1', accentColor: '#EC4899', font: 'Inter', borderRadius: 8, background: '#FFFFFF', cardStyle: 'solid', buttonStyle: 'gradient', animations: true }
    };
    
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
    .radial-grid {
      background-image: radial-gradient(circle at 1px 1px, ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} 1px, transparent 0);
      background-size: 24px 24px;
    }
  </style>
</head>
<body class="relative min-h-screen pb-24 radial-grid overflow-x-hidden">
  <!-- Glowing Auroras -->
  <div class="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full filter blur-[120px] opacity-[0.12] pointer-events-none" style="background: ${t.primaryColor};"></div>
  <div class="absolute top-[30%] right-1/4 w-[500px] h-[500px] rounded-full filter blur-[140px] opacity-[0.1] pointer-events-none" style="background: ${t.accentColor};"></div>

  <header class="relative max-w-4xl mx-auto px-8 pt-20 pb-12 text-center">
    <div class="relative flex flex-col items-center gap-6">
      <div class="relative group">
        <div class="absolute -inset-1 rounded-full blur-lg opacity-75" style="background: linear-gradient(135deg, ${t.primaryColor}, ${t.accentColor});"></div>
        <div class="relative h-28 w-28 overflow-hidden rounded-full border-2 bg-slate-950 p-1 shadow-xl" style="border-color: ${t.primaryColor};">
          ${data.profile.photo ? `<img src="${data.profile.photo}" alt="${data.profile.fullName}" class="h-full w-full rounded-full object-cover">` : `<div class="flex h-full w-full items-center justify-center text-3xl font-bold rounded-full text-white" style="background-color: ${t.primaryColor};">${data.profile.fullName?.charAt(0) || '?'}</div>`}
        </div>
      </div>

      <div>
        <h1 class="text-4xl font-extrabold tracking-tight sm:text-5xl">
          <span style="background-image: linear-gradient(135deg, ${t.primaryColor}, ${t.accentColor}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
            ${data.profile.fullName || 'Your Name'}
          </span>
        </h1>
        <p class="mt-2 text-base font-semibold tracking-wide uppercase" style="color: ${t.primaryColor};">${data.profile.jobTitle || 'Your Job Title'}</p>
        ${data.profile.location ? `<p class="mt-2 flex items-center justify-center gap-1.5 text-xs font-medium" style="color: ${subColor};"><i data-lucide="map-pin" style="width: 14px; height: 14px;"></i>${data.profile.location}</p>` : ''}
      </div>

      <!-- Social and Info Links -->
      <div class="flex flex-wrap justify-center gap-3">
        ${data.profile.email ? `<button onclick="copyToClipboard('${data.profile.email}', 'email-btn')" id="email-btn" class="flex h-9 w-9 items-center justify-center rounded-full border hover:scale-105 active:scale-95 transition-all" style="background: ${cardBg}; border-color: ${border !== 'none' ? border.split(' ')[2] : 'rgba(128,128,128,0.2)'};"><i data-lucide="mail" style="width: 16px; height: 16px; color: ${t.primaryColor};"></i></button>` : ''}
        ${data.profile.phone ? `<button onclick="copyToClipboard('${data.profile.phone}', 'phone-btn')" id="phone-btn" class="flex h-9 w-9 items-center justify-center rounded-full border hover:scale-105 active:scale-95 transition-all" style="background: ${cardBg}; border-color: ${border !== 'none' ? border.split(' ')[2] : 'rgba(128,128,128,0.2)'};"><i data-lucide="phone" style="width: 16px; height: 16px; color: ${t.primaryColor};"></i></button>` : ''}
        ${data.profile.github ? `<a href="${data.profile.github.startsWith('http') ? data.profile.github : `https://${data.profile.github}`}" target="_blank" class="flex h-9 w-9 items-center justify-center rounded-full border hover:scale-105 active:scale-95 transition-all" style="background: ${cardBg}; border-color: ${border !== 'none' ? border.split(' ')[2] : 'rgba(128,128,128,0.2)'};"><i data-lucide="github" style="width: 16px; height: 16px; color: ${t.primaryColor};"></i></a>` : ''}
        ${data.profile.linkedin ? `<a href="${data.profile.linkedin.startsWith('http') ? data.profile.linkedin : `https://${data.profile.linkedin}`}" target="_blank" class="flex h-9 w-9 items-center justify-center rounded-full border hover:scale-105 active:scale-95 transition-all" style="background: ${cardBg}; border-color: ${border !== 'none' ? border.split(' ')[2] : 'rgba(128,128,128,0.2)'};"><i data-lucide="linkedin" style="width: 16px; height: 16px; color: ${t.primaryColor};"></i></a>` : ''}
      </div>

      <a href="${data.profile.email ? `mailto:${data.profile.email}` : '#'}" class="custom-btn px-6 py-2.5 text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all">Get in Touch</a>
    </div>
  </header>

  <main class="max-w-4xl mx-auto px-6 space-y-16">
    ${data.about ? `
    <section class="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
      <div class="md:col-span-2 space-y-4">
        <h2 class="text-xl font-bold tracking-tight border-b-2 pb-2 w-fit" style="border-color: ${t.primaryColor};">About Me</h2>
        <p class="text-sm leading-relaxed" style="color: ${subColor};">${data.about}</p>
      </div>
      
      <!-- Statistics Widget -->
      <div class="grid grid-cols-2 gap-3 md:col-span-1">
        <div class="custom-card p-3 text-center transition-transform hover:-translate-y-1">
          <p class="text-2xl font-bold" style="color: ${t.primaryColor};">${data.projects.length}</p>
          <p class="text-[10px] uppercase font-semibold" style="color: ${subColor};">Projects</p>
        </div>
        <div class="custom-card p-3 text-center transition-transform hover:-translate-y-1">
          <p class="text-2xl font-bold" style="color: ${t.accentColor};">${data.skills.length}</p>
          <p class="text-[10px] uppercase font-semibold" style="color: ${subColor};">Skills</p>
        </div>
        <div class="custom-card p-3 text-center col-span-2 transition-transform hover:-translate-y-1">
          <p class="text-lg font-bold" style="color: ${t.primaryColor};">${data.experience.length > 0 ? `${data.experience.length} Companies` : 'Fresher'}</p>
          <p class="text-[10px] uppercase font-semibold" style="color: ${subColor};">Professional Experience</p>
        </div>
      </div>
    </section>` : ''}

    ${data.skills && data.skills.length > 0 ? `
    <section class="space-y-4">
      <h2 class="text-xl font-bold tracking-tight border-b-2 pb-2 w-fit" style="border-color: ${t.primaryColor};">Skills & Expertise</h2>
      <div class="flex flex-wrap gap-2.5">
        ${data.skills.map((s: string) => `
        <div class="custom-card flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold shadow-sm hover:-translate-y-0.5 transition-all">
          <i data-lucide="${getSkillIconName(s)}" style="width: 16px; height: 16px; color: ${t.primaryColor};"></i>
          <span>${s}</span>
        </div>`).join('')}
      </div>
    </section>` : ''}

    ${data.projects && data.projects.length > 0 ? `
    <section class="space-y-6">
      <h2 class="text-xl font-bold tracking-tight border-b-2 pb-2 w-fit" style="border-color: ${t.primaryColor};">Featured Projects</h2>
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
        ${data.projects.map((p: any) => `
        <div class="custom-card overflow-hidden group hover:shadow-md transition-all duration-300">
          <div class="relative h-40 w-full overflow-hidden bg-muted/20">
            ${p.image ? `<img src="${p.image}" alt="${p.title}" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105">` : `<div class="flex h-full w-full items-center justify-center" style="background: linear-gradient(135deg, ${t.primaryColor}20, ${t.accentColor}20);"><i data-lucide="layout" style="width: 32px; height: 32px; color: ${t.primaryColor}; opacity: 0.4;"></i></div>`}
            <!-- Links overlay -->
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
              ${p.github ? `<a href="${p.github.startsWith('http') ? p.github : `https://${p.github}`}" target="_blank" class="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"><i data-lucide="github" style="width: 18px; height: 18px;"></i></a>` : ''}
              ${p.live ? `<a href="${p.live.startsWith('http') ? p.live : `https://${p.live}`}" target="_blank" class="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"><i data-lucide="external-link" style="width: 18px; height: 18px;"></i></a>` : ''}
            </div>
          </div>
          <div class="p-4 space-y-2">
            <h3 class="text-base font-bold tracking-tight">${p.title}</h3>
            <p class="text-xs leading-relaxed" style="color: ${subColor};">${p.description}</p>
            <div class="pt-2 flex flex-wrap gap-1">
              ${p.tech.map((tech: string) => `<span class="px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase rounded" style="background: ${t.accentColor}12; color: ${t.accentColor};">${tech}</span>`).join('')}
            </div>
          </div>
        </div>`).join('')}
      </div>
    </section>` : ''}

    ${data.experience && data.experience.length > 0 ? `
    <section class="space-y-6">
      <h2 class="text-xl font-bold tracking-tight border-b-2 pb-2 w-fit" style="border-color: ${t.primaryColor};">Professional Experience</h2>
      <div class="relative pl-6 border-l-2 border-dashed space-y-8" style="border-color: ${t.primaryColor}30;">
        ${data.experience.map((e: any) => `
        <div class="relative group">
          <div class="absolute -left-[33px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 border-2" style="border-color: ${t.primaryColor};">
            <i data-lucide="briefcase" style="width: 10px; height: 10px; color: ${t.primaryColor};"></i>
          </div>
          <div class="custom-card p-4 space-y-2">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <h3 class="text-base font-bold">${e.role}</h3>
                <p class="text-xs font-semibold" style="color: ${t.primaryColor};">${e.company}</p>
              </div>
              <span class="text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded border mt-1 sm:mt-0 w-fit" style="background: ${t.primaryColor}08; border-color: ${t.primaryColor}20; color: ${subColor};">
                ${e.start} — {e.end}
              </span>
            </div>
            <p class="text-xs leading-relaxed" style="color: ${subColor};">${e.description}</p>
          </div>
        </div>`).join('')}
      </div>
    </section>` : ''}

    ${data.education && data.education.length > 0 ? `
    <section class="space-y-6">
      <h2 class="text-xl font-bold tracking-tight border-b-2 pb-2 w-fit" style="border-color: ${t.primaryColor};">Education</h2>
      <div class="relative pl-6 border-l-2 border-dashed space-y-8" style="border-color: ${t.accentColor}30;">
        ${data.education.map((edu: any) => `
        <div class="relative group">
          <div class="absolute -left-[33px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 border-2" style="border-color: ${t.accentColor};">
            <i data-lucide="graduation-cap" style="width: 10px; height: 10px; color: ${t.accentColor};"></i>
          </div>
          <div class="custom-card p-4 space-y-2">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between">
              <div>
                <h3 class="text-base font-bold">${edu.institution}</h3>
                <p class="text-xs font-semibold" style="color: ${t.accentColor};">${edu.degree} in ${edu.field}</p>
              </div>
              <span class="text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded border mt-1 sm:mt-0 w-fit" style="background: ${t.accentColor}08; border-color: ${t.accentColor}20; color: ${subColor};">
                ${edu.start} — ${edu.end}
              </span>
            </div>
            <p class="text-xs leading-relaxed" style="color: ${subColor};">${edu.description}</p>
          </div>
        </div>`).join('')}
      </div>
    </section>` : ''}

    ${data.certificates && data.certificates.length > 0 ? `
    <section class="space-y-6">
      <h2 class="text-xl font-bold tracking-tight border-b-2 pb-2 w-fit" style="border-color: ${t.primaryColor};">Certifications</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        ${data.certificates.map((c: any) => `
        <div class="custom-card overflow-hidden flex flex-col justify-between group">
          <div class="relative h-32 w-full overflow-hidden bg-muted/20">
            ${c.image ? `<img src="${c.image}" alt="${c.title}" class="h-full w-full object-cover">
            <!-- View button hover overlay -->
            <div onclick="showCertModal('${c.image}', '${c.title}', '${c.issuer}', '${c.date}')" class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer">
              <span class="flex items-center gap-1.5 text-xs text-white font-semibold bg-black/50 px-3 py-1.5 rounded-full shadow">
                <i data-lucide="eye" style="width: 14px; height: 14px;"></i> View Certificate
              </span>
            </div>` : `<div class="flex h-full w-full items-center justify-center" style="background: linear-gradient(135deg, ${t.primaryColor}10, ${t.accentColor}10);"><i data-lucide="award" style="width: 32px; height: 32px; color: ${t.accentColor}; opacity: 0.3;"></i></div>`}
          </div>
          <div class="p-3 text-center">
            <p class="text-xs font-bold">${c.title}</p>
            <p class="text-[10px] mt-0.5" style="color: ${subColor};">${c.issuer} · ${c.date}</p>
          </div>
        </div>`).join('')}
      </div>
    </section>` : ''}

    ${data.achievements && data.achievements.length > 0 ? `
    <section class="space-y-6">
      <h2 class="text-xl font-bold tracking-tight border-b-2 pb-2 w-fit" style="border-color: ${t.primaryColor};">Honors & Achievements</h2>
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        ${data.achievements.map((a: any) => `
        <div class="custom-card p-4 flex gap-3.5 items-start">
          <div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <i data-lucide="trophy" style="width: 20px; height: 20px;"></i>
          </div>
          <div class="space-y-1 w-full">
            <div class="flex justify-between items-start">
              <h3 class="text-sm font-bold tracking-tight">${a.title}</h3>
              <span class="text-[9px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">${a.date}</span>
            </div>
            <p class="text-xs leading-relaxed" style="color: ${subColor};">${a.description}</p>
          </div>
        </div>`).join('')}
      </div>
    </section>` : ''}

    <section class="space-y-4">
      <h2 class="text-xl font-bold tracking-tight border-b-2 pb-2 w-fit" style="border-color: ${t.primaryColor};">Get in Touch</h2>
      <div class="custom-card p-6 shadow-md grid grid-cols-1 md:grid-cols-2 gap-4">
        ${data.contact?.showEmail && data.profile?.email ? `
        <div onclick="copyToClipboard('${data.profile.email}', 'email-val')" class="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-800/40 transition-colors cursor-pointer group">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <i data-lucide="mail" style="width: 18px; height: 18px;"></i>
          </div>
          <div>
            <p class="text-[10px] uppercase font-bold tracking-wider" style="color: ${subColor};">Email Address</p>
            <p id="email-val" class="text-xs font-semibold">${data.profile.email}</p>
          </div>
        </div>` : ''}
        
        ${data.contact?.showPhone && data.profile?.phone ? `
        <div onclick="copyToClipboard('${data.profile.phone}', 'phone-val')" class="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-800/40 transition-colors cursor-pointer group">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <i data-lucide="phone" style="width: 18px; height: 18px;"></i>
          </div>
          <div>
            <p class="text-[10px] uppercase font-bold tracking-wider" style="color: ${subColor};">Phone Number</p>
            <p id="phone-val" class="text-xs font-semibold">${data.profile.phone}</p>
          </div>
        </div>` : ''}

        ${data.contact?.showSocial && data.profile?.github ? `
        <a href="${data.profile.github.startsWith('http') ? data.profile.github : `https://${data.profile.github}`}" target="_blank" class="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-800/40 transition-colors">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <i data-lucide="github" style="width: 18px; height: 18px;"></i>
          </div>
          <div>
            <p class="text-[10px] uppercase font-bold tracking-wider" style="color: ${subColor};">GitHub Profile</p>
            <p class="text-xs font-semibold">${data.profile.github}</p>
          </div>
        </a>` : ''}

        ${data.contact?.showSocial && data.profile?.linkedin ? `
        <a href="${data.profile.linkedin.startsWith('http') ? data.profile.linkedin : `https://${data.profile.linkedin}`}" target="_blank" class="flex items-center gap-3.5 p-3 rounded-xl hover:bg-slate-800/40 transition-colors">
          <div class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <i data-lucide="linkedin" style="width: 18px; height: 18px;"></i>
          </div>
          <div>
            <p class="text-[10px] uppercase font-bold tracking-wider" style="color: ${subColor};">LinkedIn Profile</p>
            <p class="text-xs font-semibold">${data.profile.linkedin}</p>
          </div>
        </a>` : ''}
      </div>
    </section>
  </main>
  
  <script>
    lucide.createIcons();
    
    function copyToClipboard(text, elementId) {
      navigator.clipboard.writeText(text);
      const el = document.getElementById(elementId);
      const original = el.innerText;
      el.innerText = 'Copied to clipboard!';
      el.style.color = '#10B981';
      setTimeout(() => {
        el.innerText = original;
        el.style.color = '';
      }, 2000);
    }
    
    function showCertModal(url, title, issuer, date) {
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm';
      modal.onclick = () => modal.remove();
      modal.innerHTML = \`
        <div class="relative max-w-3xl w-full rounded-2xl overflow-hidden border bg-slate-900 shadow-2xl p-2" style="border-color: ${t.primaryColor};" onclick="event.stopPropagation()">
          <button onclick="this.parentElement.parentElement.remove()" class="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full shadow">
            <i data-lucide="x" style="width: 20px; height: 20px;"></i>
          </button>
          <img src="\${url}" alt="\${title}" class="w-full max-h-[75vh] object-contain rounded-xl" />
          <div class="p-4 text-center text-white">
            <h3 class="text-lg font-bold">\${title}</h3>
            <p class="text-sm text-slate-400">\${issuer} · \${date}</p>
          </div>
        </div>
      \`;
      document.body.appendChild(modal);
      lucide.createIcons();
    }
  </script>
</body>
</html>`;
  };

  const handleView = (portfolio: any) => {
    const newTab = window.open();
    if (newTab) {
      newTab.document.open();
      newTab.document.write(generateHTMLForData(portfolio.data));
      newTab.document.close();
      toast.success(`Viewing "${portfolio.name}"`);
    } else {
      toast.error('Failed to open preview tab. Please allow popups.');
    }
  };

  const handleEdit = (portfolio: any) => {
    if (portfolio.data) {
      setUserStorageItem('editing_portfolio_data', JSON.stringify(portfolio.data));
    } else {
      removeUserStorageItem('editing_portfolio_data');
    }
    router.push('/builder');
  };

  const handleDelete = (nameToDelete: string) => {
    const updated = portfolioList.filter(p => p.name !== nameToDelete);
    setPortfolioList(updated);
    const updatedStr = JSON.stringify(updated);
    setUserStorageItem('user_portfolios', updatedStr);
    
    const { syncToDatabase } = require('@/lib/db-sync');
    syncToDatabase(updatedStr, undefined);
    
    const { addActivity } = require('@/lib/activity-helper');
    addActivity(`Deleted portfolio "${nameToDelete}"`);
    
    toast.success('Portfolio deleted successfully');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">My Portfolios</h1>
            <p className="mt-1 text-muted-foreground">Manage all your portfolios in one place.</p>
          </div>
          <Link href="/builder" onClick={() => { if (typeof window !== 'undefined') { removeUserStorageItem('editing_portfolio_data'); removeUserStorageItem('active_builder_portfolio'); sessionStorage.setItem('is_new_portfolio', 'true'); } }}><GradientButton className="gap-2"><Plus className="h-4 w-4" /> New Portfolio</GradientButton></Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* New Portfolio Card */}
          <Link href="/builder" onClick={() => { if (typeof window !== 'undefined') { removeUserStorageItem('editing_portfolio_data'); removeUserStorageItem('active_builder_portfolio'); sessionStorage.setItem('is_new_portfolio', 'true'); } }}>
            <motion.div whileHover={{ y: -4 }} className="h-full">
              <Card className="flex h-full min-h-[200px] flex-col items-center justify-center border-dashed border-2 p-6 text-center transition-colors hover:border-primary hover:bg-primary/5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Plus className="h-6 w-6" />
                </div>
                <p className="mt-3 font-semibold">Create New Portfolio</p>
                <p className="text-sm text-muted-foreground">Start from scratch</p>
              </Card>
            </motion.div>
          </Link>

          {portfolioList.map((p, i) => (
            <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="h-full">
              <Card className="group flex h-full min-h-[200px] flex-col overflow-hidden p-0">
                <div className="relative h-24 shrink-0 bg-gradient-brand">
                  <div className="absolute inset-0 bg-grid-pattern opacity-20" />
                  <div className="absolute right-2 top-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 text-white backdrop-blur transition-colors hover:bg-white/30">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleView(p)}><Eye className="mr-2 h-4 w-4" /> View</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleEdit(p)}><Edit className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setResumePortfolio(p.name)}>
                          <FileText className="mr-2 h-4 w-4" /> Export Resume
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(p.name)} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <div className="absolute -bottom-6 left-4 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-card bg-card shadow-md">
                    <FolderOpen className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <CardContent className="flex flex-1 flex-col gap-3 p-5 pt-8">
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-semibold">{p.name}</p>
                    <Badge variant={p.status === 'Published' ? 'default' : 'secondary'}>{p.status}</Badge>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{p.url}</p>
                  <div className="mt-auto flex items-center justify-end text-xs text-muted-foreground">
                    <span>{p.theme}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <ExportResumeDialog
        open={resumePortfolio !== null}
        onOpenChange={(open) => { if (!open) setResumePortfolio(null); }}
        portfolioName={resumePortfolio || undefined}
        portfolioData={portfolioList.find(p => p.name === resumePortfolio)?.data}
      />
    </DashboardLayout>
  );
}

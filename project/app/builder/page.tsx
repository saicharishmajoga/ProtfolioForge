'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, FileText, GraduationCap, Briefcase, FolderGit2,
  Wrench, Award, Trophy, Mail, Palette, Settings as SettingsIcon,
  ChevronLeft, ChevronRight, Eye, Save, Rocket, X, UploadCloud,
} from 'lucide-react';
import { PortfolioProvider, usePortfolio } from '@/lib/portfolio-context';
import { PortfolioPreview } from '@/components/portfolio-preview';
import { ProfileForm } from '@/components/builder/profile-form';
import { AboutForm } from '@/components/builder/about-form';
import { SkillsForm } from '@/components/builder/skills-form';
import { ProjectsForm } from '@/components/builder/projects-form';
import { EducationForm } from '@/components/builder/education-form';
import { ExperienceForm } from '@/components/builder/experience-form';
import { CertificatesForm } from '@/components/builder/certificates-form';
import { AchievementsForm } from '@/components/builder/achievements-form';
import { ContactForm } from '@/components/builder/contact-form';
import { ThemeForm } from '@/components/builder/theme-form';
import { SettingsForm } from '@/components/builder/settings-form';
import { ResumeForm } from '@/components/builder/resume-form';
import { GradientButton } from '@/components/ui/gradient-button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';
import { getUserStorageItem, setUserStorageItem } from '@/lib/session-manager';

const sections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'about', label: 'About', icon: FileText },
  { id: 'skills', label: 'Skills', icon: Wrench },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'theme', label: 'Theme', icon: Palette },
  { id: 'settings', label: 'Settings', icon: SettingsIcon },
] as const;

type SectionId = typeof sections[number]['id'];

function BuilderContent() {
  const [active, setActive] = React.useState<SectionId>('profile');
  const [mobilePreview, setMobilePreview] = React.useState(false);
  const { completion, data } = usePortfolio();

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      const existing = getUserStorageItem('user_portfolios');
      let list = [];
      if (existing) {
        try {
          list = JSON.parse(existing);
        } catch {
          list = [];
        }
      }

      
      const portfolioName = data.profile.fullName ? `${data.profile.fullName}'s Portfolio` : 'Untitled Portfolio';
      const portfolioUrl = `portfolioforge.app/${(data.profile.fullName || 'user').toLowerCase().replace(/\s+/g, '-')}`;
      
      const existingIndex = list.findIndex((item: any) => item.name === portfolioName || item.url === portfolioUrl);
      
      const newPortfolioItem = {
        name: portfolioName,
        url: portfolioUrl,
        views: existingIndex >= 0 ? list[existingIndex].views : 0,
        updated: 'Just now',
        status: 'Published',
        theme: data.theme.id.charAt(0).toUpperCase() + data.theme.id.slice(1),
        data: data
      };
      
      if (existingIndex >= 0) {
        list[existingIndex] = newPortfolioItem;
      } else {
        list.push(newPortfolioItem);
      }
      
      const listStr = JSON.stringify(list);
      setUserStorageItem('user_portfolios', listStr);
      
      const { syncToDatabase } = require('@/lib/db-sync');
      syncToDatabase(listStr, undefined);
      
      const { addActivity } = require('@/lib/activity-helper');
      addActivity(`Saved portfolio "${portfolioName}"`);
      
      toast.success(`Portfolio "${portfolioName}" saved successfully!`);
    }
  };

  const renderForm = () => {
    switch (active) {
      case 'profile': return <ProfileForm />;
      case 'about': return <AboutForm />;
      case 'skills': return <SkillsForm />;
      case 'projects': return <ProjectsForm />;
      case 'experience': return <ExperienceForm />;
      case 'education': return <EducationForm />;
      case 'certificates': return <CertificatesForm />;
      case 'achievements': return <AchievementsForm />;
      case 'contact': return <ContactForm />;
      case 'theme': return <ThemeForm />;
      case 'settings': return <SettingsForm />;
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      {/* Top bar */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-card px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" /> Dashboard
          </Link>
          <span className="text-border">|</span>
          <span className="font-semibold">Portfolio Builder</span>
          <Badge variant="secondary" className="hidden sm:inline">Auto-saved</Badge>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <span className="text-xs text-muted-foreground">{completion}% complete</span>
            <Progress value={completion} className="h-2 w-24" />
          </div>
          <GradientButton variant="outline" size="sm" className="lg:hidden" onClick={() => setMobilePreview(true)}>
            <Eye className="h-4 w-4" /> Preview
          </GradientButton>
          <GradientButton variant="outline" size="sm" className="hidden sm:flex" onClick={handleSave}>
            <Save className="h-4 w-4" /> Save
          </GradientButton>
          <Link href="/publish">
            <GradientButton size="sm" className="gap-1.5"><Rocket className="h-4 w-4" /> Publish</GradientButton>
          </Link>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar - sections */}
        <aside className="hidden w-56 shrink-0 flex-col border-r bg-card md:flex">
          <div className="flex-1 overflow-y-auto p-3">
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sections</p>
            <nav className="space-y-1">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    active === s.id ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <s.icon className="h-4 w-4" />
                  {s.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile section selector */}
        <div className="flex shrink-0 overflow-x-auto border-b bg-card md:hidden">
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActive(s.id)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 border-b-2 px-3 py-3 text-xs font-medium transition-colors',
                active === s.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground'
              )}
            >
              <s.icon className="h-3.5 w-3.5" />
              {s.label}
            </button>
          ))}
        </div>

        {/* Center - form */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                {renderForm()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Right - live preview */}
        <aside className="hidden w-[420px] shrink-0 flex-col border-l bg-muted/30 xl:flex">
          <div className="flex items-center justify-between border-b bg-card px-4 py-3">
            <span className="text-sm font-semibold">Live Preview</span>
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" /> Live
            </span>
          </div>
          <div className="flex-1 overflow-hidden p-3">
            <div className="h-full overflow-hidden rounded-xl border bg-card shadow-lg">
              <div className="flex items-center gap-1.5 border-b bg-muted/50 px-3 py-2">
                <div className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-warning/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-success/60" />
                <div className="ml-2 flex-1 rounded border bg-background px-2 py-0.5 text-[10px] text-muted-foreground">portfolioforge.app/alex-morgan</div>
              </div>
              <PortfolioPreview className="h-[calc(100%-32px)]" />
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile preview drawer */}
      <AnimatePresence>
        {mobilePreview && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setMobilePreview(false)} />
            <motion.div
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-x-0 bottom-0 z-50 h-[85vh] overflow-hidden rounded-t-2xl border bg-card lg:hidden"
            >
              <div className="flex items-center justify-between border-b px-4 py-3">
                <span className="font-semibold">Live Preview</span>
                <button onClick={() => setMobilePreview(false)}><X className="h-5 w-5" /></button>
              </div>
              <div className="h-[calc(100%-52px)] overflow-hidden p-3">
                <div className="h-full overflow-hidden rounded-xl border">
                  <PortfolioPreview className="h-full" />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BuilderPage() {
  return (
    <PortfolioProvider>
      <BuilderContent />
    </PortfolioProvider>
  );
}

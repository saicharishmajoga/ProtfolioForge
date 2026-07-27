'use client';

import * as React from 'react';
import { getUserStorageItem, setUserStorageItem, removeUserStorageItem } from './session-manager';
import {
  DEFAULT_PORTFOLIO_DATA,
  THEME_PRESETS,
  type PortfolioData,
  type Project,
  type Education,
  type Experience,
  type Certificate,
  type Achievement,
  type ThemeId,
} from '@/lib/portfolio-data';

type Updater = (draft: PortfolioData) => void;

interface PortfolioContextValue {
  data: PortfolioData;
  update: (updater: Updater) => void;
  updateProfile: (patch: Partial<PortfolioData['profile']>) => void;
  setAbout: (about: string) => void;
  setSkills: (skills: string[]) => void;
  addProject: (project: Project) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  removeProject: (id: string) => void;
  reorderProjects: (from: number, to: number) => void;
  addEducation: (edu: Education) => void;
  updateEducation: (id: string, patch: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, patch: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addCertificate: (cert: Certificate) => void;
  updateCertificate: (id: string, patch: Partial<Certificate>) => void;
  removeCertificate: (id: string) => void;
  addAchievement: (ach: Achievement) => void;
  updateAchievement: (id: string, patch: Partial<Achievement>) => void;
  removeAchievement: (id: string) => void;
  updateContact: (patch: Partial<PortfolioData['contact']>) => void;
  updateTheme: (patch: Partial<PortfolioData['theme']>) => void;
  applyThemePreset: (id: ThemeId) => void;
  reset: () => void;
  completion: number;
}

const PortfolioContext = React.createContext<PortfolioContextValue | null>(null);

export function PortfolioProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = React.useState<PortfolioData>(DEFAULT_PORTFOLIO_DATA);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const isNew = sessionStorage.getItem('is_new_portfolio') === 'true';
      if (isNew) {
        sessionStorage.removeItem('is_new_portfolio');
        setData(DEFAULT_PORTFOLIO_DATA);
        setUserStorageItem('active_builder_portfolio', JSON.stringify(DEFAULT_PORTFOLIO_DATA));
        const { syncToDatabase } = require('@/lib/db-sync');
        syncToDatabase(undefined, JSON.stringify(DEFAULT_PORTFOLIO_DATA));
        setIsLoaded(true);
        return;
      }

      const editing = getUserStorageItem('editing_portfolio_data');
      if (editing) {
        try {
          const parsed = JSON.parse(editing);
          setData(parsed);
          setUserStorageItem('active_builder_portfolio', editing);
          const { syncToDatabase } = require('@/lib/db-sync');
          syncToDatabase(undefined, editing);
        } catch {}
        removeUserStorageItem('editing_portfolio_data');
        setIsLoaded(true);
        return;
      }

      const { fetchDatabaseSync } = require('@/lib/db-sync');
      fetchDatabaseSync().then((dbData: any) => {
        if (dbData && dbData.activeDraft) {
          try {
            setData(JSON.parse(dbData.activeDraft));
          } catch {}
        } else {
          const active = getUserStorageItem('active_builder_portfolio');
          if (active) {
            try {
              setData(JSON.parse(active));
            } catch {}
          }
        }
        setIsLoaded(true);
      }).catch(() => {
        setIsLoaded(true);
      });
    }
  }, []);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && data && isLoaded) {
      const activeStr = JSON.stringify(data);
      setUserStorageItem('active_builder_portfolio', activeStr);
      const { syncToDatabase } = require('@/lib/db-sync');
      syncToDatabase(undefined, activeStr);
    }
  }, [data, isLoaded]);

  const update = React.useCallback((updater: Updater) => {
    setData((prev) => {
      const draft = structuredClone(prev);
      updater(draft);
      return draft;
    });
  }, []);

  const updateProfile = React.useCallback(
    (patch: Partial<PortfolioData['profile']>) => {
      update((d) => {
        d.profile = { ...d.profile, ...patch };
      });
    },
    [update]
  );

  const setAbout = React.useCallback((about: string) => update((d) => { d.about = about; }), [update]);
  const setSkills = React.useCallback((skills: string[]) => update((d) => { d.skills = skills; }), [update]);

  const addProject = React.useCallback((project: Project) => update((d) => { d.projects.push(project); }), [update]);
  const updateProject = React.useCallback((id: string, patch: Partial<Project>) => update((d) => { const p = d.projects.find((x) => x.id === id); if (p) Object.assign(p, patch); }), [update]);
  const removeProject = React.useCallback((id: string) => update((d) => { d.projects = d.projects.filter((x) => x.id !== id); }), [update]);
  const reorderProjects = React.useCallback((from: number, to: number) => update((d) => { const [item] = d.projects.splice(from, 1); d.projects.splice(to, 0, item); }), [update]);

  const addEducation = React.useCallback((edu: Education) => update((d) => { d.education.push(edu); }), [update]);
  const updateEducation = React.useCallback((id: string, patch: Partial<Education>) => update((d) => { const e = d.education.find((x) => x.id === id); if (e) Object.assign(e, patch); }), [update]);
  const removeEducation = React.useCallback((id: string) => update((d) => { d.education = d.education.filter((x) => x.id !== id); }), [update]);

  const addExperience = React.useCallback((exp: Experience) => update((d) => { d.experience.push(exp); }), [update]);
  const updateExperience = React.useCallback((id: string, patch: Partial<Experience>) => update((d) => { const e = d.experience.find((x) => x.id === id); if (e) Object.assign(e, patch); }), [update]);
  const removeExperience = React.useCallback((id: string) => update((d) => { d.experience = d.experience.filter((x) => x.id !== id); }), [update]);

  const addCertificate = React.useCallback((cert: Certificate) => update((d) => { d.certificates.push(cert); }), [update]);
  const updateCertificate = React.useCallback((id: string, patch: Partial<Certificate>) => update((d) => { const c = d.certificates.find((x) => x.id === id); if (c) Object.assign(c, patch); }), [update]);
  const removeCertificate = React.useCallback((id: string) => update((d) => { d.certificates = d.certificates.filter((x) => x.id !== id); }), [update]);

  const addAchievement = React.useCallback((ach: Achievement) => update((d) => { d.achievements.push(ach); }), [update]);
  const updateAchievement = React.useCallback((id: string, patch: Partial<Achievement>) => update((d) => { const a = d.achievements.find((x) => x.id === id); if (a) Object.assign(a, patch); }), [update]);
  const removeAchievement = React.useCallback((id: string) => update((d) => { d.achievements = d.achievements.filter((x) => x.id !== id); }), [update]);

  const updateContact = React.useCallback((patch: Partial<PortfolioData['contact']>) => update((d) => { d.contact = { ...d.contact, ...patch }; }), [update]);
  const updateTheme = React.useCallback((patch: Partial<PortfolioData['theme']>) => update((d) => { d.theme = { ...d.theme, ...patch }; }), [update]);

  const applyThemePreset = React.useCallback((id: ThemeId) => {
    update((d) => {
      const preset = (THEME_PRESETS as any)[id];
      if (preset) {
        d.theme.id = id;
        d.theme.primaryColor = preset.primaryColor;
        d.theme.accentColor = preset.accentColor;
        d.theme.background = preset.background;
        d.theme.cardStyle = preset.cardStyle;
      }
    });
  }, [update]);

  const reset = React.useCallback(() => setData(DEFAULT_PORTFOLIO_DATA), []);

  const completion = React.useMemo(() => {
    const checks = [
      !!data.profile.fullName,
      !!data.profile.jobTitle,
      !!data.profile.email,
      !!data.profile.photo,
      !!data.about,
      data.skills.length > 0,
      data.projects.length > 0,
      data.experience.length > 0,
      data.education.length > 0,
      !!data.profile.github || !!data.profile.linkedin,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [data]);

  const value: PortfolioContextValue = {
    data, update, updateProfile, setAbout, setSkills,
    addProject, updateProject, removeProject, reorderProjects,
    addEducation, updateEducation, removeEducation,
    addExperience, updateExperience, removeExperience,
    addCertificate, updateCertificate, removeCertificate,
    addAchievement, updateAchievement, removeAchievement,
    updateContact, updateTheme, applyThemePreset, reset, completion,
  };

  return <PortfolioContext.Provider value={value}>{children}</PortfolioContext.Provider>;
}

export function usePortfolio() {
  const ctx = React.useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within a PortfolioProvider');
  return ctx;
}

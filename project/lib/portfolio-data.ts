export type ThemeId =
  | 'minimal'
  | 'dark-dev'
  | 'glass'
  | 'creative'
  | 'corporate'
  | 'cyberpunk';

export interface Project {
  id: string;
  title: string;
  description: string;
  tech: string[];
  github: string;
  live: string;
  image: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  start: string;
  end: string;
  description: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  start: string;
  end: string;
  description: string;
  logo: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
}

export interface PortfolioData {
  profile: {
    photo: string;
    fullName: string;
    jobTitle: string;
    location: string;
    email: string;
    phone: string;
    website: string;
    github: string;
    linkedin: string;
    twitter: string;
    portfolioUrl: string;
  };
  about: string;
  skills: string[];
  projects: Project[];
  education: Education[];
  experience: Experience[];
  certificates: Certificate[];
  achievements: Achievement[];
  contact: {
    showEmail: boolean;
    showPhone: boolean;
    showSocial: boolean;
  };
  theme: {
    id: ThemeId;
    primaryColor: string;
    accentColor: string;
    font: string;
    borderRadius: number;
    background: string;
    cardStyle: 'solid' | 'glass' | 'bordered';
    buttonStyle: 'solid' | 'gradient' | 'outline';
    animations: boolean;
  };
}

export const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  profile: {
    photo: '',
    fullName: '',
    jobTitle: '',
    location: '',
    email: '',
    phone: '',
    website: '',
    github: '',
    linkedin: '',
    twitter: '',
    portfolioUrl: '',
  },
  about: '',
  skills: [],
  projects: [],
  education: [],
  experience: [],
  certificates: [],
  achievements: [],
  contact: {
    showEmail: true,
    showPhone: true,
    showSocial: true,
  },
  theme: {
    id: 'minimal',
    primaryColor: '#4F46E5',
    accentColor: '#8B5CF6',
    font: 'Inter',
    borderRadius: 12,
    background: '#F8FAFC',
    cardStyle: 'solid',
    buttonStyle: 'gradient',
    animations: true,
  },
};

export const SKILL_OPTIONS = [
  'React', 'Next.js', 'Node.js', 'TypeScript', 'JavaScript', 'Python',
  'Java', 'C++', 'Go', 'Rust', 'Tailwind CSS', 'CSS', 'HTML', 'Vue',
  'Angular', 'Svelte', 'GraphQL', 'REST API', 'Docker', 'Kubernetes',
  'AWS', 'GCP', 'Azure', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
  'Firebase', 'Supabase', 'Git', 'CI/CD', 'Linux', 'Figma', 'Framer Motion',
];

export const THEME_PRESETS: Record<ThemeId, { name: string; description: string; primaryColor: string; accentColor: string; background: string; cardStyle: 'solid' | 'glass' | 'bordered'; }> = {
  minimal: { name: 'Minimal White', description: 'Clean, airy, professional', primaryColor: '#4F46E5', accentColor: '#8B5CF6', background: '#F8FAFC', cardStyle: 'solid' },
  'dark-dev': { name: 'Dark Developer', description: 'Sleek dark mode for devs', primaryColor: '#6366F1', accentColor: '#22D3EE', background: '#0F172A', cardStyle: 'bordered' },
  glass: { name: 'Glassmorphism', description: 'Frosted glass with depth', primaryColor: '#8B5CF6', accentColor: '#EC4899', background: '#1E1B4B', cardStyle: 'glass' },
  creative: { name: 'Creative Gradient', description: 'Bold and colorful', primaryColor: '#F59E0B', accentColor: '#EF4444', background: '#FEF3C7', cardStyle: 'solid' },
  corporate: { name: 'Corporate', description: 'Trustworthy and refined', primaryColor: '#0F766E', accentColor: '#0EA5E9', background: '#F1F5F9', cardStyle: 'solid' },
  cyberpunk: { name: 'Cyberpunk', description: 'Neon on black', primaryColor: '#22D3EE', accentColor: '#F472B6', background: '#020617', cardStyle: 'glass' },
};

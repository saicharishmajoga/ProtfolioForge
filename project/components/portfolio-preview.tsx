'use client';

import * as React from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { 
  MapPin, Mail, Phone, Github, Linkedin, ExternalLink, Award, Briefcase, 
  GraduationCap, Trophy, Layout, Code2, Database, Cloud, Server, 
  PenTool, Smartphone, Shield, BarChart3, Wrench, GitBranch, Copy, Check, Eye, X
} from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';

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

export function PortfolioPreview({ className }: { className?: string }) {
  const { data } = usePortfolio();
  const t = data.theme;

  const [selectedCert, setSelectedCert] = React.useState<any>(null);
  const [copiedType, setCopiedType] = React.useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedType(type);
      setTimeout(() => setCopiedType(null), 2000);
    }
  };

  // Dynamically load Google Font
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const fontId = 'dynamic-google-font';
      let link = document.getElementById(fontId) as HTMLLinkElement;
      if (!link) {
        link = document.createElement('link');
        link.id = fontId;
        link.rel = 'stylesheet';
        document.head.appendChild(link);
      }
      const formattedFont = t.font.replace(/\s+/g, '+');
      link.href = `https://fonts.googleapis.com/css2?family=${formattedFont}:wght@300;400;500;600;700;800&display=swap`;
    }
  }, [t.font]);

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
  const backdropFilter = t.cardStyle === 'glass' ? 'blur(12px)' : 'none';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };

  const motionProps = t.animations
    ? { initial: 'hidden' as const, whileInView: 'visible' as const, viewport: { once: true, margin: '-100px' } }
    : { initial: false, whileInView: undefined };

  return (
    <div
      className={cn('relative h-full w-full overflow-y-auto scrollbar-thin pb-24', className)}
      style={{ background: t.background, color: textColor, fontFamily: t.font }}
    >
      {/* Decorative Grid Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-40" 
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'} 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />

      {/* Decorative Neon Aurora Blobs */}
      <div 
        className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full filter blur-[120px] opacity-[0.12] pointer-events-none animate-pulse" 
        style={{ background: t.primaryColor, animationDuration: '8s' }}
      />
      <div 
        className="absolute top-[30%] right-1/4 w-[500px] h-[500px] rounded-full filter blur-[140px] opacity-[0.1] pointer-events-none animate-pulse" 
        style={{ background: t.accentColor, animationDuration: '12s' }}
      />

      {/* Hero Header */}
      <motion.header
        className="relative max-w-4xl mx-auto px-8 pt-16 pb-12 sm:px-12 sm:pt-20 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative flex flex-col items-center gap-6">
          {/* Animated Glow Border Avatar */}
          <div className="relative group">
            <div 
              className="absolute -inset-1 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"
              style={{ background: `linear-gradient(135deg, ${t.primaryColor}, ${t.accentColor})` }}
            />
            <div
              className="relative h-28 w-28 overflow-hidden rounded-full border-2 bg-card p-1 shadow-xl"
              style={{ borderColor: t.primaryColor }}
            >
              {data.profile.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.profile.photo} alt={data.profile.fullName} className="h-full w-full rounded-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full text-3xl font-bold text-white shadow-inner" style={{ background: t.primaryColor }}>
                  {data.profile.fullName?.charAt(0) || '?'}
                </div>
              )}
            </div>
          </div>

          <div>
            {/* Gradient name */}
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl">
              <span className="bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(135deg, ${t.primaryColor}, ${t.accentColor})` }}>
                {data.profile.fullName || 'Your Name'}
              </span>
            </h1>
            
            <p className="mt-2 text-base font-semibold tracking-wide uppercase" style={{ color: t.primaryColor }}>
              {data.profile.jobTitle || 'Your Job Title'}
            </p>
            
            {data.profile.location && (
              <p className="mt-2 flex items-center justify-center gap-1.5 text-xs font-medium" style={{ color: subColor }}>
                <MapPin className="h-3.5 w-3.5" /> {data.profile.location}
              </p>
            )}
          </div>

          {/* Social icons row */}
          <div className="flex flex-wrap justify-center gap-3">
            {data.profile.email && (
              <button
                onClick={() => handleCopy(data.profile.email, 'email')}
                className="flex h-9 w-9 items-center justify-center rounded-full border transition-all hover:scale-105 active:scale-95"
                style={{ background: cardBg, borderColor: border !== 'none' ? border.split(' ')[2] : 'rgba(128,128,128,0.2)' }}
                title="Copy Email"
              >
                {copiedType === 'email' ? <Check className="h-4 w-4 text-emerald-500" /> : <Mail className="h-4 w-4" style={{ color: t.primaryColor }} />}
              </button>
            )}
            {data.profile.phone && (
              <button
                onClick={() => handleCopy(data.profile.phone, 'phone')}
                className="flex h-9 w-9 items-center justify-center rounded-full border transition-all hover:scale-105 active:scale-95"
                style={{ background: cardBg, borderColor: border !== 'none' ? border.split(' ')[2] : 'rgba(128,128,128,0.2)' }}
                title="Copy Phone"
              >
                {copiedType === 'phone' ? <Check className="h-4 w-4 text-emerald-500" /> : <Phone className="h-4 w-4" style={{ color: t.primaryColor }} />}
              </button>
            )}
            {data.profile.github && (
              <a
                href={data.profile.github.startsWith('http') ? data.profile.github : `https://${data.profile.github}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border transition-all hover:scale-105 active:scale-95"
                style={{ background: cardBg, borderColor: border !== 'none' ? border.split(' ')[2] : 'rgba(128,128,128,0.2)' }}
              >
                <Github className="h-4 w-4" style={{ color: t.primaryColor }} />
              </a>
            )}
            {data.profile.linkedin && (
              <a
                href={data.profile.linkedin.startsWith('http') ? data.profile.linkedin : `https://${data.profile.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-full border transition-all hover:scale-105 active:scale-95"
                style={{ background: cardBg, borderColor: border !== 'none' ? border.split(' ')[2] : 'rgba(128,128,128,0.2)' }}
              >
                <Linkedin className="h-4 w-4" style={{ color: t.primaryColor }} />
              </a>
            )}
          </div>

          {/* Button Style implementation */}
          {t.buttonStyle === 'gradient' && (
            <motion.a
              href={data.profile.email ? `mailto:${data.profile.email}` : '#'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 text-sm font-semibold text-white shadow-lg cursor-pointer hover:shadow-xl transition-all"
              style={{ background: `linear-gradient(135deg, ${t.primaryColor}, ${t.accentColor})`, borderRadius: radius }}
            >
              Get in Touch
            </motion.a>
          )}
          {t.buttonStyle === 'solid' && (
            <motion.a
              href={data.profile.email ? `mailto:${data.profile.email}` : '#'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 text-sm font-semibold text-white shadow-lg cursor-pointer hover:shadow-xl transition-all"
              style={{ background: t.primaryColor, borderRadius: radius }}
            >
              Get in Touch
            </motion.a>
          )}
          {t.buttonStyle === 'outline' && (
            <motion.a
              href={data.profile.email ? `mailto:${data.profile.email}` : '#'}
              whileHover={{ scale: 1.05, backgroundColor: `${t.primaryColor}10` }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-2.5 text-sm font-semibold cursor-pointer transition-all"
              style={{ border: `2px solid ${t.primaryColor}`, color: t.primaryColor, borderRadius: radius }}
            >
              Get in Touch
            </motion.a>
          )}
        </div>
      </motion.header>

      {/* Main Grid Container */}
      <motion.main 
        className="max-w-4xl mx-auto px-6 space-y-16"
        variants={containerVariants}
        {...motionProps}
      >
        {/* About & Stats Split Section */}
        {data.about && (
          <motion.section variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <div className="md:col-span-2 space-y-4">
              <h2 className="text-xl font-bold tracking-tight border-b-2 pb-2 w-fit" style={{ borderColor: t.primaryColor }}>About Me</h2>
              <p className="text-sm leading-relaxed" style={{ color: subColor }}>{data.about}</p>
            </div>
            
            {/* Stats Dashboard cards */}
            <div className="grid grid-cols-2 gap-3 md:col-span-1">
              <div style={{ background: cardBg, border, borderRadius: radius, backdropFilter }} className="p-3 text-center transition-transform hover:-translate-y-1">
                <p className="text-2xl font-bold" style={{ color: t.primaryColor }}>{data.projects.length}</p>
                <p className="text-[10px] uppercase font-semibold" style={{ color: subColor }}>Projects</p>
              </div>
              <div style={{ background: cardBg, border, borderRadius: radius, backdropFilter }} className="p-3 text-center transition-transform hover:-translate-y-1">
                <p className="text-2xl font-bold" style={{ color: t.accentColor }}>{data.skills.length}</p>
                <p className="text-[10px] uppercase font-semibold" style={{ color: subColor }}>Skills</p>
              </div>
              <div style={{ background: cardBg, border, borderRadius: radius, backdropFilter }} className="p-3 text-center transition-transform hover:-translate-y-1 col-span-2">
                <p className="text-lg font-bold" style={{ color: t.primaryColor }}>
                  {data.experience.length > 0 ? `${data.experience.length} Companies` : 'Fresher'}
                </p>
                <p className="text-[10px] uppercase font-semibold" style={{ color: subColor }}>Professional Experience</p>
              </div>
            </div>
          </motion.section>
        )}

        {/* Skills Category Grid */}
        {data.skills.length > 0 && (
          <motion.section variants={itemVariants} className="space-y-4">
            <h2 className="text-xl font-bold tracking-tight border-b-2 pb-2 w-fit" style={{ borderColor: t.primaryColor }}>Skills & Expertise</h2>
            <div className="flex flex-wrap gap-2.5">
              {data.skills.map((s) => {
                const Icon = getSkillIcon(s);
                return (
                  <motion.div
                    key={s}
                    whileHover={{ y: -3, scale: 1.05 }}
                    style={{ background: cardBg, border, borderRadius: radius, backdropFilter }}
                    className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold shadow-sm transition-all cursor-default"
                  >
                    <Icon className="h-4 w-4" style={{ color: t.primaryColor }} />
                    <span>{s}</span>
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* Projects Grid Redesign */}
        {data.projects.length > 0 && (
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight border-b-2 pb-2 w-fit" style={{ borderColor: t.primaryColor }}>Featured Projects</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {data.projects.map((p) => (
                <motion.div
                  key={p.id}
                  whileHover={{ y: -6, boxShadow: `0 10px 30px -10px ${t.primaryColor}30` }}
                  style={{ background: cardBg, border, borderRadius: radius, backdropFilter }}
                  className="group overflow-hidden transition-all duration-300"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-muted/20">
                    {/* Zoom Effect */}
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center" style={{ background: `linear-gradient(135deg, ${t.primaryColor}20, ${t.accentColor}20)` }}>
                        <Layout className="h-8 w-8 opacity-40" style={{ color: t.primaryColor }} />
                      </div>
                    )}
                    {/* Hover Link Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      {p.github && (
                        <a 
                          href={p.github.startsWith('http') ? p.github : `https://${p.github}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
                          title="View Source Code"
                        >
                          <Github className="h-5 w-5" />
                        </a>
                      )}
                      {p.live && (
                        <a 
                          href={p.live.startsWith('http') ? p.live : `https://${p.live}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors backdrop-blur-sm"
                          title="Live Demo"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold tracking-tight">{p.title}</h3>
                      <div className="flex gap-1.5 md:hidden">
                        {p.github && <Github className="h-4 w-4" style={{ color: subColor }} />}
                        {p.live && <ExternalLink className="h-4 w-4" style={{ color: subColor }} />}
                      </div>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: subColor }}>{p.description}</p>
                    {p.tech && p.tech.length > 0 && (
                      <div className="pt-2 flex flex-wrap gap-1">
                        {p.tech.map((tech) => (
                          <span 
                            key={tech} 
                            className="px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase rounded" 
                            style={{ background: `${t.accentColor}12`, color: t.accentColor }}
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Experience Timeline */}
        {data.experience.length > 0 && (
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight border-b-2 pb-2 w-fit" style={{ borderColor: t.primaryColor }}>Professional Experience</h2>
            
            <div className="relative pl-6 border-l-2 border-dashed space-y-8" style={{ borderColor: `${t.primaryColor}30` }}>
              {data.experience.map((e) => (
                <div key={e.id} className="relative group">
                  {/* Timeline bullet node */}
                  <div 
                    className="absolute -left-[33px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-background border-2 transition-transform group-hover:scale-125"
                    style={{ borderColor: t.primaryColor }}
                  >
                    <Briefcase className="h-2.5 w-2.5" style={{ color: t.primaryColor }} />
                  </div>

                  <div style={{ background: cardBg, border, borderRadius: radius, backdropFilter }} className="p-4 space-y-2 shadow-sm transition-all group-hover:translate-x-1">
                    <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                      <div>
                        <h3 className="text-base font-bold">{e.role}</h3>
                        <p className="text-xs font-semibold" style={{ color: t.primaryColor }}>{e.company}</p>
                      </div>
                      <span className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded border mt-1 sm:mt-0 w-fit" style={{ background: `${t.primaryColor}08`, borderColor: `${t.primaryColor}20`, color: subColor }}>
                        {e.start} — {e.end}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: subColor }}>{e.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Education Timeline */}
        {data.education.length > 0 && (
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight border-b-2 pb-2 w-fit" style={{ borderColor: t.primaryColor }}>Education</h2>
            
            <div className="relative pl-6 border-l-2 border-dashed space-y-8" style={{ borderColor: `${t.accentColor}30` }}>
              {data.education.map((edu) => (
                <div key={edu.id} className="relative group">
                  {/* Timeline bullet node */}
                  <div 
                    className="absolute -left-[33px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-background border-2 transition-transform group-hover:scale-125"
                    style={{ borderColor: t.accentColor }}
                  >
                    <GraduationCap className="h-2.5 w-2.5" style={{ color: t.accentColor }} />
                  </div>

                  <div style={{ background: cardBg, border, borderRadius: radius, backdropFilter }} className="p-4 space-y-2 shadow-sm transition-all group-hover:translate-x-1">
                    <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                      <div>
                        <h3 className="text-base font-bold">{edu.institution}</h3>
                        <p className="text-xs font-semibold" style={{ color: t.accentColor }}>{edu.degree} in {edu.field}</p>
                      </div>
                      <span className="text-[10px] font-bold tracking-wide uppercase px-2.5 py-0.5 rounded border mt-1 sm:mt-0 w-fit" style={{ background: `${t.accentColor}08`, borderColor: `${t.accentColor}20`, color: subColor }}>
                        {edu.start} — {edu.end}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: subColor }}>{edu.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Certificates Image Grid with Popups */}
        {data.certificates.length > 0 && (
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight border-b-2 pb-2 w-fit" style={{ borderColor: t.primaryColor }}>Certifications</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {data.certificates.map((c) => (
                <div 
                  key={c.id} 
                  style={{ background: cardBg, border, borderRadius: radius, backdropFilter }} 
                  className="group overflow-hidden transition-all duration-300 hover:shadow-md flex flex-col justify-between"
                >
                  <div className="relative h-32 w-full overflow-hidden bg-muted/20">
                    {c.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={c.image} alt={c.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center" style={{ background: `linear-gradient(135deg, ${t.primaryColor}10, ${t.accentColor}10)` }}>
                        <Award className="h-8 w-8 opacity-30" style={{ color: t.accentColor }} />
                      </div>
                    )}
                    {c.image && (
                      <div 
                        onClick={() => setSelectedCert(c)}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
                      >
                        <span className="flex items-center gap-1.5 text-xs text-white font-semibold bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm shadow">
                          <Eye className="h-3.5 w-3.5" /> View Certificate
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 text-center">
                    <p className="text-xs font-bold">{c.title}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: subColor }}>{c.issuer} · {c.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Achievements Grid */}
        {data.achievements.length > 0 && (
          <motion.section variants={itemVariants} className="space-y-6">
            <h2 className="text-xl font-bold tracking-tight border-b-2 pb-2 w-fit" style={{ borderColor: t.primaryColor }}>Honors & Achievements</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {data.achievements.map((a) => (
                <div 
                  key={a.id} 
                  style={{ background: cardBg, border, borderRadius: radius, backdropFilter }} 
                  className="p-4 flex gap-3.5 items-start transition-transform hover:-translate-y-1 shadow-sm"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                    <Trophy className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-bold tracking-tight">{a.title}</h3>
                      <span className="text-[9px] font-bold tracking-wide uppercase px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{a.date}</span>
                    </div>
                    <p className="text-xs leading-relaxed" style={{ color: subColor }}>{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Glassmorphism Contact Panel */}
        <motion.section variants={itemVariants} className="space-y-4">
          <h2 className="text-xl font-bold tracking-tight border-b-2 pb-2 w-fit" style={{ borderColor: t.primaryColor }}>Get in Touch</h2>
          
          <div 
            style={{ background: cardBg, border, borderRadius: radius, backdropFilter }} 
            className="p-6 shadow-md grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {data.contact.showEmail && data.profile.email && (
              <div 
                onClick={() => handleCopy(data.profile.email, 'email')}
                className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-muted/40 transition-colors cursor-pointer group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <Mail className="h-4.5 w-4.5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: subColor }}>Email Address</p>
                  <p className="text-xs font-semibold truncate max-w-[200px]">{data.profile.email}</p>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  {copiedType === 'email' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />}
                </div>
              </div>
            )}
            
            {data.contact.showPhone && data.profile.phone && (
              <div 
                onClick={() => handleCopy(data.profile.phone, 'phone')}
                className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-muted/40 transition-colors cursor-pointer group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <Phone className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: subColor }}>Phone Number</p>
                  <p className="text-xs font-semibold">{data.profile.phone}</p>
                </div>
                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                  {copiedType === 'phone' ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-muted-foreground hover:text-foreground" />}
                </div>
              </div>
            )}

            {data.contact.showSocial && data.profile.github && (
              <a 
                href={data.profile.github.startsWith('http') ? data.profile.github : `https://${data.profile.github}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-muted/40 transition-colors"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <Github className="h-4.5 w-4.5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: subColor }}>GitHub Profile</p>
                  <p className="text-xs font-semibold truncate max-w-[200px]">{data.profile.github}</p>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
              </a>
            )}

            {data.contact.showSocial && data.profile.linkedin && (
              <a 
                href={data.profile.linkedin.startsWith('http') ? data.profile.linkedin : `https://${data.profile.linkedin}`}
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-muted/40 transition-colors"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                  <Linkedin className="h-4.5 w-4.5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] uppercase font-bold tracking-wider" style={{ color: subColor }}>LinkedIn Profile</p>
                  <p className="text-xs font-semibold truncate max-w-[200px]">{data.profile.linkedin}</p>
                </div>
                <ExternalLink className="h-4 w-4 ml-auto text-muted-foreground" />
              </a>
            )}
          </div>
        </motion.section>
      </motion.main>

      {/* Certificate Lightbox Popup Modal */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative max-w-3xl w-full rounded-2xl overflow-hidden border bg-card shadow-2xl p-2"
              style={{ borderColor: t.primaryColor }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setSelectedCert(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full shadow transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={selectedCert.image} alt={selectedCert.title} className="w-full max-h-[75vh] object-contain rounded-xl" />
              <div className="p-4 text-center">
                <h3 className="text-lg font-bold">{selectedCert.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedCert.issuer} · {selectedCert.date}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper utility cn
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

'use client';

import type { PortfolioData, Project, Education, Experience, Certificate, Achievement } from '@/lib/portfolio-data';

export interface ParsedResume {
  fullName?: string;
  jobTitle?: string;
  email?: string;
  phone?: string;
  location?: string;
  website?: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
  about?: string;
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects: Project[];
  certificates: Certificate[];
  achievements: Achievement[];
}

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_RE = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}/;
const URL_RE = /(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/[^\s]*)?/g;
const LINKEDIN_RE = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/(?:in|pub)\/([a-zA-Z0-9_-]+)/i;
const GITHUB_RE = /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9_-]+)/i;
const TWITTER_RE = /@([a-zA-Z0-9_]{4,15})/;
const DATE_RANGE_RE = /(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?\s*[\d]{4}\s*[-–—]\s*(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)?\s*(?:[\d]{4}|present|current|now)/i;

const KNOWN_SKILLS = [
  'React', 'Next.js', 'Node.js', 'TypeScript', 'JavaScript', 'Python', 'Java', 'C++', 'C#',
  'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Dart', 'Flutter', 'Vue', 'Angular',
  'Svelte', 'Redux', 'GraphQL', 'REST', 'HTML', 'CSS', 'SCSS', 'Tailwind', 'Bootstrap',
  'Sass', 'Figma', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'Azure', 'Firebase', 'Supabase',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'SQLite', 'Prisma', 'Django', 'Flask',
  'Express', 'NestJS', 'Spring', 'Rails', 'Laravel', 'Git', 'CI/CD', 'Jenkins', 'Linux',
  'Nginx', 'Webpack', 'Vite', 'Jest', 'Cypress', 'Framer Motion', 'Three.js', 'TensorFlow',
  'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn', 'Machine Learning', 'Deep Learning', 'AI',
  'NLP', 'UI/UX', 'Photoshop', 'Illustrator', 'Bash', 'PowerShell', 'Wordpress', 'Shopify'
];

const SECTION_HEADERS = {
  experience: /experience|work\s+experience|professional\s+experience|employment|work\s+history/i,
  education: /education|academic|qualifications/i,
  projects: /projects|personal\s+projects|academic\s+projects|key\s+projects/i,
  certificates: /certificates|certifications|licenses/i,
  achievements: /achievements|awards|accomplishments|honors/i
};

export function parseResumeText(text: string): ParsedResume {
  const result: ParsedResume = {
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certificates: [],
    achievements: []
  };

  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);

  // 1. Core Contact Extraction (Search globally)
  const emailMatch = text.match(EMAIL_RE);
  if (emailMatch) result.email = emailMatch[0];

  const phoneMatch = text.match(PHONE_RE);
  if (phoneMatch && phoneMatch[0].replace(/\D/g, '').length >= 10) {
    result.phone = phoneMatch[0].trim();
  }

  const linkedinMatch = text.match(LINKEDIN_RE);
  if (linkedinMatch) result.linkedin = `linkedin.com/in/${linkedinMatch[1]}`;

  const githubMatch = text.match(GITHUB_RE);
  if (githubMatch) result.github = `github.com/${githubMatch[1]}`;

  const twitterMatch = text.match(TWITTER_RE);
  if (twitterMatch && !result.email?.includes(twitterMatch[1])) {
    result.twitter = `@${twitterMatch[1]}`;
  }

  const allUrls = text.match(URL_RE) || [];
  const website = allUrls.find((u) =>
    !u.includes('linkedin') && !u.includes('github') && !u.includes('twitter') && !u.includes('facebook') && !u.includes('@')
  );
  if (website) result.website = website.replace(/^https?:\/\//, '').replace(/^www\./, '');

  // 2. Skills Extraction (Globally)
  const lowerText = text.toLowerCase();
  result.skills = KNOWN_SKILLS.filter((skill) => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(?<![a-zA-Z])${escaped}(?![a-zA-Z])`, 'i');
    return re.test(lowerText);
  });

  // 3. Name & Job Title (Search in top header lines)
  for (const rawLine of lines.slice(0, 10)) {
    const line = rawLine.replace(/[,|•·\-\/]/g, ' ').replace(/\s+/g, ' ').trim();
    if (line.match(EMAIL_RE) || line.match(URL_RE) || line.length < 3 || line.length > 40) continue;
    if (line.toLowerCase().includes('resume') || line.toLowerCase().includes('curriculum') || line.toLowerCase().includes('cv')) continue;
    
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 4) {
      const capitalizedCount = words.filter(w => /^[A-Z]/.test(w) || w === w.toUpperCase()).length;
      if (capitalizedCount >= words.length - 1) {
        result.fullName = line;
        break;
      }
    }
  }

  if (result.fullName) {
    const nameIndex = lines.findIndex(l => l.includes(result.fullName!) || l.replace(/[,|•·\-\/]/g, ' ').includes(result.fullName!));
    if (nameIndex !== -1) {
      for (let i = nameIndex + 1; i <= nameIndex + 3 && i < lines.length; i++) {
        const line = lines[i].trim();
        if (line.match(EMAIL_RE) || line.match(URL_RE) || line.match(PHONE_RE) || line.length > 50) continue;
        
        const isTitle = /developer|engineer|designer|manager|architect|consultant|analyst|specialist|lead|intern|administrator|programmer|scientist|researcher|student|founder|exec|writer|creator/i.test(line);
        if (isTitle) {
          result.jobTitle = line.replace(/[,|•·\-\/]/g, ' ').replace(/\s+/g, ' ').trim();
          break;
        }
      }
    }
  }

  if (!result.jobTitle) {
    for (const line of lines.slice(0, 15)) {
      if (line.match(EMAIL_RE) || line.match(URL_RE) || line.match(PHONE_RE) || line.length > 50) continue;
      if (line === result.fullName) continue;
      
      const isTitle = /developer|engineer|designer|manager|architect|consultant|analyst|specialist|lead|intern|administrator|programmer|scientist|researcher|student|founder|exec|writer|creator/i.test(line);
      if (isTitle) {
        result.jobTitle = line.trim();
        break;
      }
    }
  }

  // 4. Location Extraction
  const locPattern = /([A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)?,\s*(?:[A-Z]{2}|[A-Z][a-zA-Z]+))/;
  const locMatch = text.match(locPattern);
  if (locMatch) result.location = locMatch[1];

  // 5. Partition Remaining Text into Sections
  const sectionContent: Record<string, string[]> = {
    experience: [],
    education: [],
    projects: [],
    certificates: [],
    achievements: []
  };

  let currentSection = '';
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    let matched = false;
    for (const [secName, regex] of Object.entries(SECTION_HEADERS)) {
      if (regex.test(line) && line.length < 30) {
        currentSection = secName;
        matched = true;
        break;
      }
    }
    if (matched) continue;

    if (currentSection && sectionContent[currentSection]) {
      sectionContent[currentSection].push(lines[i]);
    }
  }

  // 6. Parse Summary / About from Header
  const summaryHeaderRegex = /(?:summary|profile|about\s*me|objective|professional\s+summary)/i;
  let summaryText = '';
  for (let i = 0; i < lines.length; i++) {
    if (summaryHeaderRegex.test(lines[i]) && lines[i].length < 30) {
      const collected = [];
      const headingRegex = /experience|education|skills|projects|certificates|achievements|contact/i;
      for (let j = i + 1; j < i + 10 && j < lines.length; j++) {
        const nextLine = lines[j].trim();
        if (headingRegex.test(nextLine) && nextLine.length < 25) break;
        if (nextLine) collected.push(nextLine);
      }
      summaryText = collected.join(' ');
      break;
    }
  }
  if (summaryText) {
    result.about = summaryText.slice(0, 500);
  }

  // 7. Execute Sub-block Parsers
  if (sectionContent.experience.length > 0) {
    result.experience = parseExperienceBlock(sectionContent.experience);
  }
  if (sectionContent.education.length > 0) {
    result.education = parseEducationBlock(sectionContent.education);
  }
  if (sectionContent.projects.length > 0) {
    result.projects = parseProjectsBlock(sectionContent.projects);
  }
  if (sectionContent.certificates.length > 0) {
    result.certificates = parseCertificatesBlock(sectionContent.certificates);
  }
  if (sectionContent.achievements.length > 0) {
    result.achievements = parseAchievementsBlock(sectionContent.achievements);
  }

  return result;
}

function parseExperienceBlock(lines: string[]): Experience[] {
  const items: Experience[] = [];
  let currentItem: Experience | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const dateMatch = line.match(DATE_RANGE_RE);
    if (dateMatch) {
      if (currentItem) items.push(currentItem);
      
      const dateStr = dateMatch[0];
      const dateParts = dateStr.split(/[-–—]/).map(d => d.trim());
      const start = dateParts[0] || '';
      const end = dateParts[1] || '';
      
      const textWithoutDate = line.replace(dateMatch[0], '').replace(/\s*[,|•·\-\/]\s*$/, '').trim();
      
      let company = '';
      let role = '';
      const separators = [/\|/, /at\s+/, /,/, /–/, /-/];
      let parsed = false;
      for (const sep of separators) {
        const parts = textWithoutDate.split(sep).map(p => p.trim());
        if (parts.length >= 2) {
          const p1 = parts[0];
          const p2 = parts[1];
          const p1IsRole = /developer|engineer|designer|manager|architect|consultant|analyst|specialist|lead|intern|programmer/i.test(p1);
          if (p1IsRole) {
            role = p1;
            company = p2;
          } else {
            company = p1;
            role = p2;
          }
          parsed = true;
          break;
        }
      }
      
      if (!parsed) {
        role = textWithoutDate;
        company = '';
      }
      
      currentItem = {
        id: `exp-${Date.now()}-${items.length}-${Math.random().toString(36).substr(2, 4)}`,
        company: company || 'Company Name',
        role: role || 'Job Title',
        start,
        end,
        description: '',
        logo: ''
      };
    } else if (currentItem) {
      const cleanLine = line.replace(/^[•·\-\*\s]+/, '').trim();
      if (currentItem.description) {
        currentItem.description += '\n' + cleanLine;
      } else {
        currentItem.description = cleanLine;
      }
    }
  }
  
  if (currentItem) items.push(currentItem);
  return items;
}

function parseEducationBlock(lines: string[]): Education[] {
  const items: Education[] = [];
  let currentItem: Education | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const dateMatch = line.match(DATE_RANGE_RE) || line.match(/\b(19|20)\d{2}\b/);
    const degreeMatch = /b\.?s\.?|m\.?s\.?|ph\.?d\.?|bachelor|master|doctor|graduate|diploma|associate/i.test(line);
    
    if (dateMatch || degreeMatch) {
      const isNewItem = currentItem && (degreeMatch || line.includes('|') || line.includes(','));
      if (isNewItem) {
        if (currentItem) items.push(currentItem);
        currentItem = null;
      }
      
      if (!currentItem) {
        let start = '';
        let end = '';
        if (dateMatch) {
          const dateParts = dateMatch[0].split(/[-–—]/).map(d => d.trim());
          start = dateParts[0] || dateMatch[0];
          end = dateParts[1] || '';
        }
        
        const textWithoutDate = line.replace(dateMatch ? dateMatch[0] : '', '').replace(/\s*[,|•·\-\/]\s*$/, '').trim();
        
        let institution = 'University/School';
        let degree = '';
        let field = '';
        
        const parts = textWithoutDate.split(/[|,]/).map(p => p.trim());
        if (parts.length >= 3) {
          institution = parts[0];
          degree = parts[1];
          field = parts[2];
        } else if (parts.length === 2) {
          institution = parts[0];
          const p2 = parts[1];
          if (/in\s+(.+)/i.test(p2)) {
            field = p2.replace(/in\s+/i, '');
          } else {
            degree = p2;
          }
        } else {
          institution = textWithoutDate || 'University';
        }
        
        const fieldMatch = degree.match(/(?:b\.?s\.?|m\.?s\.?|ph\.?d\.?|bachelor|master|degree|associate)\s+(?:in|of)\s+(.+)/i);
        if (fieldMatch) {
          field = fieldMatch[1];
          degree = degree.replace(fieldMatch[0], degree.match(/b\.?s\.?|m\.?s\.?|ph\.?d\.?|bachelor|master|degree|associate/i)?.[0] || degree);
        }
        
        currentItem = {
          id: `edu-${Date.now()}-${items.length}-${Math.random().toString(36).substr(2, 4)}`,
          institution: institution || 'University',
          degree: degree || 'Degree',
          field: field || 'Field of Study',
          start,
          end,
          description: ''
        };
      }
    } else if (currentItem) {
      const cleanLine = line.replace(/^[•·\-\*\s]+/, '').trim();
      if (currentItem.description) {
        currentItem.description += '\n' + cleanLine;
      } else {
        currentItem.description = cleanLine;
      }
    }
  }
  
  if (currentItem) items.push(currentItem);
  return items;
}

function parseProjectsBlock(lines: string[]): Project[] {
  const items: Project[] = [];
  let currentItem: Project | null = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    
    const isHeader = !line.startsWith('-') && !line.startsWith('*') && !line.startsWith('•') && line.length < 50;
    
    if (isHeader) {
      if (currentItem) items.push(currentItem);
      
      let github = '';
      const githubMatch = line.match(GITHUB_RE);
      if (githubMatch) github = `github.com/${githubMatch[1]}`;
      
      const cleanTitle = line.replace(GITHUB_RE, '').replace(/\s*[\(\[].*?[\)\]]/g, '').trim();
      
      currentItem = {
        id: `proj-${Date.now()}-${items.length}-${Math.random().toString(36).substr(2, 4)}`,
        title: cleanTitle || 'Project Name',
        description: '',
        tech: [],
        github,
        live: '',
        image: ''
      };
    } else if (currentItem) {
      const techMatch = line.match(/(?:tech(?:nologies)?|built\s+with|stack)\s*:\s*(.+)/i);
      if (techMatch) {
        currentItem.tech = techMatch[1].split(/[,|]/).map(t => t.trim());
      } else {
        const cleanLine = line.replace(/^[•·\-\*\s]+/, '').trim();
        const foundTech = KNOWN_SKILLS.filter(s => new RegExp(`\\b${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i').test(cleanLine));
        for (const t of foundTech) {
          if (!currentItem.tech.includes(t)) currentItem.tech.push(t);
        }
        
        if (currentItem.description) {
          currentItem.description += '\n' + cleanLine;
        } else {
          currentItem.description = cleanLine;
        }
      }
    }
  }
  
  if (currentItem) items.push(currentItem);
  return items;
}

function parseCertificatesBlock(lines: string[]): Certificate[] {
  const items: Certificate[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.length > 100) continue;
    
    const dateMatch = line.match(/\b(19|20)\d{2}\b/);
    const date = dateMatch ? dateMatch[0] : '';
    const textWithoutDate = line.replace(dateMatch ? dateMatch[0] : '', '').replace(/\s*[,|•·\-\/]\s*$/, '').trim();
    
    let title = textWithoutDate;
    let issuer = 'Issuer';
    
    const parts = textWithoutDate.split(/[-–—,]/).map(p => p.trim());
    if (parts.length >= 2) {
      title = parts[0];
      issuer = parts[1];
    }
    
    items.push({
      id: `cert-${Date.now()}-${items.length}-${Math.random().toString(36).substr(2, 4)}`,
      title: title || 'Certificate Title',
      issuer: issuer || 'Issuer',
      date: date || 'Date',
      image: ''
    });
  }
  
  return items;
}

function parseAchievementsBlock(lines: string[]): Achievement[] {
  const items: Achievement[] = [];
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.length > 200) continue;
    
    const dateMatch = line.match(/\b(19|20)\d{2}\b/);
    const date = dateMatch ? dateMatch[0] : '';
    const description = line.replace(dateMatch ? dateMatch[0] : '', '').trim();
    const title = description.split(/[-–—,]/)[0].trim();
    
    items.push({
      id: `ach-${Date.now()}-${items.length}-${Math.random().toString(36).substr(2, 4)}`,
      title: title || 'Achievement',
      description: description || 'Achievement details',
      date: date || 'Date'
    });
  }
  
  return items;
}

export function applyParsedResume(parsed: ParsedResume, draft: PortfolioData): void {
  if (parsed.fullName) draft.profile.fullName = parsed.fullName;
  if (parsed.jobTitle) draft.profile.jobTitle = parsed.jobTitle;
  if (parsed.email) draft.profile.email = parsed.email;
  if (parsed.phone) draft.profile.phone = parsed.phone;
  if (parsed.location) draft.profile.location = parsed.location;
  if (parsed.website) draft.profile.website = parsed.website;
  if (parsed.github) draft.profile.github = parsed.github;
  if (parsed.linkedin) draft.profile.linkedin = parsed.linkedin;
  if (parsed.twitter) draft.profile.twitter = parsed.twitter;
  if (parsed.about) draft.about = parsed.about;
  
  if (parsed.skills.length > 0) {
    const existing = new Set(draft.skills);
    for (const s of parsed.skills) {
      if (!existing.has(s)) draft.skills.push(s);
    }
  }

  // Populate dynamic structured lists
  if (parsed.experience.length > 0) {
    draft.experience = parsed.experience;
  }
  if (parsed.education.length > 0) {
    draft.education = parsed.education;
  }
  if (parsed.projects.length > 0) {
    draft.projects = parsed.projects;
  }
  if (parsed.certificates.length > 0) {
    draft.certificates = parsed.certificates;
  }
  if (parsed.achievements.length > 0) {
    draft.achievements = parsed.achievements;
  }
}

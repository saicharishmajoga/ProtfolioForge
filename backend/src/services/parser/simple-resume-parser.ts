import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import { IResumeParser } from './resume-parser.interface';
import { ParsedResumeData } from '../../types';
import { logger } from '../../config/logger';
import { BadRequestError } from '../../utils/custom-errors';

export class SimpleResumeParser implements IResumeParser {
  private commonSkills = [
    'javascript', 'typescript', 'python', 'java', 'go', 'golang', 'rust', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin',
    'node.js', 'nodejs', 'express', 'nestjs', 'django', 'flask', 'spring boot', 'rails', 'fastapi',
    'react', 'angular', 'vue', 'next.js', 'nextjs', 'nuxt', 'svelte', 'jquery', 'bootstrap', 'tailwindcss',
    'postgresql', 'mysql', 'mongodb', 'redis', 'sqlite', 'oracle', 'cassandra', 'prisma', 'sequelize', 'mongoose',
    'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'jenkins', 'git', 'github', 'gitlab', 'ci/cd', 'terraform',
    'html', 'css', 'sass', 'graphql', 'rest api', 'graphql', 'restful api', 'microservices', 'serverless'
  ];

  async parse(filePath: string): Promise<ParsedResumeData> {
    logger.info(`Starting parser pipeline for file: ${filePath}`);
    const fileExt = path.extname(filePath).toLowerCase();
    
    let rawText = '';

    if (!fs.existsSync(filePath)) {
      throw new BadRequestError('Resume file not found on disk');
    }

    try {
      if (fileExt === '.pdf') {
        const fileBuffer = await fs.promises.readFile(filePath);
        const pdfData = await pdfParse(fileBuffer);
        rawText = pdfData.text;
      } else if (fileExt === '.docx') {
        const result = await mammoth.extractRawText({ path: filePath });
        rawText = result.value;
      } else {
        throw new BadRequestError('Unsupported resume file type. Only PDF and DOCX are allowed.');
      }
    } catch (error: any) {
      logger.error(`Error extracting text from resume: ${error.message}`);
      throw new BadRequestError(`Failed to parse resume text: ${error.message}`);
    }

    if (!rawText || rawText.trim() === '') {
      throw new BadRequestError('Extracted resume text is empty');
    }

    return this.parseText(rawText);
  }

  private parseText(text: string): ParsedResumeData {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    const email = this.extractEmail(text);
    const phone = this.extractPhone(text);
    const name = this.extractName(lines);
    const skills = this.extractSkills(text);
    
    // Group sections to pull experiences, educations, and projects
    const sections = this.splitIntoSections(lines);
    
    const experience = this.parseExperience(sections.experience);
    const education = this.parseEducation(sections.education);
    const projects = this.parseProjects(sections.projects);

    return {
      name,
      email,
      phone,
      skills,
      projects,
      education,
      experience
    };
  }

  private extractEmail(text: string): string | undefined {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i;
    const match = text.match(emailRegex);
    return match ? match[0] : undefined;
  }

  private extractPhone(text: string): string | undefined {
    // Matches standard phone numbers, with extensions and country codes
    const phoneRegex = /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
    const match = text.match(phoneRegex);
    return match ? match[0] : undefined;
  }

  private extractName(lines: string[]): string | undefined {
    // The name is typically in the first 3 lines of the resume
    const nameRegex = /^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)+$/;
    for (let i = 0; i < Math.min(lines.length, 5); i++) {
      const line = lines[i];
      // Skip if it contains email or phone, or keywords
      if (line.includes('@') || /phone|tel|email|contact|curriculum|resume/i.test(line)) {
        continue;
      }
      if (nameRegex.test(line)) {
        return line;
      }
    }
    // Fallback: return the first line if it's short and clean
    if (lines.length > 0 && lines[0].length < 30 && !lines[0].includes('@')) {
      return lines[0];
    }
    return undefined;
  }

  private extractSkills(text: string): string[] {
    const foundSkills: Set<string> = new Set();
    const lowercaseText = text.toLowerCase();

    for (const skill of this.commonSkills) {
      // Use boundary checks to avoid partial matches (e.g. "go" matches "good")
      let regexPattern = new RegExp(`\\b${skill.replace('.', '\\.')}\\b`, 'i');
      if (skill === 'c++') {
        regexPattern = /c\+\+/i;
      } else if (skill === 'c#') {
        regexPattern = /c#/i;
      } else if (skill === 'node.js') {
        regexPattern = /node\.js/i;
      } else if (skill === 'next.js') {
        regexPattern = /next\.js/i;
      }

      if (regexPattern.test(lowercaseText)) {
        // Normalize name
        let skillName = skill;
        if (skill === 'nodejs') skillName = 'Node.js';
        else if (skill === 'typescript') skillName = 'TypeScript';
        else if (skill === 'javascript') skillName = 'JavaScript';
        else if (skill === 'golang') skillName = 'Go';
        else if (skill === 'nextjs') skillName = 'Next.js';
        else {
          // Capitalize first letter
          skillName = skill.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }
        foundSkills.add(skillName);
      }
    }

    return Array.from(foundSkills);
  }

  private splitIntoSections(lines: string[]): {
    experience: string[];
    education: string[];
    projects: string[];
  } {
    const experienceLines: string[] = [];
    const educationLines: string[] = [];
    const projectsLines: string[] = [];

    let currentSection: 'none' | 'experience' | 'education' | 'projects' = 'none';

    for (const line of lines) {
      const isHeader = line.length < 40 && /^(experience|work|employment|history|professional|education|academic|studies|projects|personal projects|achievements|skills)/i.test(line);
      
      if (isHeader) {
        if (/experience|work|employment|history|professional/i.test(line)) {
          currentSection = 'experience';
        } else if (/education|academic|studies/i.test(line)) {
          currentSection = 'education';
        } else if (/projects|personal projects/i.test(line)) {
          currentSection = 'projects';
        } else {
          currentSection = 'none';
        }
        continue;
      }

      if (currentSection === 'experience') {
        experienceLines.push(line);
      } else if (currentSection === 'education') {
        educationLines.push(line);
      } else if (currentSection === 'projects') {
        projectsLines.push(line);
      }
    }

    return {
      experience: experienceLines,
      education: educationLines,
      projects: projectsLines,
    };
  }

  private parseExperience(lines: string[]): ParsedResumeData['experience'] {
    const experiences: ParsedResumeData['experience'] = [];
    if (lines.length === 0) return experiences;

    let currentExp: any = null;

    for (const line of lines) {
      // Look for company and position indicators (e.g. "Google - Software Engineer" or "Software Engineer | Amazon")
      const dateMatch = line.match(/(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|\d{4})[\s-]*(Present|to|until|\d{4})?/i);
      
      if (line.includes('|') || line.includes('-') || dateMatch) {
        if (currentExp) {
          experiences.push(currentExp);
        }
        
        // Parse company & role
        const parts = line.split(/[|-]/).map(p => p.trim());
        const company = parts[0] || 'Company';
        const position = parts[1] || 'Software Engineer';
        
        currentExp = {
          company,
          position,
          description: '',
          startDate: '2022-01-01', // Fallback placeholders for form filling
          currentlyWorking: line.toLowerCase().includes('present'),
        };
      } else if (currentExp) {
        currentExp.description += (currentExp.description ? ' ' : '') + line;
      }
    }

    if (currentExp) {
      experiences.push(currentExp);
    }

    return experiences;
  }

  private parseEducation(lines: string[]): ParsedResumeData['education'] {
    const educations: ParsedResumeData['education'] = [];
    if (lines.length === 0) return educations;

    let currentEdu: any = null;

    for (const line of lines) {
      const isDegree = /bachelor|master|phd|bs|ms|b\.s|m\.s|degree|diploma|university|college|school/i.test(line);
      
      if (isDegree) {
        if (currentEdu) {
          educations.push(currentEdu);
        }
        
        const parts = line.split(/,|-/).map(p => p.trim());
        const college = parts.find(p => /university|college|school/i.test(p)) || parts[0] || 'Institution';
        const degree = parts.find(p => /bachelor|master|phd|bs|ms|b\.s|m\.s|degree|diploma/i.test(p)) || parts[1] || 'Degree';
        
        // Try to match CGPA
        const gpaMatch = line.match(/(?:gpa|cgpa)[:\s]*(\d\.\d\d?)/i);
        const cgpa = gpaMatch ? parseFloat(gpaMatch[1]) : undefined;

        currentEdu = {
          college,
          degree,
          cgpa,
          startDate: '2018-09-01',
          endDate: '2022-06-30'
        };
      }
    }

    if (currentEdu) {
      educations.push(currentEdu);
    }

    return educations;
  }

  private parseProjects(lines: string[]): ParsedResumeData['projects'] {
    const projects: ParsedResumeData['projects'] = [];
    if (lines.length === 0) return projects;

    let currentProj: any = null;

    for (const line of lines) {
      const isProjectHeader = line.length < 50 && (line.includes('GitHub') || line.includes('http') || /^[A-Z][a-zA-Z0-9\s-_]{2,20}$/.test(line));
      
      if (isProjectHeader && !/technologies|tools/i.test(line)) {
        if (currentProj) {
          projects.push(currentProj);
        }
        
        // Try to extract links
        const urlMatch = line.match(/https?:\/\/[^\s]+/);
        const title = line.replace(/https?:\/\/[^\s]+/, '').replace(/[^a-zA-Z0-9\s]/g, '').trim();

        currentProj = {
          title: title || 'Personal Project',
          description: '',
          liveUrl: urlMatch ? urlMatch[0] : undefined,
        };
      } else if (currentProj) {
        currentProj.description += (currentProj.description ? ' ' : '') + line;
      }
    }

    if (currentProj) {
      projects.push(currentProj);
    }

    return projects;
  }
}

export const resumeParser = new SimpleResumeParser();

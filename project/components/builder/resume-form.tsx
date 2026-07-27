'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UploadCloud, FileText, Check, X, Loader2, Sparkles,
  Mail, Phone, MapPin, Github, Linkedin, Wand2,
} from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { parseResumeText, applyParsedResume, type ParsedResume } from '@/lib/resume-parser';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export function ResumeForm() {
  const { data, update } = usePortfolio();
  const [fileName, setFileName] = React.useState<string | null>(null);
  const [parsing, setParsing] = React.useState(false);
  const [parsed, setParsed] = React.useState<ParsedResume | null>(null);
  const [dragOver, setDragOver] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFile = React.useCallback(async (file: File) => {
    if (!file) return;
    const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
    const isText = file.type.startsWith('text/') || file.name.toLowerCase().match(/\.(txt|md|rtf)$/);

    if (!isPdf && !isText) {
      toast.error('Please upload a PDF or text file');
      return;
    }

    setFileName(file.name);
    setParsing(true);
    setParsed(null);

    try {
      let text = '';
      if (isPdf) {
        text = await extractPdfText(file);
      } else {
        text = await file.text();
      }

      if (!text.trim()) {
        toast.error('Could not read any text from the file');
        setParsing(false);
        return;
      }

      const result = parseResumeText(text);
      setParsed(result);
      setParsing(false);

      const filledCount = countFilled(result);
      if (filledCount > 0) {
        update((draft) => applyParsedResume(result, draft));
        toast.success(`Extracted ${filledCount} fields from your resume`);
      } else {
        toast.info('Could not extract recognizable info — you can still edit manually');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to parse the resume. Please try a different file.');
      setParsing(false);
    }
  }, [update]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const clearResume = () => {
    setFileName(null);
    setParsed(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold">Upload Resume</h2>
        <p className="text-sm text-muted-foreground">
          Upload your resume and we'll extract your details to autofill the form. This is optional — skip it and fill in manually if you prefer.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.txt,.md,.rtf,application/pdf,text/*"
            className="hidden"
            onChange={handleInputChange}
          />

          {!fileName && (
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed py-12 text-center transition-colors ${
                dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40 hover:bg-muted/50'
              }`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <UploadCloud className="h-7 w-7" />
              </div>
              <div>
                <p className="font-semibold">Drop your resume here or click to upload</p>
                <p className="mt-1 text-sm text-muted-foreground">Supports PDF, TXT, MD, RTF — max 5MB</p>
              </div>
              <GradientButton variant="gradient-outline" size="sm" className="mt-2">
                <FileText className="h-4 w-4" /> Choose File
              </GradientButton>
            </div>
          )}

          {fileName && (
            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {parsing ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileText className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{fileName}</p>
                    <p className="text-xs text-muted-foreground">
                      {parsing ? 'Extracting information...' : parsed ? 'Resume parsed successfully' : 'Processing...'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={clearResume}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <AnimatePresence>
                {parsed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center gap-2 rounded-xl bg-success/10 p-3 text-sm text-success">
                      <Check className="h-4 w-4" />
                      <span>Fields auto-filled from your resume. You can edit them anytime.</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {parsed.fullName && (
                        <ExtractedField icon={Sparkles} label="Name" value={parsed.fullName} />
                      )}
                      {parsed.jobTitle && (
                        <ExtractedField icon={Sparkles} label="Job Title" value={parsed.jobTitle} />
                      )}
                      {parsed.email && (
                        <ExtractedField icon={Mail} label="Email" value={parsed.email} />
                      )}
                      {parsed.phone && (
                        <ExtractedField icon={Phone} label="Phone" value={parsed.phone} />
                      )}
                      {parsed.location && (
                        <ExtractedField icon={MapPin} label="Location" value={parsed.location} />
                      )}
                      {parsed.github && (
                        <ExtractedField icon={Github} label="GitHub" value={parsed.github} />
                      )}
                      {parsed.linkedin && (
                        <ExtractedField icon={Linkedin} label="LinkedIn" value={parsed.linkedin} />
                      )}
                    </div>

                    {parsed.skills.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Extracted Skills ({parsed.skills.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {parsed.skills.map((s) => (
                            <Badge key={s} variant="secondary" className="gap-1">
                              <Check className="h-3 w-3 text-success" />
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {parsed.about && (
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Extracted Summary
                        </p>
                        <p className="rounded-lg border bg-muted/30 p-3 text-sm text-muted-foreground">
                          {parsed.about}
                        </p>
                      </div>
                    )}

                    {parsed.experience && parsed.experience.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Extracted Experience ({parsed.experience.length})
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {parsed.experience.map((exp, idx) => (
                            <div key={idx} className="flex justify-between items-center rounded-lg border bg-muted/20 p-2.5 text-sm">
                              <div>
                                <p className="font-semibold">{exp.role}</p>
                                <p className="text-xs text-muted-foreground">{exp.company}</p>
                              </div>
                              <span className="text-xs text-muted-foreground">{exp.start} — {exp.end}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {parsed.education && parsed.education.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Extracted Education ({parsed.education.length})
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {parsed.education.map((edu, idx) => (
                            <div key={idx} className="flex justify-between items-center rounded-lg border bg-muted/20 p-2.5 text-sm">
                              <div>
                                <p className="font-semibold">{edu.degree} in {edu.field}</p>
                                <p className="text-xs text-muted-foreground">{edu.institution}</p>
                              </div>
                              <span className="text-xs text-muted-foreground">{edu.start} — {edu.end}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {parsed.projects && parsed.projects.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Extracted Projects ({parsed.projects.length})
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {parsed.projects.map((proj, idx) => (
                            <div key={idx} className="rounded-lg border bg-muted/20 p-2.5 text-sm">
                              <p className="font-semibold">{proj.title}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">{proj.description}</p>
                              {proj.tech.length > 0 && (
                                <div className="mt-1.5 flex flex-wrap gap-1">
                                  {proj.tech.map(t => (
                                    <span key={t} className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded">{t}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {parsed.certificates && parsed.certificates.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Extracted Certificates ({parsed.certificates.length})
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {parsed.certificates.map((cert, idx) => (
                            <div key={idx} className="flex justify-between items-center rounded-lg border bg-muted/20 p-2.5 text-sm">
                              <div>
                                <p className="font-semibold">{cert.title}</p>
                                <p className="text-xs text-muted-foreground">{cert.issuer}</p>
                              </div>
                              <span className="text-xs text-muted-foreground">{cert.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {parsed.achievements && parsed.achievements.length > 0 && (
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Extracted Achievements ({parsed.achievements.length})
                        </p>
                        <div className="grid grid-cols-1 gap-2">
                          {parsed.achievements.map((ach, idx) => (
                            <div key={idx} className="flex justify-between items-center rounded-lg border bg-muted/20 p-2.5 text-sm">
                              <div>
                                <p className="font-semibold">{ach.title}</p>
                                <p className="text-xs text-muted-foreground">{ach.description}</p>
                              </div>
                              <span className="text-xs text-muted-foreground">{ach.date}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <Wand2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div>
          <p className="text-sm font-medium text-primary">How it works</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Upload your resume and our parser extracts your name, contact info, skills, and links.
            The extracted data fills into the relevant sections — Profile, About, Skills — and you can
            edit everything afterward. Your resume file is not stored.
          </p>
        </div>
      </div>
    </div>
  );
}

function ExtractedField({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 rounded-lg border bg-card p-2.5">
      <Icon className="h-4 w-4 shrink-0 text-primary" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function countFilled(parsed: ParsedResume): number {
  let count = 0;
  if (parsed.fullName) count++;
  if (parsed.jobTitle) count++;
  if (parsed.email) count++;
  if (parsed.phone) count++;
  if (parsed.location) count++;
  if (parsed.website) count++;
  if (parsed.github) count++;
  if (parsed.linkedin) count++;
  if (parsed.twitter) count++;
  if (parsed.about) count++;
  count += parsed.skills.length;
  return count;
}

async function extractPdfText(file: File): Promise<string> {
  const pdfjs: any = await import('pdfjs-dist');
  const arrayBuffer = await file.arrayBuffer();
  const version = pdfjs.version || '4.0.370';

  // Fallbacks: Try mjs, then standard js, then cdnjs
  const workerUrls = [
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.mjs`,
    `https://cdn.jsdelivr.net/npm/pdfjs-dist@${version}/build/pdf.worker.min.js`,
    `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`
  ];

  for (let u = 0; u < workerUrls.length; u++) {
    try {
      pdfjs.GlobalWorkerOptions.workerSrc = workerUrls[u];
      const loadingTask = pdfjs.getDocument({
        data: new Uint8Array(arrayBuffer),
        isEvalSupported: false,
        useSystemFonts: true,
      });
      const pdf = await loadingTask.promise;
      return await extractTextFromPdfDoc(pdf);
    } catch (err) {
      console.warn(`Worker URL failed: ${workerUrls[u]}. Error:`, err);
      if (u === workerUrls.length - 1) {
        throw new Error('All PDFJS worker fallbacks failed to initialize.');
      }
    }
  }
  return '';
}

async function extractTextFromPdfDoc(pdf: any): Promise<string> {
  let fullText = '';
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items
      .map((item: any) => (item.str ? item.str : ''))
      .join(' ');
    fullText += strings + '\n';
  }
  return fullText;
}

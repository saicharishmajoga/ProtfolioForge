'use client';

import * as React from 'react';
import { FileText, Download, Loader2 } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { GradientButton } from '@/components/ui/gradient-button';
import { DEFAULT_PORTFOLIO_DATA } from '@/lib/portfolio-data';
import { PortfolioData } from '@/lib/portfolio-data';
import { generateResumeHTML } from '@/lib/resume-generator';
import { toast } from 'sonner';

interface ExportResumeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  portfolioName?: string;
  portfolioData?: PortfolioData;
}

export function ExportResumeDialog({ open, onOpenChange, portfolioName, portfolioData }: ExportResumeDialogProps) {
  const [generating, setGenerating] = React.useState(false);
  const [html, setHtml] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setGenerating(true);
      const timer = setTimeout(() => {
        const sourceData = portfolioData || DEFAULT_PORTFOLIO_DATA;
        const generated = generateResumeHTML(sourceData);
        setHtml(generated);
        setGenerating(false);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setHtml(null);
    }
  }, [open, portfolioData]);

  const handleExport = React.useCallback(() => {
    if (!html) return;
    const w = window.open('', '_blank');
    if (!w) {
      toast.error('Please allow popups to export your resume');
      return;
    }
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => {
      try {
        w.print();
      } catch {
        toast.error('Please use your browser\'s "Save as PDF" option in the print dialog');
      }
    }, 500);
    toast.success('Use "Save as PDF" in the print dialog to export your resume');
    onOpenChange(false);
  }, [html, onOpenChange]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> Export Resume
          </DialogTitle>
          <DialogDescription>
            Export a professional resume from your portfolio details for "{portfolioName || 'this portfolio'}" as a PDF.
          </DialogDescription>
        </DialogHeader>

        {generating ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Generating resume from your portfolio data...</p>
          </div>
        ) : html ? (
          <div className="space-y-4">
            <div className="flex items-start gap-3 rounded-xl border bg-muted/30 p-4">
              <FileText className="mt-0.5 h-5 w-5 shrink-0 text-success" />
              <div className="text-sm">
                <p className="font-medium text-foreground">Resume ready!</p>
                <p className="text-muted-foreground">Your resume has been generated from your portfolio details including profile, experience, education, projects, skills, and more.</p>
              </div>
            </div>
            <div className="flex items-start gap-2 rounded-lg border p-3 text-sm text-muted-foreground">
              <Download className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Clicking Export opens the print dialog — choose "Save as PDF" as the destination to download your resume.</span>
            </div>
          </div>
        ) : null}

        <DialogFooter>
          <GradientButton size="sm" onClick={handleExport} disabled={!html || generating} className="gap-2">
            <Download className="h-4 w-4" /> Export PDF
          </GradientButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

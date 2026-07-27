'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Award, Upload, X } from 'lucide-react';
import { usePortfolio } from '@/lib/portfolio-context';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GradientButton } from '@/components/ui/gradient-button';
import { toast } from 'sonner';

export function CertificatesForm() {
  const { data, addCertificate, updateCertificate, removeCertificate } = usePortfolio();

  const add = () => {
    addCertificate({ id: `c${Date.now()}`, title: 'New Certificate', issuer: '', date: '', image: '' });
    toast.success('Certificate added');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Certificates</h2>
          <p className="text-sm text-muted-foreground">Upload and showcase your certifications.</p>
        </div>
        <GradientButton size="sm" onClick={add} className="gap-1.5"><Plus className="h-4 w-4" /> Add</GradientButton>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <AnimatePresence>
          {data.certificates.map((c) => (
            <motion.div key={c.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
              <Card>
                <CardHeader className="flex-row items-center justify-between py-3">
                  <CardTitle className="text-base flex items-center gap-2"><Award className="h-4 w-4 text-accent" /> {c.title}</CardTitle>
                  <button onClick={() => { removeCertificate(c.id); toast.success('Removed'); }} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="relative h-32 overflow-hidden rounded-lg border bg-muted">
                    {c.image ? (
                      <>
                        <img src={c.image} alt={c.title} className="h-full w-full object-cover" />
                        <button onClick={() => updateCertificate(c.id, { image: '' })} className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur"><X className="h-3.5 w-3.5" /></button>
                      </>
                    ) : (
                      <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 text-sm text-muted-foreground hover:bg-muted/50">
                        <Upload className="h-5 w-5" /> Upload certificate
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              updateCertificate(c.id, { image: reader.result as string });
                              toast.success('Certificate image uploaded');
                            };
                            reader.readAsDataURL(f);
                          }
                        }} />
                      </label>
                    )}
                  </div>
                  <div className="space-y-1.5"><Label className="text-xs">Title</Label><Input value={c.title} onChange={(e) => updateCertificate(c.id, { title: e.target.value })} /></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5"><Label className="text-xs">Issuer</Label><Input value={c.issuer} onChange={(e) => updateCertificate(c.id, { issuer: e.target.value })} /></div>
                    <div className="space-y-1.5"><Label className="text-xs">Date</Label><Input value={c.date} onChange={(e) => updateCertificate(c.id, { date: e.target.value })} /></div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {data.certificates.length === 0 && (
        <Card className="flex flex-col items-center justify-center border-dashed border-2 py-16 text-center">
          <p className="text-muted-foreground">No certificates yet.</p>
          <GradientButton className="mt-4 gap-1.5" onClick={add}><Plus className="h-4 w-4" /> Add certificate</GradientButton>
        </Card>
      )}
    </div>
  );
}

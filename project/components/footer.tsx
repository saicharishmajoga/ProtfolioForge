'use client';

import * as React from 'react';
import Link from 'next/link';
import { Sparkles, Twitter, Github, Linkedin } from 'lucide-react';

const footerSections = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '/#features' },
      { label: 'How It Works', href: '/#how-it-works' },
      { label: 'Themes', href: '/#themes' },
      { label: 'Pricing', href: '/#pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'Tutorials', href: '#' },
      { label: 'Community', href: '#' },
      { label: 'Support', href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy', href: '#' },
      { label: 'GDPR', href: '#' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-brand">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold">PortfolioForge</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Build a beautiful developer portfolio in minutes. No code required.
            </p>
            <div className="mt-6 flex gap-3">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border bg-card transition-colors hover:bg-muted"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold">{section.title}</h3>
              <ul className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} PortfolioForge. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Crafted with care for developers everywhere.
          </p>
        </div>
      </div>
    </footer>
  );
}

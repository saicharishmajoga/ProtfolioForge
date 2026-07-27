'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FolderOpen, ArrowRight, Plus, Clock,
} from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { GradientButton } from '@/components/ui/gradient-button';
import { Badge } from '@/components/ui/badge';

import { getUser, getUserStorageItem, setUserStorageItem, removeUserStorageItem } from '@/lib/session-manager';

export default function DashboardPage() {
  const [userName, setUserName] = React.useState('User');
  const [recentPortfolios, setRecentPortfolios] = React.useState<any[]>([]);
  const [activityList, setActivityList] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = getUser();
      if (user && user.name) {
        setUserName(user.name);
      }

      const { fetchDatabaseSync } = require('@/lib/db-sync');
      fetchDatabaseSync().then((dbData: any) => {
        const source = (dbData && dbData.savedPortfolios) || getUserStorageItem('user_portfolios');
        if (source) {
          try {
            const parsed = JSON.parse(source);
            const filtered = parsed.filter((p: any) => 
              p.name !== 'Personal Portfolio' && 
              p.name !== 'Job Hunt Portfolio' && 
              p.name !== 'Open Source Portfolio'
            );
            setRecentPortfolios(filtered.slice(0, 3));
            setUserStorageItem('user_portfolios', JSON.stringify(filtered));
          } catch {
            setRecentPortfolios([]);
          }
        } else {
          setRecentPortfolios([]);
        }
      });

      const existingActivities = getUserStorageItem('user_activities');
      if (existingActivities) {
        try {
          setActivityList(JSON.parse(existingActivities));
        } catch {
          setActivityList([]);
        }
      } else {
        const initial = [
          { action: 'Registered account', time: 'Just now' }
        ];
        setUserStorageItem('user_activities', JSON.stringify(initial));
        setActivityList(initial);
      }
    }
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
        >
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Welcome back, {userName}!</h1>
            <p className="mt-1 text-muted-foreground">Here's what's happening with your portfolios.</p>
          </div>
          <Link href="/builder" onClick={() => { if (typeof window !== 'undefined') { removeUserStorageItem('editing_portfolio_data'); removeUserStorageItem('active_builder_portfolio'); sessionStorage.setItem('is_new_portfolio', 'true'); } }}>
            <GradientButton className="gap-2"><Plus className="h-4 w-4" /> New Portfolio</GradientButton>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent Portfolios */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Portfolios</CardTitle>
                <CardDescription>Manage and edit your portfolios</CardDescription>
              </div>
              <Link href="/dashboard/portfolios"><GradientButton variant="gradient-outline" size="sm">View all</GradientButton></Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentPortfolios.map((p) => (
                <div key={p.name} className="flex items-center justify-between rounded-xl border p-4 transition-colors hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <FolderOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.url}</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {activityList.map((a, i) => {
                let actionText = a.action;
                if (actionText === 'Updated profile details') {
                  let portfolioName = '';
                  try {
                    const activeDraft = getUserStorageItem('active_builder_portfolio');
                    if (activeDraft) {
                      const parsed = JSON.parse(activeDraft);
                      if (parsed?.profile?.fullName) {
                        portfolioName = `${parsed.profile.fullName}'s Portfolio`;
                      }
                    }
                  } catch {}
                  
                  if (!portfolioName) {
                    try {
                      const portfolios = getUserStorageItem('user_portfolios');
                      if (portfolios) {
                        const parsed = JSON.parse(portfolios);
                        if (parsed && parsed.length > 0) {
                          portfolioName = parsed[0].name;
                        }
                      }
                    } catch {}
                  }

                  if (!portfolioName) {
                    portfolioName = userName ? `${userName}'s Portfolio` : 'Personal Portfolio';
                  }
                  actionText = `Updated profile details for "${portfolioName}"`;
                }
                return (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <Clock className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <div>
                      <p>{actionText}</p>
                      <p className="text-xs text-muted-foreground">{a.time}</p>
                    </div>
                  </div>
                );
              })}
              {activityList.length === 0 && (
                <p className="text-xs text-muted-foreground text-center py-4">No recent activity.</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

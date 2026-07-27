'use client';

import * as React from 'react';
import { Lock, Bell, Trash2, AlertTriangle, Mail } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { GradientButton } from '@/components/ui/gradient-button';
import { Separator } from '@/components/ui/separator';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export default function SettingsPage() {
  const [notifications, setNotifications] = React.useState({
    email: true,
    productUpdates: true,
    marketing: false,
  });
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Settings</h1>
          <p className="mt-1 text-muted-foreground">Manage your account security and preferences.</p>
        </div>

        {/* Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5" /> Password</CardTitle>
            <CardDescription>Change your account password.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <Input type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
            </div>
            <GradientButton size="sm" onClick={() => { setCurrentPassword(''); setNewPassword(''); toast.success('Password updated successfully'); }}>
              Update Password
            </GradientButton>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> Notifications</CardTitle>
            <CardDescription>Choose what updates you want to receive.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1">
            {[
              { key: 'email' as const, label: 'Email notifications', desc: 'Important account and security alerts' },
              { key: 'productUpdates' as const, label: 'Product updates', desc: 'New features and improvements' },
              { key: 'marketing' as const, label: 'Marketing emails', desc: 'Tips, offers, and newsletters' },
            ].map((item, i, arr) => (
              <div key={item.key}>
                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key]}
                    onCheckedChange={(v) => setNotifications((prev) => ({ ...prev, [item.key]: v }))}
                  />
                </div>
                {i < arr.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-5 w-5" /> Danger Zone</CardTitle>
            <CardDescription>Irreversible account actions.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-xl border border-destructive/20 bg-destructive/5 p-4">
              <div>
                <p className="text-sm font-medium">Delete Account</p>
                <p className="text-sm text-muted-foreground">Permanently delete your account and all data.</p>
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <GradientButton variant="gradient-outline" size="sm" className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10">
                    <Trash2 className="h-4 w-4" /> Delete
                  </GradientButton>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. Deleting your account will permanently remove all your portfolios, projects, and personal data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive text-destructive-foreground hover:bg-destructive/90" onClick={() => toast.success('Account deletion requested')}>
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

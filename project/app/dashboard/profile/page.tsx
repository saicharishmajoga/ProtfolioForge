'use client';

import * as React from 'react';
import { User, Mail, MapPin, Save, Github, Linkedin, Twitter, Globe, Camera } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GradientButton } from '@/components/ui/gradient-button';
import { toast } from 'sonner';
import { getUser, getUserStorageItem, setUserStorageItem, getAccessToken, getRefreshToken, setSession } from '@/lib/session-manager';

export default function ProfilePage() {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [photo, setPhoto] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [bio, setBio] = React.useState('');
  const [website, setWebsite] = React.useState('');
  const [github, setGithub] = React.useState('');
  const [linkedin, setLinkedin] = React.useState('');
  const [twitter, setTwitter] = React.useState('');

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const user = getUser();
      if (user) {
        if (user.name) setName(user.name);
        if (user.email) setEmail(user.email);
        if (user.photo) setPhoto(user.photo);
      }
      
      const storedProfile = getUserStorageItem('user_profile_details');
      if (storedProfile) {
        try {
          const profile = JSON.parse(storedProfile);
          if (profile.location) setLocation(profile.location);
          if (profile.bio) setBio(profile.bio);
          if (profile.website) setWebsite(profile.website);
          if (profile.github) setGithub(profile.github);
          if (profile.linkedin) setLinkedin(profile.linkedin);
          if (profile.twitter) setTwitter(profile.twitter);
        } catch {}
      }
    }
  }, []);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setPhoto(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      const profile = { location, bio, website, github, linkedin, twitter };
      setUserStorageItem('user_profile_details', JSON.stringify(profile));

      const user = getUser();
      if (user) {
        user.name = name;
        user.email = email;
        user.photo = photo;
        const token = getAccessToken();
        const refresh = getRefreshToken();
        if (token && refresh) {
          setSession(token, refresh, user);
        }
      }
      
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
        portfolioName = name ? `${name}'s Portfolio` : 'Personal Portfolio';
      }

      const { addActivity } = require('@/lib/activity-helper');
      addActivity(`Updated profile details for "${portfolioName}"`);

      toast.success('Profile saved successfully');
      // Refresh the page to reload photo in the top bar layout avatar
      window.location.reload();
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Profile</h1>
          <p className="mt-1 text-muted-foreground">Manage your personal information and social links.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Avatar</CardTitle>
            <CardDescription>Your profile picture representation.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <Avatar className="h-20 w-20">
              {photo && <AvatarImage src={photo} className="object-cover" />}
              <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                {name ? name.substring(0, 2).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <input 
                type="file" 
                ref={fileInputRef} 
                accept="image/*" 
                onChange={handlePhotoChange} 
                className="hidden" 
              />
              <GradientButton 
                variant="gradient-outline" 
                size="sm" 
                className="gap-2"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" /> Upload Photo
              </GradientButton>
              {photo && (
                <button 
                  onClick={() => setPhoto('')} 
                  className="text-left text-xs text-destructive hover:underline"
                >
                  Remove photo
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Update your account details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={name} onChange={(e) => setName(e.target.value)} className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={location} onChange={(e) => setLocation(e.target.value)} className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={website} onChange={(e) => setWebsite(e.target.value)} className="pl-9" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Bio</Label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>Connect your social profiles.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label>GitHub</Label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={github} onChange={(e) => setGithub(e.target.value)} className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>LinkedIn</Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="pl-9" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Twitter</Label>
                <div className="relative">
                  <Twitter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input value={twitter} onChange={(e) => setTwitter(e.target.value)} className="pl-9" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <GradientButton className="gap-2" onClick={handleSave}>
            <Save className="h-4 w-4" /> Save Changes
          </GradientButton>
        </div>
      </div>
    </DashboardLayout>
  );
}

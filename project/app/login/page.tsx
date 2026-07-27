'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Eye, EyeOff, Github } from 'lucide-react';
import { AuthLayout } from '@/components/auth-layout';
import { GradientButton } from '@/components/ui/gradient-button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.message || 'Incorrect email or password');
      }

      // Import session-manager functions
      const { setSession, clearSession } = require('@/lib/session-manager');

      // Clear legacy storage cache of any previous user session
      clearSession();

      // Store token and user details using session manager
      setSession(resData.data.accessToken, resData.data.refreshToken, resData.data.user);

      const { addActivity } = require('@/lib/activity-helper');
      addActivity('Logged in');

      toast.success('Welcome back! Redirecting to your dashboard...');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Incorrect email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to continue building your portfolio"
      footer={
        <>
          Don't have an account?{' '}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              {...register('email')}
            />
          </div>
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Password</label>
            <Link href="/forgot-password" className="text-xs font-medium text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              className="pl-10 pr-10"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="remember"
            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary cursor-pointer"
            {...register('remember')}
          />
          <label htmlFor="remember" className="text-sm text-muted-foreground">Remember me for 30 days</label>
        </div>

        <GradientButton type="submit" className="w-full" loading={loading}>
          Sign in
        </GradientButton>


      </form>
    </AuthLayout>
  );
}

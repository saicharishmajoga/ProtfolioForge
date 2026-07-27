'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, Check } from 'lucide-react';
import { AuthLayout } from '@/components/auth-layout';
import { GradientButton } from '@/components/ui/gradient-button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success('Reset link sent! Check your inbox.');
    }, 800);
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter your email and we'll send you a reset link"
      footer={
        <Link href="/login" className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
            <Check className="h-8 w-8 text-success" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Check your email</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              We've sent a password reset link to your inbox. It may take a minute to arrive.
            </p>
          </div>
          <Link href="/login">
            <GradientButton variant="outline">Back to sign in</GradientButton>
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="email" placeholder="you@example.com" className="pl-10" {...register('email')} />
            </div>
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>
          <GradientButton type="submit" className="w-full" loading={loading}>
            Send reset link
          </GradientButton>
        </form>
      )}
    </AuthLayout>
  );
}

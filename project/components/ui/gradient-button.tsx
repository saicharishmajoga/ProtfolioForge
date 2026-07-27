'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

const gradientButtonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        gradient:
          'bg-gradient-to-r from-primary via-accent to-secondary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0',
        'gradient-outline':
          'border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 hover:border-primary/50',
        solid: 'bg-primary text-primary-foreground hover:bg-primary/90 hover:-translate-y-0.5 shadow-md shadow-primary/20 active:translate-y-0',
        outline:
          'border border-border bg-background hover:bg-muted hover:-translate-y-0.5 active:translate-y-0',
        ghost: 'hover:bg-muted',
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 rounded-md px-4 text-sm',
        lg: 'h-12 rounded-lg px-8 text-base',
        icon: 'h-11 w-11',
      },
    },
    defaultVariants: { variant: 'gradient', size: 'default' },
  }
);

export interface GradientButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof gradientButtonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

const GradientButton = React.forwardRef<HTMLButtonElement, GradientButtonProps>(
  ({ className, variant, size, asChild = false, loading, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(gradientButtonVariants({ variant, size, className }))}
        ref={ref as any}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </Comp>
    );
  }
);
GradientButton.displayName = 'GradientButton';

export { GradientButton, gradientButtonVariants };

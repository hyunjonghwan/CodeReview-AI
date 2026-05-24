import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

const badgeVariants = cva(
  [
    'inline-flex items-center gap-1 rounded-full border px-2 py-0.5',
    'text-xs font-medium select-none whitespace-nowrap',
    'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-spring)]',
    'focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-bg-default',
  ],
  {
    variants: {
      variant: {
        default: 'border-transparent bg-accent text-accent-fg',
        secondary: 'border-transparent bg-bg-muted text-fg-default',
        outline: 'border-border-strong bg-transparent text-fg-default',
        success:
          'border-success-border bg-success-bg text-success-fg dark:border-transparent dark:bg-success-default/20 dark:text-success-default',
        warning:
          'border-warning-border bg-warning-bg text-warning-fg dark:border-transparent dark:bg-warning-default/20 dark:text-warning-default',
        error:
          'border-error-border bg-error-bg text-error-fg dark:border-transparent dark:bg-error-default/20 dark:text-error-default',
        info: 'border-info-border bg-info-bg text-info-fg dark:border-transparent dark:bg-info-default/20 dark:text-info-default',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <span ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  ),
);
Badge.displayName = 'Badge';

export { badgeVariants };

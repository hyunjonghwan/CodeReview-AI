import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

export type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'border-border-default bg-bg-subtle text-fg-default flex h-9 w-full rounded-md border px-3 py-1 text-sm',
          'placeholder:text-fg-subtle',
          'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-spring)]',
          'focus-visible:ring-accent focus-visible:ring-offset-bg-default focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          'file:text-fg-default file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'aria-invalid:border-error-default aria-invalid:focus-visible:ring-error-default',
          className,
        )}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

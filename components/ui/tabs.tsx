'use client';

import * as TabsPrimitive from '@radix-ui/react-tabs';
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import { cn } from '@/lib/utils/cn';

export const Tabs = TabsPrimitive.Root;

export const TabsList = forwardRef<
  ElementRef<typeof TabsPrimitive.List>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      'bg-bg-muted text-fg-muted inline-flex h-9 items-center justify-center rounded-md p-1',
      className,
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

export const TabsTrigger = forwardRef<
  ElementRef<typeof TabsPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center gap-1.5 rounded px-3 py-1 text-sm font-medium whitespace-nowrap',
      'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out-spring)]',
      'focus-visible:ring-accent focus-visible:ring-offset-bg-default focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
      'disabled:pointer-events-none disabled:opacity-50',
      'data-[state=active]:bg-bg-subtle data-[state=active]:text-fg-default data-[state=active]:shadow-sm',
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

export const TabsContent = forwardRef<
  ElementRef<typeof TabsPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 focus-visible:outline-none',
      'focus-visible:ring-accent focus-visible:ring-offset-bg-default focus-visible:ring-2 focus-visible:ring-offset-2',
      className,
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

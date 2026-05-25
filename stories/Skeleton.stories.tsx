import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

const meta = {
  title: 'UI/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Block: Story = {
  render: () => <Skeleton className="h-10 w-[260px]" />,
};

export const TextLines: Story = {
  render: () => (
    <div className="flex w-[320px] flex-col gap-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  ),
};

export const ReviewRow: Story = {
  name: 'Review row placeholder (wireframe §2)',
  render: () => (
    <Card className="w-[480px] p-4">
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-6 w-16 rounded-md" />
      </div>
    </Card>
  ),
};

export const HeroLanding: Story = {
  name: 'Landing hero placeholder',
  render: () => (
    <div className="flex w-[480px] flex-col items-center gap-3">
      <Skeleton className="h-12 w-3/4" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-1/2" />
      <div className="mt-3 flex gap-3">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-44" />
      </div>
    </div>
  ),
};

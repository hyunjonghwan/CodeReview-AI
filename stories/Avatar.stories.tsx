import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const meta = {
  title: 'UI/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Image: Story = {
  render: () => (
    <Avatar>
      <AvatarImage src="https://avatars.githubusercontent.com/u/9919?v=4" alt="GitHub" />
      <AvatarFallback>GH</AvatarFallback>
    </Avatar>
  ),
};

export const Fallback: Story = {
  render: () => (
    <Avatar>
      <AvatarFallback>HJ</AvatarFallback>
    </Avatar>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar className="size-6 text-[10px]">
        <AvatarFallback>S</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarFallback>M</AvatarFallback>
      </Avatar>
      <Avatar className="size-12">
        <AvatarFallback>L</AvatarFallback>
      </Avatar>
    </div>
  ),
};

export const Group: Story = {
  name: 'Stacked group (reviewers)',
  render: () => (
    <div className="flex -space-x-2">
      <Avatar className="border-bg-default border-2">
        <AvatarFallback>HJ</AvatarFallback>
      </Avatar>
      <Avatar className="border-bg-default border-2">
        <AvatarFallback>AK</AvatarFallback>
      </Avatar>
      <Avatar className="border-bg-default border-2">
        <AvatarFallback className="text-fg-subtle">+3</AvatarFallback>
      </Avatar>
    </div>
  ),
};

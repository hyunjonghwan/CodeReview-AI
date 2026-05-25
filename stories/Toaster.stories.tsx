import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Toaster, toast } from '@/components/ui/toaster';
import { Button } from '@/components/ui/button';

const meta = {
  title: 'UI/Toaster',
  component: Toaster,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <>
        <Story />
        <Toaster />
      </>
    ),
  ],
} satisfies Meta<typeof Toaster>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Button onClick={() => toast('Review queued for Sonnet')}>Show toast</Button>,
};

export const Success: Story = {
  render: () => (
    <Button onClick={() => toast.success('Review complete · 3 issues found')}>Show success</Button>
  ),
};

export const ErrorToast: Story = {
  name: 'Error',
  render: () => (
    <Button
      variant="destructive"
      onClick={() => toast.error('Anthropic API timeout — retrying with Haiku')}
    >
      Show error
    </Button>
  ),
};

export const WithDescription: Story = {
  render: () => (
    <Button
      variant="outline"
      onClick={() =>
        toast('Routed to Opus', {
          description: 'Detected: deep-analysis · auth/credentials patterns',
        })
      }
    >
      Show with description
    </Button>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Button
      variant="secondary"
      onClick={() =>
        toast('Suggested fix applied', {
          action: {
            label: 'Undo',
            onClick: () => toast('Reverted'),
          },
        })
      }
    >
      Show with action
    </Button>
  ),
};

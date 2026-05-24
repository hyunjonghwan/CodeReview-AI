import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Badge } from '@/components/ui/badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'outline', 'success', 'warning', 'error', 'info'],
    },
  },
  args: { children: 'Badge', variant: 'default' },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary', children: 'Sonnet' },
};

export const Outline: Story = {
  args: { variant: 'outline', children: 'Haiku' },
};

// 4 semantic variants × CodeReview-AI 카테고리 매핑
// docs/wireframes.md: Bug / Perf / Style / Sec
export const Semantic: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="error">Bug</Badge>
      <Badge variant="warning">Perf</Badge>
      <Badge variant="info">Style</Badge>
      <Badge variant="success">Resolved</Badge>
    </div>
  ),
};

// docs/wireframes.md: 심각도 ▲ Critical / ◆ Major / ○ Minor
export const Severity: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="error">▲ Critical</Badge>
      <Badge variant="warning">◆ Major</Badge>
      <Badge variant="outline">○ Minor</Badge>
    </div>
  ),
};

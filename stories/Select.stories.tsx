import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const meta = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Pick a model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="haiku">Haiku</SelectItem>
        <SelectItem value="sonnet">Sonnet</SelectItem>
        <SelectItem value="opus">Opus</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Grouped: Story = {
  render: () => (
    <Select defaultValue="sonnet">
      <SelectTrigger className="w-[240px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Claude 4 family</SelectLabel>
          <SelectItem value="haiku">Haiku 4.5 — fast, cheap</SelectItem>
          <SelectItem value="sonnet">Sonnet 4.6 — balanced</SelectItem>
          <SelectItem value="opus">Opus 4.7 — deep analysis</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Auto</SelectLabel>
          <SelectItem value="auto">Let the router pick</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const Filter: Story = {
  name: 'Review list filter (wireframe §2)',
  render: () => (
    <div className="flex items-center gap-3">
      <Select defaultValue="all">
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All models</SelectItem>
          <SelectItem value="haiku">Haiku only</SelectItem>
          <SelectItem value="sonnet">Sonnet only</SelectItem>
          <SelectItem value="opus">Opus only</SelectItem>
        </SelectContent>
      </Select>
      <Select defaultValue="newest">
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="oldest">Oldest</SelectItem>
          <SelectItem value="severity">By severity</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Sign in to filter" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="x">Should not show</SelectItem>
      </SelectContent>
    </Select>
  ),
};

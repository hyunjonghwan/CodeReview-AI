import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Input } from '@/components/ui/input';

const meta = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'search', 'number'],
    },
    disabled: { control: 'boolean' },
  },
  args: { placeholder: 'Type something…', type: 'text' },
  decorators: [
    (Story) => (
      <div className="w-80">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  render: (args) => (
    <label className="text-fg-default flex flex-col gap-1.5 text-sm">
      <span className="font-medium">Email</span>
      <Input {...args} type="email" placeholder="you@example.com" />
    </label>
  ),
};

export const Search: Story = {
  args: { type: 'search', placeholder: 'Find a review…' },
};

export const Disabled: Story = {
  args: { disabled: true, value: 'disabled value' },
};

export const Invalid: Story = {
  render: (args) => (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-fg-default font-medium">Email</span>
      <Input {...args} type="email" defaultValue="not-an-email" aria-invalid />
      <span className="text-error-default text-xs">Enter a valid email address</span>
    </label>
  ),
};

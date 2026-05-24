import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const meta = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div className="w-[420px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card title</CardTitle>
        <CardDescription>A short description sits under the title.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-fg-muted text-sm">
          Body content. Use semantic spacing utilities for layout.
        </p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Delete review</CardTitle>
        <CardDescription>This action permanently removes the review.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-fg-muted text-sm">
          You won&apos;t be able to recover the issues or comments.
        </p>
      </CardContent>
      <CardFooter className="justify-end">
        <Button variant="ghost">Cancel</Button>
        <Button variant="destructive">Delete</Button>
      </CardFooter>
    </Card>
  ),
};

// docs/wireframes.md §2 ReviewList row pattern
export const ReviewRow: Story = {
  render: () => (
    <Card className="cursor-pointer">
      <CardHeader>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span aria-hidden className="bg-accent inline-block h-2 w-2 rounded-full" />
            <CardTitle className="text-sm font-medium">auth/login.ts</CardTitle>
          </div>
          <Badge variant="secondary">Opus</Badge>
        </div>
        <CardDescription>3 issues · 1 critical · 2m ago</CardDescription>
      </CardHeader>
      <CardFooter className="gap-2">
        <Badge variant="error">Bug</Badge>
        <Badge variant="warning">Sec</Badge>
      </CardFooter>
    </Card>
  ),
};
